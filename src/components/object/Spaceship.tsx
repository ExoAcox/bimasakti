/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useKeyboardControls } from "@react-three/drei"
import { Vector3, Quaternion, Matrix4, MathUtils, Group, DoubleSide, Mesh, MeshStandardMaterial } from "three"
import { useSettingStore, useControlStore } from "@state"
import { SHIP_SCALE } from "@constants"
import { Mode } from "@types"
import { When } from "react-if"

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
const qYaw = new Quaternion()
const qPitch = new Quaternion()
const axisY = new Vector3(0, 1, 0)
const axisX = new Vector3(1, 0, 0)

const tuneSpaceshipMaterial = (mesh: Mesh) => {
    if (!mesh.isMesh || !mesh.material) return
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((mat) => {
        mat.side = DoubleSide
        const stdMat = mat as MeshStandardMaterial
        if (typeof stdMat.roughness === "number") {
            // Lower roughness so the material absorbs less light and reflects more specularity
            stdMat.roughness = Math.min(stdMat.roughness, 0.1)
        }
        // if (typeof stdMat.envMapIntensity === "number") {
        //     // Boost ambient environment map reflection so dark space shadows are illuminated
        //     stdMat.envMapIntensity = 3.0
        // }
    })
}

const CockpitModel = () => {
    const { scene } = useGLTF("/models/space_cockpit.glb")

    useEffect(() => {
        scene.traverse((child) => {
            tuneSpaceshipMaterial(child as Mesh)
        })
    }, [scene])

    return <primitive object={scene} rotation={[0, MathUtils.degToRad(180), 0]} />
}

const ShipModel = () => {
    const { scene } = useGLTF("/models/space_ship.glb")

    useEffect(() => {
        scene.traverse((child) => {
            tuneSpaceshipMaterial(child as Mesh)
        })
    }, [scene])

    return <primitive object={scene} rotation={[0, MathUtils.degToRad(-90), 0]} />
}

const Spaceship = () => {
    const groupRef = useRef<Group>(null!)
    const prevAutopilotKey = useRef(false)
    const prevCockpitKey = useRef(false)

    const [, getKeys] = useKeyboardControls<Controls>()
    const { distanceScale, sizeScale } = useSettingStore()
    const { mode, autopilot, focus, setControl } = useControlStore()
    const { scene, camera } = useThree()

    const step = 1 / distanceScale
    const currentSpeed = useRef(0)

    // useEffect(() => {
    //     if (!groupRef.current || mode === Mode.Object) return

    //     const earth = scene.getObjectByName("earth")
    //     if (!earth) return

    //     earth.getWorldPosition(objPos)
    //     const earthRadius = earth.userData?.radius ? (earth.userData.radius / sizeScale) : 0.063
    //     const spawnOffset = new Vector3(earthRadius * 2.5, earthRadius * 1.5, earthRadius * 4.0)
    //     groupRef.current.position.copy(objPos).add(spawnOffset)

    //     // Point spaceship towards Earth
    //     targetMatrix.lookAt(groupRef.current.position, objPos, camera.up)
    //     groupRef.current.quaternion.setFromRotationMatrix(targetMatrix)
    // }, [mode])

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

        console.log(autopilot)

        // Toggle Autopilot on F key press
        // if (isAutopilotKey && !prevAutopilotKey.current) {
        //     setControl({ autopilot: !autopilot })
        // }
        // prevAutopilotKey.current = Boolean(isAutopilotKey)

        // Toggle Cockpit on C key press
        // if (isCockpitKey && !prevCockpitKey.current) {
        //     setShip({ cockpit: !cockpit })
        // }
        // prevCockpitKey.current = Boolean(isCockpitKey)

        // Manual steering disengages Autopilot automatically
        // if (isLeft || isRight || isUp || isDown || isForward || isBackward) {
        //     if (autopilot) setShip({ autopilot: false })
        // }

        // Calculate distance to target object if focus exists

        const object = focus ? state.scene.getObjectByName(focus) : null

        let dist = 0
        let targetRadius = 0.05

        if (object) {
            object.getWorldPosition(targetPos)
            targetRadius = object.userData?.radius ? (object.userData.radius / sizeScale) : 0.05
            dist = shipPos.distanceTo(targetPos)

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
                // const isStar = child.userData.type === "star"
                if (typeof radius !== "number" || radius <= 0) return

                child.getWorldPosition(objPos)
                const objDist = shipPos.distanceTo(objPos)
                const objRadius = radius / sizeScale
                const minSurfaceDist = Math.max(objRadius * 1.25, 1000 / sizeScale)

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
            console.log("effectDist", effectDist)


            if (effectDist > 0.0001) {
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

                if (effectDist > 0.01) return
                if (isLeft || isRight || isUp || isDown || isForward || isBackward) {
                    setControl({ autopilot: false })
                }
            } else {
                setControl({ autopilot: false })
            }
        } else {
            // 2. Manual Steering & Rotation (Q/E for Pitch, A/D for Yaw)
            let pitch = 0
            let yaw = 0

            const pitchSpeed = 0.2 * delta
            const yawSpeed = 0.4 * delta

            if (isUp) pitch += pitchSpeed
            if (isDown) pitch -= pitchSpeed
            if (isLeft) yaw += yawSpeed
            if (isRight) yaw -= yawSpeed

            if (pitch !== 0 || yaw !== 0) {
                qYaw.setFromAxisAngle(axisY, yaw)
                qPitch.setFromAxisAngle(axisX, pitch)
                shipQuat.multiply(qPitch).premultiply(qYaw).normalize()
            }

            // 3. Manual Forward / Backward Thrust (translate position directly)
            const maxSpeed = step * 10000
            const isFirstTime = currentSpeed.current <= 0
            const acceleration = isBoost ? step * (isFirstTime ? 3000 : 300) : step * (isFirstTime ? 3000 : 100)
            const deceleration = step * 1000

            console.log(currentSpeed.current)

            if (isForward || isBoost) {
                // Accelerate smoothly
                currentSpeed.current = Math.min(
                    currentSpeed.current + acceleration * delta,
                    maxSpeed
                )

                moveDir.set(0, 0, -1)
            } else if (isBackward) {
                // Backward movement
                currentSpeed.current = Math.max(
                    currentSpeed.current - acceleration * delta,
                    -(maxSpeed * 0.5)
                )

                moveDir.set(0, 0, 1)
            } else {
                // Slowly decelerate when no thrust
                if (currentSpeed.current > 0) {
                    currentSpeed.current = Math.max(
                        0,
                        currentSpeed.current - deceleration * delta
                    )
                } else if (currentSpeed.current < 0) {
                    currentSpeed.current = Math.min(
                        0,
                        currentSpeed.current + deceleration * delta
                    )
                }

                moveDir.set(0, 0, -1)
            }

            if (Math.abs(currentSpeed.current) > 0.001) {
                moveDir
                    .normalize()
                    .multiplyScalar(currentSpeed.current * delta)
                    .applyQuaternion(shipQuat)

                applyCollisionPrevention()
                group.position.add(moveDir)
            }
        }
    })

    return (
        <group ref={groupRef} name="spaceship" position={[0, 0, 20]}>
            <group scale={SHIP_SCALE}>
                <When condition={mode === Mode.FirstPerson}>
                    <CockpitModel />
                </When>
                <When condition={mode === Mode.ThirdPerson}>
                    <ShipModel />
                </When>
            </group>
        </group>
    )
}

export default Spaceship