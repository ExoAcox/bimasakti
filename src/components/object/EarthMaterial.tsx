/* eslint-disable react-hooks/immutability */
import { useKTX2 } from "@react-three/drei"
import { earthFragmentShader, earthVertexShader } from "@shaders/earth"
import { useControlStore } from "@state"
import { useMemo, useRef } from "react"
import { ShaderMaterial, SRGBColorSpace, Vector3 } from "three"

interface EarthMaterialProps {
    textures: [string, string]
    nightIntensity?: number
}

const EarthMaterial = ({
    textures,
    nightIntensity = 1.0,
}: EarthMaterialProps) => {
    const materialRef = useRef<ShaderMaterial>(null!)

    const [dayTexture, nightTexture] = useKTX2(textures)
    const { dayNightMode } = useControlStore()

    dayTexture.colorSpace = SRGBColorSpace
    nightTexture.colorSpace = SRGBColorSpace

    const earthMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: earthVertexShader,
            fragmentShader: earthFragmentShader,
            uniforms: {
                u_dayTexture: { value: dayTexture },
                u_nightTexture: { value: nightTexture },
                u_sunPosition: { value: new Vector3(0, 0, 0) },
                u_nightIntensity: { value: nightIntensity },
                u_mode: { value: dayNightMode ? 1 : 0 }
            },
        })


    }, [dayNightMode, dayTexture, nightIntensity, nightTexture])

    // useFrame(() => {
    //     if (materialRef.current) {
    //         // Sun is positioned at origin (0, 0, 0) in solar system
    //         materialRef.current.uniforms.u_sunPosition.value.set(0, 0, 0)
    //         materialRef.current.uniforms.u_nightIntensity.value = nightIntensity
    //     }
    // })

    return <primitive ref={materialRef} object={earthMaterial} attach="material" />
}


export default EarthMaterial