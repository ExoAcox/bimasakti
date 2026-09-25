/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Quaternion, Group, MathUtils } from "three"
import { SHIP_SCALE } from "@constants"
import { Spaceship } from "./object"
import { useShipStore } from "@state"

const cameraOffset = new Vector3(0, 4 * SHIP_SCALE, SHIP_SCALE * 12)
const cockpitOffset = new Vector3(0, SHIP_SCALE * 2.75, SHIP_SCALE * 1.0)

const SpaceshipScene = () => {
    const controlRef = useRef<OrbitControlsType>(null!)
    const targetHelperRef = useRef<Group>(null!)
    const lastPos = useRef(new Vector3())
    const currentPos = useRef(new Vector3())
    const currentQuat = useRef(new Quaternion())
    const prevQuat = useRef(new Quaternion())
    const deltaQuat = useRef(new Quaternion())
    const invPrevQuat = useRef(new Quaternion())
    const rotCockpitOffset = useRef(new Vector3())
    const worldUp = useRef(new Vector3(0, 1, 0))
    const rotUp = useRef(new Vector3())
    const prevTarget = useRef(new Vector3())
    const camRelVec = useRef(new Vector3())
    const initialized1stPerson = useRef(false)
    const initialized3rdPerson = useRef(false)

    const { camera } = useThree()
    const { cockpit } = useShipStore()

    // useEffect(() => {
    //     if (!controlRef.current) return
    //     const persCam = camera as unknown as { fov: number; updateProjectionMatrix: () => void }
    //     if (cockpit) {
    //         persCam.fov = 45
    //         persCam.updateProjectionMatrix()
    //         initialized1stPerson.current = false
    //     } else {
    //         persCam.fov = 75
    //         persCam.updateProjectionMatrix()
    //         camera.up.set(0, 1, 0)
    //         controlRef.current.target.copy(currentPos.current)
    //         camera.position.copy(currentPos.current).add(cameraOffset)
    //         controlRef.current.update()
    //     }
    //     lastPos.current.copy(currentPos.current)
    // }, [cockpit])

    // Camera follow spaceship
    useFrame(({ scene }) => {
        const spaceship = scene.getObjectByName("spaceship")
        if (!spaceship || !controlRef.current) return

        spaceship.getWorldPosition(currentPos.current)
        spaceship.getWorldQuaternion(currentQuat.current)

        if (cockpit) {
            initialized3rdPerson.current = false
            rotCockpitOffset.current.copy(cockpitOffset).applyQuaternion(currentQuat.current)
            const eyePos = currentPos.current.clone().add(rotCockpitOffset.current)

            if (!initialized1stPerson.current) {
                // First frame entering cockpit: lock camera position inside cockpit & look straight forward (-Z)
                camera.position.copy(eyePos)

                const forwardVec = new Vector3(0, 0, -SHIP_SCALE).applyQuaternion(currentQuat.current)
                controlRef.current.target.copy(eyePos).add(forwardVec)

                rotUp.current.copy(worldUp.current).applyQuaternion(currentQuat.current)
                camera.up.copy(rotUp.current)

                prevQuat.current.copy(currentQuat.current)
                initialized1stPerson.current = true
            } else {
                // Calculate rotation delta of ship since last frame: deltaQuat = currentQuat * inv(prevQuat)
                invPrevQuat.current.copy(prevQuat.current).invert()
                deltaQuat.current.copy(currentQuat.current).multiply(invPrevQuat.current)

                // Current looking direction vector relative to camera position
                camRelVec.current.subVectors(controlRef.current.target, camera.position)

                // Rotate look direction and camera UP by deltaQuat as ship turns
                camRelVec.current.applyQuaternion(deltaQuat.current)
                camera.up.applyQuaternion(deltaQuat.current)

                // Enforce LOCAL POV limits relative to the cockpit windshield (72 deg left/right, -30 to +45 deg up/down)
                const invShipQuat = currentQuat.current.clone().invert()
                const localLook = camRelVec.current.clone().applyQuaternion(invShipQuat).normalize()

                const localYaw = Math.atan2(-localLook.x, -localLook.z)
                const localPitch = Math.asin(MathUtils.clamp(localLook.y, -1, 1))

                // Clamp local POV angles relative to ship windshield
                const clampedYaw = MathUtils.clamp(localYaw, -Math.PI / 2.5, Math.PI / 2.5)
                const clampedPitch = MathUtils.clamp(localPitch, -Math.PI / 6, Math.PI / 4)

                const cosP = Math.cos(clampedPitch)
                localLook.set(
                    -cosP * Math.sin(clampedYaw),
                    Math.sin(clampedPitch),
                    -cosP * Math.cos(clampedYaw)
                )

                // Transform clamped local look vector back to world space
                camRelVec.current.copy(localLook).applyQuaternion(currentQuat.current).multiplyScalar(SHIP_SCALE)

                // HARD LOCK camera position inside cockpit seat
                camera.position.copy(eyePos)
                controlRef.current.target.copy(eyePos).add(camRelVec.current)

                prevQuat.current.copy(currentQuat.current)
            }
        } else {
            initialized1stPerson.current = false
            camera.up.set(0, 1, 0)

            if (!initialized3rdPerson.current) {
                // First frame entering 3rd person mode: place camera behind ship facing forward
                const rotCamOffset = cameraOffset.clone().applyQuaternion(currentQuat.current)
                camera.position.copy(currentPos.current).add(rotCamOffset)
                controlRef.current.target.copy(currentPos.current)

                prevQuat.current.copy(currentQuat.current)
                prevTarget.current.copy(currentPos.current)
                initialized3rdPerson.current = true
            } else {
                // Calculate rotation delta of ship since last frame: deltaQuat = currentQuat * inv(prevQuat)
                invPrevQuat.current.copy(prevQuat.current).invert()
                deltaQuat.current.copy(currentQuat.current).multiply(invPrevQuat.current)

                // Vector from previous target position to current camera position
                camRelVec.current.subVectors(camera.position, prevTarget.current)

                // Rotate relative camera position vector by deltaQuat
                camRelVec.current.applyQuaternion(deltaQuat.current)

                // Set new camera position and target
                camera.position.copy(currentPos.current).add(camRelVec.current)
                controlRef.current.target.copy(currentPos.current)

                prevQuat.current.copy(currentQuat.current)
                prevTarget.current.copy(currentPos.current)
            }
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
                minDistance={cockpit ? 1e-11 : SHIP_SCALE * 20}
                maxDistance={cockpit ? SHIP_SCALE * 2 : SHIP_SCALE * 500}
                enableZoom={!cockpit}
                // minPolarAngle={0}
                // maxPolarAngle={Math.PI}
                // minAzimuthAngle={-Infinity}
                // maxAzimuthAngle={Infinity}
                ref={controlRef}
            />
        </>
    )
}

export default SpaceshipScene


