import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { AdditiveBlending, CanvasTexture, type Group } from "three"

interface Props {
    position: [number, number, number]
}

const Sun = ({ position }: Props) => {
    const sunRef = useRef<Group>(null)

    // Generate soft glowing halo texture mimicking Martian forward scattering
    const glowTexture = useMemo(() => {
        if (typeof document === "undefined") return null
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
        gradient.addColorStop(0.0, "rgba(255, 255, 255, 1.0)")
        gradient.addColorStop(0.35, "rgba(240, 250, 255, 0.95)")
        gradient.addColorStop(0.55, "rgba(150, 215, 255, 0.75)") // Crisp Martian cyan-blue ring
        gradient.addColorStop(0.78, "rgba(225, 155, 95, 0.35)") // Warm amber transition border
        gradient.addColorStop(1.0, "rgba(166, 80, 44, 0.0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 256)

        const tex = new CanvasTexture(canvas)
        tex.needsUpdate = true
        return tex
    }, [])

    // Ensure sun corona always faces the camera
    useFrame(({ camera }) => {
        if (sunRef.current) {
            sunRef.current.lookAt(camera.position)
        }
    })

    return (
        <group position={position}>
            {/* Primary sunlight originating directly from the Sun */}
            <directionalLight
                position={[0, 0, 0]}
                intensity={2}
                color="#fff1dc"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={10}
                shadow-camera-far={400}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-bias={-0.0001}
            />

            <group ref={sunRef}>
                {/* Visible Sun Core Disk - Realistic size for Mars */}
                <mesh>
                    <sphereGeometry args={[0.7, 32, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        fog={false}
                        toneMapped={false}
                    />
                </mesh>

                {/* Sun Corona / Martian atmospheric halo */}
                {glowTexture && (
                    <mesh position={[0, 0, -0.2]}>
                        <planeGeometry args={[2.4, 2.4]} />
                        <meshBasicMaterial
                            map={glowTexture}
                            transparent
                            depthWrite={false}
                            blending={AdditiveBlending}
                            fog={false}
                            toneMapped={false}
                        />
                    </mesh>
                )}
            </group>
        </group>
    )
}

export default Sun