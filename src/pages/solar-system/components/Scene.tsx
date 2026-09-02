import { useContext, useEffect, useLayoutEffect, useRef } from "react"
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

    useLayoutEffect(() => {
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
            const object = scene.getObjectByName(focus)
            if (!object) return

            object.updateMatrixWorld(true)
            object.getWorldPosition(currentTargetPos.current)

            if (lastFocusedId.current !== focus) {
                lastFocusedId.current = focus
                isZooming.current = true
                lastTargetPos.current.copy(currentTargetPos.current)
            } else {
                deltaMove.current.subVectors(currentTargetPos.current, lastTargetPos.current)
                if (!pauseOrbitWhenFocus) {
                    state.camera.position.add(deltaMove.current)
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
