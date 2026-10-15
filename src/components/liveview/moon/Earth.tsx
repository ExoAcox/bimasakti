/* eslint-disable react-hooks/immutability */
import { useKTX2 } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { BackSide, Mesh, SRGBColorSpace } from "three"

interface Props {
    position: [number, number, number]
    radius?: number
}

const Earth = ({ position, radius = 5.5 }: Props) => {
    const earthRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const earthTexture = useKTX2("/textures/earth_hd.ktx2")
    earthTexture.colorSpace = SRGBColorSpace

    const cloudTexture = useKTX2("/textures/earth_cloud.ktx2")

    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.015
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += delta * 0.02
        }
    })

    return (
        <group position={position}>
            {/* Earth Main Sphere */}
            <mesh ref={earthRef} rotation={[0.4, 0, 0]}>
                <sphereGeometry args={[radius, 64, 64]} />
                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.8}
                    metalness={0.1}
                />
            </mesh>

            {/* Earth Cloud Layer */}
            <mesh ref={cloudRef} rotation={[0.4, 0, 0]}>
                <sphereGeometry args={[radius * 1.015, 64, 64]} />
                <meshStandardMaterial
                    alphaMap={cloudTexture}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    color="#ffffff"
                    roughness={1.0}
                />
            </mesh>

            {/* Atmospheric Rim Glow */}
            <mesh scale={radius * 1.05}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#4a9eff"
                    transparent
                    opacity={0.15}
                    side={BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

export default Earth
