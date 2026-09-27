/* eslint-disable react-hooks/immutability */
import { useKTX2 } from "@react-three/drei"
import { earthFragmentShader, earthVertexShader } from "@shaders/earth"
import { useControlStore } from "@state"
import { useMemo, useRef } from "react"
import { ShaderMaterial, SRGBColorSpace, Vector3 } from "three"

interface Props {
    textures: [string, string]
    intensity?: number
}

const NightMaterial = ({ textures, intensity = 1.0 }: Props) => {
    const materialRef = useRef<ShaderMaterial>(null!)

    const [dayTexture, nightTexture] = useKTX2(textures)
    const { dayNightMode } = useControlStore()

    dayTexture.colorSpace = SRGBColorSpace
    nightTexture.colorSpace = SRGBColorSpace

    const material = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: earthVertexShader,
            fragmentShader: earthFragmentShader,
            uniforms: {
                u_dayTexture: { value: dayTexture },
                u_nightTexture: { value: nightTexture },
                u_sunPosition: { value: new Vector3(0, 0, 0) },
                u_nightIntensity: { value: intensity },
                u_mode: { value: dayNightMode ? 1 : 0 }
            },
        })


    }, [dayNightMode, dayTexture, intensity, nightTexture])

    return <primitive ref={materialRef} object={material} attach="material" />
}


export default NightMaterial