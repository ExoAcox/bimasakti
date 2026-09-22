/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Quaternion, Group } from "three"
import { SHIP_SCALE } from "@constants"
import { Spaceship } from "./object"
import { useShipStore } from "@state"

const cameraOffset = new Vector3(0, 4 * SHIP_SCALE, SHIP_SCALE * 12)
const cockpitOffset = new Vector3(0, SHIP_SCALE * 2.75, SHIP_SCALE * 1.0)
const cockpitTargetOffset = new Vector3(0, SHIP_SCALE * 2.75, SHIP_SCALE * 1.0)

const ThirdPersonScene = () => {
    const controlRef = useRef<OrbitControlsType>(null!)
    const targetHelperRef = useRef<Group>(null!)
    const lastPos = useRef(new Vector3())
    const currentPos = useRef(new Vector3())
    const currentQuat = useRef(new Quaternion())
    const prevQuat = useRef(new Quaternion())
    const deltaQuat = useRef(new Quaternion())
    const invPrevQuat = useRef(new Quaternion())
    const deltaMove = useRef(new Vector3())
    const rotCockpitOffset = useRef(new Vector3())
    const rotCockpitTargetOffset = useRef(new Vector3())
    const worldUp = useRef(new Vector3(0, 1, 0))
    const rotUp = useRef(new Vector3())
    const prevTarget = useRef(new Vector3())
    const camRelVec = useRef(new Vector3())
    const initializedCockpit = useRef(false)

    const { camera } = useThree()
    const { cockpit } = useShipStore()

    useEffect(() => {
        if (!controlRef.current) return
        const persCam = camera as unknown as { fov: number; updateProjectionMatrix: () => void }
        if (cockpit) {
            persCam.fov = 45
            persCam.updateProjectionMatrix()
            initializedCockpit.current = false
        } else {
            persCam.fov = 75
            persCam.updateProjectionMatrix()
            camera.up.set(0, 1, 0)
            controlRef.current.target.copy(currentPos.current)
            camera.position.copy(currentPos.current).add(cameraOffset)
            controlRef.current.update()
        }
        lastPos.current.copy(currentPos.current)
    }, [cockpit])

    // Camera follow spaceship
    useFrame(({ scene }) => {
        const spaceship = scene.getObjectByName("spaceship")
        if (!spaceship || !controlRef.current) return

        spaceship.getWorldPosition(currentPos.current)
        spaceship.getWorldQuaternion(currentQuat.current)

        if (cockpit) {
            rotCockpitTargetOffset.current.copy(cockpitTargetOffset).applyQuaternion(currentQuat.current)
            const newTarget = currentPos.current.clone().add(rotCockpitTargetOffset.current)

            if (!initializedCockpit.current) {
                // First frame entering cockpit: set initial camera position & target
                rotCockpitOffset.current.copy(cockpitOffset).applyQuaternion(currentQuat.current)
                camera.position.copy(currentPos.current).add(rotCockpitOffset.current)
                controlRef.current.target.copy(newTarget)

                rotUp.current.copy(worldUp.current).applyQuaternion(currentQuat.current)
                camera.up.copy(rotUp.current)

                prevQuat.current.copy(currentQuat.current)
                prevTarget.current.copy(newTarget)
                initializedCockpit.current = true
            } else {
                // Calculate rotation delta of ship since last frame: deltaQuat = currentQuat * inv(prevQuat)
                invPrevQuat.current.copy(prevQuat.current).invert()
                deltaQuat.current.copy(currentQuat.current).multiply(invPrevQuat.current)

                // Vector from previous target to current camera position
                camRelVec.current.subVectors(camera.position, prevTarget.current)

                // Rotate relative camera vector and camera UP by deltaQuat
                camRelVec.current.applyQuaternion(deltaQuat.current)
                camera.up.applyQuaternion(deltaQuat.current)

                // Set new camera position and target
                camera.position.copy(newTarget).add(camRelVec.current)
                controlRef.current.target.copy(newTarget)

                prevQuat.current.copy(currentQuat.current)
                prevTarget.current.copy(newTarget)
            }
        } else {
            initializedCockpit.current = false
            camera.up.set(0, 1, 0)

            // Calculate position delta of the spaceship since last frame
            deltaMove.current.subVectors(currentPos.current, lastPos.current)

            // Move camera alongside spaceship to maintain view distance
            camera.position.add(deltaMove.current)
            controlRef.current.target.copy(currentPos.current)
        }

        controlRef.current.update()

        // Sync helper mesh position with OrbitControls target
        if (targetHelperRef.current) {
            targetHelperRef.current.position.copy(controlRef.current.target)
        }

        lastPos.current.copy(currentPos.current)
    })

    return (
        <>
            <Spaceship />

            {/* Helper visual untuk melihat titik tengah (target) OrbitControls */}
            {/* <group ref={targetHelperRef}>
                <mesh>
                    <sphereGeometry args={[SHIP_SCALE * 0.1, 16, 16]} />
                    <meshBasicMaterial color="#ff0055" wireframe depthTest={false} />
                </mesh>
                <axesHelper args={[SHIP_SCALE * 0.5]} />
            </group> */}

            <OrbitControls
                makeDefault
                // enableDamping
                // dampingFactor={0.01}
                minDistance={cockpit ? 1e-11 : SHIP_SCALE * 20}
                maxDistance={cockpit ? SHIP_SCALE * 2 : SHIP_SCALE * 500}
                minPolarAngle={cockpit ? Math.PI / 3 : 0}
                // maxPolarAngle={cockpit ? Math.PI / 1.6 : Math.PI}
                // minAzimuthAngle={cockpit ? -Math.PI / 2.5 : -Infinity}
                // maxAzimuthAngle={cockpit ? Math.PI / 2.5 : Infinity}
                ref={controlRef}
            />
        </>
    )
}

export default ThirdPersonScene


