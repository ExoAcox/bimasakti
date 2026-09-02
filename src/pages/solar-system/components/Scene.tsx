import { useContext, useEffect, useRef } from "react"
import { ControlContext } from "../context"
import { useBounds } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, MathUtils } from "three"




interface Props {
    children: React.ReactNode
    controlRef: React.RefObject<OrbitControlsImpl>
}

const position = {
    "solar-system": [3, 3, 3],
    "alpha-centauri": [0, 3000, 5000]
}

const Scene = ({ children, controlRef }: Props) => {
    const lastTargetPos = useRef(new Vector3())
    const currentTargetPos = useRef(new Vector3())
    const deltaMove = useRef(new Vector3())
    const lastFocusedId = useRef<string | null>(null)
    const isZooming = useRef(false)

    const bound = useBounds()
    const { universe, focus, focusIndex, pauseOrbitWhenFocus } = useContext(ControlContext)

    const { scene, camera } = useThree()

    useEffect(() => {
        if (controlRef.current) {
            const [x, y, z] = position[universe] || [0, 0, 0]

            controlRef.current.target.set(0, 0, 0);
            camera.position.set(x, y, z);
            controlRef.current.update();
        }
    }, [universe, controlRef, camera.position])

    useEffect(() => {
        if (!focus) return;
        const target = scene.getObjectByName(focus)
        bound.refresh(target).fit()
    }, [bound, focus, scene, focusIndex])

    useFrame((state) => {
        if (focus) {
            if (pauseOrbitWhenFocus) return

            const object = scene.getObjectByName(focus)
            if (!object) return

            object.updateMatrixWorld(true)
            object.getWorldPosition(currentTargetPos.current)

            if (lastFocusedId.current !== focus) {
                lastFocusedId.current = focus
                isZooming.current = true
            }

            if (lastTargetPos.current.lengthSq() > 0) {
                deltaMove.current.subVectors(currentTargetPos.current, lastTargetPos.current)
                state.camera.position.add(deltaMove.current)

                if (isZooming.current) {
                    const distanceToTarget = state.camera.position.distanceTo(currentTargetPos.current)
                    const objectScale = object.getWorldScale(new Vector3()).x
                    const idealDistance = objectScale * 3.5

                    if (Math.abs(distanceToTarget - idealDistance) > objectScale * 0.1) {
                        const direction = new Vector3().subVectors(state.camera.position, currentTargetPos.current).normalize()
                        const lerpedDistance = MathUtils.lerp(distanceToTarget, idealDistance, 0.25)
                        const targetCameraPos = currentTargetPos.current.clone().add(direction.multiplyScalar(lerpedDistance))
                        state.camera.position.lerp(targetCameraPos, 0.25)
                    } else {
                        isZooming.current = false
                    }
                }
            }

            controlRef.current.target.copy(currentTargetPos.current)
            controlRef.current.update()

            lastTargetPos.current.copy(currentTargetPos.current)
        } else {
            lastFocusedId.current = null
            isZooming.current = false
        }
    })

    return <group>
        {children}
    </group>
}

export default Scene
