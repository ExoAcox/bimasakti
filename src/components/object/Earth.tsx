/* eslint-disable react-hooks/immutability */
import { useKTX2 } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { atmosphereFragmentShader, atmosphereVertexShader, earthFragmentShader, earthVertexShader } from "@shaders/earth"
import { useControlStore } from "@state"
import type { Planet } from "@types"
import { useMemo, useRef, Suspense } from "react"
import { When } from "react-if"
import { AdditiveBlending, BackSide, Color, ShaderMaterial, SRGBColorSpace, Vector3 } from "three"
import { TextureLoader } from "."

interface EarthMaterialProps {
    textures: [string, string]
    nightIntensity?: number
}

const EarthMaterial = ({
    textures,
    nightIntensity = 1.0,
}: EarthMaterialProps) => {
    const materialRef = useRef<ShaderMaterial>(null!)

    console.log("render earth betul")

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

const Atmosphere = ({ color }: { color: string }) => {
    const materialRef = useRef<ShaderMaterial>(null!)

    const atmosphereMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            side: BackSide,
            depthWrite: false,
            uniforms: {
                uAtmosphereColor: { value: new Color(color) },
                uSunPosition: { value: new Vector3(0, 0, 0) },
            },
        })
    }, [color])

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uSunPosition.value.set(0, 0, 0)
        }
    })

    return <primitive ref={materialRef} object={atmosphereMaterial} attach="material" />
}

interface Props {
    data: Planet
    hd?: boolean
}

const Earth = ({ data, hd }: Props) => {
    const { variant, cloudVisible } = useControlStore()
    const texturePath = (hd && data.texture_hd) ? data.texture_hd : data.texture!

    return <group>
        <mesh castShadow receiveShadow key={variant}>
            <sphereGeometry args={[1, 64, 64]} />

            <Suspense fallback={<meshStandardMaterial color={data.color} />}>
                <When condition={!variant}>
                    <EarthMaterial
                        textures={[
                            `/textures/${hd ? "earth_hd.ktx2" : "earth.ktx2"}`,
                            `/textures/${hd ? "earth_night_hd.ktx2" : "earth_night.ktx2"}`,
                        ]}
                        nightIntensity={1}
                    />
                </When>

                <When condition={variant}>
                    <TextureLoader path={texturePath} />
                </When>
            </Suspense>
        </mesh>

        <When condition={cloudVisible}>
            <mesh scale={1.02}>
                <sphereGeometry args={[1, 64, 64]} />
                <Atmosphere color={data.color} />
            </mesh>
        </When>
    </group>
}

export default Earth