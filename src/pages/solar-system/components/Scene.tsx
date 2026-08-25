import { useContext, useEffect, useRef } from "react"
import type { Group } from "three"
import { ControlContext } from "../context"
import { useBounds, type OrbitControlsChangeEvent } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"




interface Props {
    children: React.ReactNode
}

const Scene = ({ children }: Props) => {
    const sceneRef = useRef<Group>(null!)

    const bound = useBounds()
    const { focus, focusIndex } = useContext(ControlContext)

    const { camera } = useThree()

    useEffect(() => {
        if (!focus) return;
        const target = sceneRef.current.getObjectByName(focus)
        console.log(target, "target")
        bound.refresh(target).fit()


    }, [bound, focus, focusIndex])

    // useFrame((state, delta) => {
    //     if (!focus) return;

    //     const target = sceneRef.current.getObjectByName(focus)
    //     if (!target) return;

    //     const targetPosition = new Vector3()
    //     const desiredCameraPosition = new Vector3()

    //     const position = target.getWorldPosition(targetPosition)
    //     desiredCameraPosition.set(position.x, position.y, position.z)

    //     state.camera.position.lerp(desiredCameraPosition, 0.05)

    //     // const controls = state.controls as any;
    //     // const isUserInteracting = controls.isDragging

    //     // if (isUserInteracting) return;
    //     // controls.target.lerp(targetPosition, 0.05)
    //     // controls.update()

    //     // bound.refresh(target).fit()
    // })


    return <group ref={sceneRef}>
        {children}
    </group>
}

export default Scene
