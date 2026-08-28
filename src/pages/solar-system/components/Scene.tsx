import { useContext, useEffect, useRef } from "react"
import type { Group } from "three"
import { ControlContext } from "../context"
import { useBounds } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { Vector3, MathUtils, EquirectangularReflectionMapping, SRGBColorSpace } from "three"
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js';




interface Props {
    children: React.ReactNode
    cameraRef: React.RefObject<OrbitControlsImpl>
}

const Scene = ({ children, cameraRef }: Props) => {
    const sceneRef = useRef<Group>(null!)

    const lastTargetPos = useRef(new Vector3())
    const currentTargetPos = useRef(new Vector3())
    const deltaMove = useRef(new Vector3())
    const lastFocusedId = useRef<string | null>(null)
    const isZooming = useRef(false)

    const bound = useBounds()
    const { focus, focusIndex, pauseOrbitWhenFocus } = useContext(ControlContext)

    const { scene } = useThree()



    useEffect(() => {
        if (!focus) return;
        const target = sceneRef.current.getObjectByName(focus)
        bound.refresh(target).fit()
    }, [bound, focus, focusIndex])

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

            cameraRef.current.target.copy(currentTargetPos.current)
            cameraRef.current.update()

            lastTargetPos.current.copy(currentTargetPos.current)
        } else {
            lastFocusedId.current = null
            isZooming.current = false
        }
    })

    return <group ref={sceneRef}>
        {children}
    </group>
}

export default Scene
