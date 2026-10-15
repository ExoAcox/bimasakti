/* eslint-disable react-hooks/immutability */
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { MathUtils, PerspectiveCamera, Vector3 } from "three"

interface Props {
    position: Vector3
}


const LiveviewScene = ({ position }: Props) => {
    const { camera, gl } = useThree()

    // Spherical angles for rotation (yaw: horizontal, pitch: vertical)
    const targetYaw = useRef<number>(Math.PI * 0.25)
    const currentYaw = useRef<number>(Math.PI * 0.25)

    const targetPitch = useRef<number>(0.05)
    const currentPitch = useRef<number>(0.05)

    const targetFov = useRef<number>(65)
    const currentFov = useRef<number>(65)

    const isDragging = useRef<boolean>(false)
    const previousPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const touchDistance = useRef<number | null>(null)

    useEffect(() => {
        const domElement = gl.domElement

        const onPointerDown = (e: PointerEvent) => {
            isDragging.current = true
            previousPointer.current = { x: e.clientX, y: e.clientY }
            domElement.setPointerCapture?.(e.pointerId)
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return
            const deltaX = e.clientX - previousPointer.current.x
            const deltaY = e.clientY - previousPointer.current.y
            previousPointer.current = { x: e.clientX, y: e.clientY }

            // Sensitivity factor scaled by current FOV
            const fovFactor = (currentFov.current / 65) * 0.003

            // Dragging left turns camera left, dragging right turns camera right
            targetYaw.current -= deltaX * fovFactor

            // Dragging up tilts up (targetPitch increases), dragging down tilts down
            targetPitch.current -= deltaY * fovFactor

            // Clamp pitch to prevent flipping upside down (-75 deg to +75 deg)
            const maxPitch = (75 * Math.PI) / 180
            targetPitch.current = Math.max(-maxPitch, Math.min(maxPitch, targetPitch.current))
        }

        const onPointerUp = (e: PointerEvent) => {
            isDragging.current = false
            try {
                domElement.releasePointerCapture?.(e.pointerId)
            } catch {
                // Ignore if pointer capture release fails
            }
        }

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const zoomSensitivity = 0.04
            targetFov.current = Math.max(35, Math.min(85, targetFov.current + e.deltaY * zoomSensitivity))
        }

        // Mobile touch pinch-to-zoom
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                )
                if (touchDistance.current !== null) {
                    const diff = touchDistance.current - dist
                    targetFov.current = Math.max(35, Math.min(85, targetFov.current + diff * 0.1))
                }
                touchDistance.current = dist
            }
        }

        const onTouchEnd = () => {
            touchDistance.current = null
        }

        domElement.addEventListener("pointerdown", onPointerDown)
        window.addEventListener("pointermove", onPointerMove)
        window.addEventListener("pointerup", onPointerUp)
        window.addEventListener("pointercancel", onPointerUp)
        domElement.addEventListener("wheel", onWheel, { passive: false })
        domElement.addEventListener("touchmove", onTouchMove, { passive: true })
        domElement.addEventListener("touchend", onTouchEnd)

        return () => {
            domElement.removeEventListener("pointerdown", onPointerDown)
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerup", onPointerUp)
            window.removeEventListener("pointercancel", onPointerUp)
            domElement.removeEventListener("wheel", onWheel)
            domElement.removeEventListener("touchmove", onTouchMove)
            domElement.removeEventListener("touchend", onTouchEnd)
        }
    }, [gl, camera])

    useFrame((_, delta) => {
        // Smoothly damp towards target angles
        const lerpFactor = 1 - Math.exp(-14 * delta)
        currentYaw.current = MathUtils.lerp(currentYaw.current, targetYaw.current, lerpFactor)
        currentPitch.current = MathUtils.lerp(currentPitch.current, targetPitch.current, lerpFactor)
        currentFov.current = MathUtils.lerp(currentFov.current, targetFov.current, lerpFactor)

        const perspectiveCam = camera as PerspectiveCamera
        if (Math.abs(perspectiveCam.fov - currentFov.current) > 0.01) {
            perspectiveCam.fov = currentFov.current
            perspectiveCam.updateProjectionMatrix()
        }

        // Lock camera position strictly at center origin
        camera.position.copy(position)

        // Calculate look direction from yaw and pitch
        const cosPitch = Math.cos(currentPitch.current)
        const sinPitch = Math.sin(currentPitch.current)
        const cosYaw = Math.cos(currentYaw.current)
        const sinYaw = Math.sin(currentYaw.current)

        const targetLook = new Vector3(
            position.x + cosPitch * sinYaw,
            position.y + sinPitch,
            position.z + cosPitch * cosYaw
        )

        camera.lookAt(targetLook)
    })

    return null
}

export default LiveviewScene