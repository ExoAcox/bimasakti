import { useFrame } from "@react-three/fiber"
import { atmosphereFragmentShader, atmosphereVertexShader } from "@shaders/earth"
import type { Planet } from "@types"
import { useMemo, useRef } from "react"
import { AdditiveBlending, BackSide, Color, ShaderMaterial, Vector3 } from "three"

interface Props {
    data: Planet
}

const Atmosphere = ({ data }: Props) => {
    const materialRef = useRef<ShaderMaterial>(null!)
    const opacity = data.atmosphere ?? 1.0

    const atmosphereMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            side: BackSide,
            depthWrite: false,
            uniforms: {
                uAtmosphereColor: { value: new Color(data.color) },
                uSunPosition: { value: new Vector3(0, 0, 0) },
                uOpacity: { value: opacity },
            },
        })
    }, [data.color, opacity])

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uSunPosition.value.set(0, 0, 0)
            materialRef.current.uniforms.uOpacity.value = opacity
        }
    })

    return <mesh scale={1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive ref={materialRef} object={atmosphereMaterial} attach="material" />
    </mesh>
}

export default Atmosphere
