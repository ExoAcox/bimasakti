import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { AdditiveBlending, CanvasTexture, type Group } from "three"

interface Props {
    position: [number, number, number]
}

const Sun = ({ position }: Props) => {
    const sunRef = useRef<Group>(null)

    // Generate crisp solar corona in vacuum space
    const glowTexture = useMemo(() => {
        if (typeof document === "undefined") return null
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
        gradient.addColorStop(0.0, "rgba(255, 255, 255, 1.0)")
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.95)")
        gradient.addColorStop(0.42, "rgba(235, 245, 255, 0.55)")
        gradient.addColorStop(0.68, "rgba(180, 215, 255, 0.2)")
        gradient.addColorStop(0.88, "rgba(130, 180, 255, 0.05)")
        gradient.addColorStop(1.0, "rgba(100, 150, 255, 0.0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 256)

        const tex = new CanvasTexture(canvas)
        tex.needsUpdate = true
        return tex
    }, [])

    useFrame(({ camera }) => {
        if (sunRef.current) {
            sunRef.current.lookAt(camera.position)
        }
    })

    return (
        <group position={position}>
            <directionalLight
                position={[0, 0, 0]}
                intensity={2.8}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={10}
                shadow-camera-far={450}
                shadow-camera-left={-120}
                shadow-camera-right={120}
                shadow-camera-top={120}
                shadow-camera-bottom={-120}
                shadow-bias={-0.0001}
            />

            <group ref={sunRef}>
                <mesh>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        fog={false}
                        toneMapped={false}
                    />
                </mesh>

                {glowTexture && (
                    <mesh position={[0, 0, -0.2]}>
                        <planeGeometry args={[2.8, 2.8]} />
                        <meshBasicMaterial
                            map={glowTexture}
                            transparent
                            depthWrite={false}
                            blending={AdditiveBlending}
                        />
                    </mesh>
                )}
            </group>
        </group>
    )
}

export default Sun
