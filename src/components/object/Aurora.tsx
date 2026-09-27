import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { auroraFragmentShader, auroraVertexShader } from "@shaders/aurora"
import type { Planet } from "@types"
import { useMemo, useRef } from "react"
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, Vector3 } from "three"

interface Props {
    data: Planet
}

const Aurora = ({ data }: Props) => {
    const materialRef = useRef<ShaderMaterial>(null!)
    const texture = useTexture("/textures/aurora.png")

    const radius = 1.015
    const intensity = data.aurora ?? 0
    const color = "#44ffaa"

    const tiltRad = (Math.PI) / 180
    const nodeRad = (Math.PI) / 180

    const auroraMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: auroraVertexShader,
            fragmentShader: auroraFragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            side: DoubleSide,
            uniforms: {
                uAuroraTexture: { value: texture },
                uSunPosition: { value: new Vector3(0, 0, 0) },
                uTime: { value: 0 },
                uIntensity: { value: intensity },
                uColor: { value: new Color(color) },
            },
        })
    }, [texture, intensity, color])

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uSunPosition.value.set(0, 0, 0)
            materialRef.current.uniforms.uTime.value += delta
        }
    })

    return (
        <group rotation={[0, nodeRad, 0]}>
            <group rotation={[tiltRad, 0, 0]}>
                <mesh scale={radius}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive ref={materialRef} object={auroraMaterial} attach="material" />
                </mesh>
            </group>
        </group>
    )
}

export default Aurora
