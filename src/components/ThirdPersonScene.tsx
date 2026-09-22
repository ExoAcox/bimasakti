import { useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import { SHIP_SCALE } from "@constants"
import { Spaceship } from "./object"

const INITIAL_CAMERA_OFFSET = new Vector3(0, 4 * SHIP_SCALE, 12 * SHIP_SCALE)

const ThirdPersonScene = () => {
    const controlRef = useRef<OrbitControlsType>(null!)
    const lastPos = useRef(new Vector3())
    const currentPos = useRef(new Vector3())
    const deltaMove = useRef(new Vector3())
    const initialized = useRef(false)


    // Camera follow spaceship
    useFrame(({ scene, camera }) => {
        const spaceship = scene.getObjectByName("spaceship")
        if (!spaceship || !controlRef.current) return

        spaceship.getWorldPosition(currentPos.current)

        if (!initialized.current) {
            // Set initial camera target and position scaled to spaceship size
            controlRef.current.target.copy(currentPos.current)
            camera.position.copy(currentPos.current).add(INITIAL_CAMERA_OFFSET)
            controlRef.current.update()
            lastPos.current.copy(currentPos.current)
            initialized.current = true
            return
        }

        // Calculate position delta of the spaceship since last frame
        deltaMove.current.subVectors(currentPos.current, lastPos.current)

        // Move camera alongside spaceship to maintain view distance
        camera.position.add(deltaMove.current)

        // Update orbit target to focus spaceship position
        controlRef.current.target.copy(currentPos.current)
        controlRef.current.update()

        lastPos.current.copy(currentPos.current)
    })

    return (<>
        <Spaceship />

        <OrbitControls
            makeDefault
            enableDamping
            minDistance={SHIP_SCALE * 20}
            ref={controlRef}
        />
    </>

    )
}

export default ThirdPersonScene
