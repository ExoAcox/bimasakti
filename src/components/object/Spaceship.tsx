import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Gltf, useGLTF, useKeyboardControls } from "@react-three/drei"
import { Vector3, Quaternion, Matrix4, MathUtils, Group, Scene, DoubleSide } from "three"
import { useSettingStore, useControlStore, useShipStore } from "@state"
import { SHIP_SCALE } from "@constants"

export enum Controls {
    forward = "forward",
    backward = "backward",
    left = "left",
    right = "right",
    up = "up",
    down = "down",
    boost = "boost",
    autopilot = "autopilot",
    cockpit = "cockpit",
}

export const keyboardMap = [
    { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
    { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
    { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
    { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
    { name: Controls.up, keys: ["KeyQ"] },
    { name: Controls.down, keys: ["KeyE"] },
    { name: Controls.boost, keys: ["Space"] },
    { name: Controls.autopilot, keys: ["KeyF"] },
    { name: Controls.cockpit, keys: ["KeyC"] },
]

// Reusable three objects to prevent GC overhead during useFrame
const moveDir = new Vector3()
const shipPos = new Vector3()
const targetPos = new Vector3()
const objPos = new Vector3()
const dirToObj = new Vector3()
const targetMatrix = new Matrix4()
const targetQuat = new Quaternion()
const rotMatrix = new Matrix4()
const qYaw = new Quaternion()
const qPitch = new Quaternion()
const axisY = new Vector3(0, 1, 0)
const axisX = new Vector3(1, 0, 0)

const CockpitModel = () => {
    const { scene } = useGLTF("/models/space_cockpit.glb")

    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat: any) => {
                        mat.side = DoubleSide
                    })
                } else {
                    child.material.side = DoubleSide
                }
            }
        })
    }, [scene])

    return <primitive object={scene} rotation={[0, MathUtils.degToRad(180), 0]} />
}

const Spaceship = () => {
    const groupRef = useRef<Group>(null!)
    const { focus } = useControlStore()
    const { autopilot, cockpit, setShip } = useShipStore()
    const [, getKeys] = useKeyboardControls<Controls>()

    const prevAutopilotKey = useRef(false)
    const prevCockpitKey = useRef(false)
    const { distanceScale, sizeScale } = useSettingStore()
    const { scene, camera } = useThree()

    const step = 1 / distanceScale

    // useEffect(() => {
    //     if (!focus) return

    //     const group = groupRef.current
    //     shipPos.copy(group.position)
    //     const shipQuat = group.quaternion

    //     const object = focus ? scene.getObjectByName(focus) : null

    //     let dist = 0
    //     let targetRadius = 0.05

    //     if (object) {
    //         object.getWorldPosition(targetPos)
    //         targetRadius = object.userData?.radius ? (object.userData.radius / sizeScale) : 0.05
    //         dist = shipPos.distanceTo(targetPos)
    //     }

    //     const rotationLockDistance = Math.max(targetRadius * 3.5, 0.001)


    //     if (dist > rotationLockDistance) {
    //         targetMatrix.lookAt(shipPos, targetPos, camera.up)
    //         targetQuat.setFromRotationMatrix(targetMatrix)
    //         shipQuat.slerp(targetQuat, Math.min(1, 10))
    //     }

    // }, [camera.up, focus, scene, sizeScale])

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const group = groupRef.current
        shipPos.copy(group.position)
        const shipQuat = group.quaternion

        // Read active keys from Drei's KeyboardControls
        const keys = getKeys()
        const isForward = keys[Controls.forward]
        const isBackward = keys[Controls.backward]
        const isLeft = keys[Controls.left]
        const isRight = keys[Controls.right]
        const isUp = keys[Controls.up]
        const isDown = keys[Controls.down]
        const isBoost = keys[Controls.boost]
        const isAutopilotKey = keys[Controls.autopilot]
        const isCockpitKey = keys[Controls.cockpit]

        // Toggle Autopilot on F key press
        if (isAutopilotKey && !prevAutopilotKey.current) {
            setShip({ autopilot: !autopilot })
        }
        prevAutopilotKey.current = Boolean(isAutopilotKey)

        // Toggle Cockpit on C key press
        if (isCockpitKey && !prevCockpitKey.current) {
            setShip({ cockpit: !cockpit })
        }
        prevCockpitKey.current = Boolean(isCockpitKey)

        // Manual steering disengages Autopilot automatically
        if (isLeft || isRight || isUp || isDown || isForward || isBackward) {
            if (autopilot) setShip({ autopilot: false })
        }

        // Calculate distance to target object if focus exists
        const object = focus ? state.scene.getObjectByName(focus) : null
        let dist = 0
        let targetRadius = 0.05

        if (object) {
            object.getWorldPosition(targetPos)
            targetRadius = object.userData?.radius ? (object.userData.radius / sizeScale) : 0.05
            dist = shipPos.distanceTo(targetPos)

            // Direct DOM update for 60 FPS distance display on ShipPanel
            const distEl = document.getElementById("ship-target-distance")
            if (distEl) {
                const realDistance = dist * distanceScale
                distEl.innerText = `${realDistance.toFixed(2)} AU`
            }
        } else {
            const distEl = document.getElementById("ship-target-distance")
            if (distEl) {
                distEl.innerText = "--"
            }
        }

        // Collision prevention against ANY celestial object in the scene
        const applyCollisionPrevention = () => {
            state.scene.traverse((child) => {
                if (child.name === "spaceship" || !child.userData?.radius) return

                const radius = child.userData.radius
                if (typeof radius !== "number" || radius <= 0) return

                child.getWorldPosition(objPos)
                const objDist = shipPos.distanceTo(objPos)
                const objRadius = radius / sizeScale
                const minSurfaceDist = Math.max(objRadius * 1.5, 0.0005)

                if (objDist < minSurfaceDist && objDist > 0) {
                    dirToObj.subVectors(objPos, shipPos).normalize()
                    const dot = moveDir.dot(dirToObj)
                    if (dot > 0) {
                        moveDir.sub(dirToObj.multiplyScalar(dot))
                    }
                }
            })
        }

        // 1. Autopilot Homing Logic
        if (autopilot && object) {
            const targetArrivalDist = Math.max(targetRadius * 1.5, 0.0005)
            const rotationLockDistance = Math.max(targetRadius * 3.5, 0.001)

            const effectDist = dist - targetArrivalDist

            if (effectDist > 0) {
                const dirToTarget = new Vector3().subVectors(targetPos, shipPos).normalize()

                // Point spaceship towards target planet with smooth slerp
                if (dist > rotationLockDistance) {
                    targetMatrix.lookAt(shipPos, targetPos, state.camera.up)
                    targetQuat.setFromRotationMatrix(targetMatrix)
                    shipQuat.slerp(targetQuat, Math.min(1, delta * 8.0))
                }

                // Smooth exponential deceleration as ship approaches arrival distance
                const maxSafeSpeed = effectDist / Math.max(delta * 1.05, 0.001)
                const smoothSpeed = effectDist * 3.5
                const speedPerSec = Math.min(smoothSpeed, maxSafeSpeed)

                // Move spaceship position directly along dirToTarget vector
                moveDir.copy(dirToTarget).multiplyScalar(speedPerSec * delta)
                applyCollisionPrevention()
                group.position.add(moveDir)
            } else {
                // Arrived at target planet smoothly
                setShip({ autopilot: false, distance: 0 })
            }
        } else {
            // 2. Manual Steering & Rotation (Q/E for Pitch, A/D for Yaw)
            let pitch = 0
            let yaw = 0

            if (isUp) pitch += 0.01
            if (isDown) pitch -= 0.01
            if (isLeft) yaw += 0.02
            if (isRight) yaw -= 0.02

            if (pitch !== 0 || yaw !== 0) {
                qYaw.setFromAxisAngle(axisY, yaw)
                qPitch.setFromAxisAngle(axisX, pitch)
                shipQuat.multiply(qYaw).multiply(qPitch).normalize()
            }

            // 3. Manual Forward / Backward Thrust (translate position directly)
            let speed = isBoost ? step * 100000 : step * 10000
            moveDir.set(0, 0, 0)

            if (isBoost) moveDir.z -= 1
            if (isForward) moveDir.z -= 1
            if (isBackward) {
                moveDir.z += 1
                speed *= 0.2
            }

            if (moveDir.lengthSq() > 0) {
                moveDir.normalize().multiplyScalar(speed * delta).applyQuaternion(shipQuat)
                applyCollisionPrevention()
                group.position.add(moveDir)
            }
        }
    })

    return (
        <group ref={groupRef} name="spaceship" position={[0, 0, 20]}>
            <group scale={SHIP_SCALE}>
                {cockpit ? (
                    <CockpitModel />
                ) : (
                    <Gltf src="/models/space_ship.glb" rotation={[0, MathUtils.degToRad(-90), 0]} />
                )}
            </group>
        </group>
    )
}

export default Spaceship