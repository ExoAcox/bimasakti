


import { Suspense, useMemo, useRef } from "react"
import { Color, ShaderMaterial, AdditiveBlending, BackSide, Mesh } from "three"
import { useFrame } from "@react-three/fiber"
import { useSettingStore, useControlStore } from "@state"
import { StarClass, type Star as StarType } from "@types"
import { CelestialBody, GordilocksZone, Pulsar } from "@components/object"
import { useCelestial, userDataFormat, useVariant } from "@function"
import {
    surfaceVertexShader,
    surfaceFragmentShader,
    glowVertexShader,
    glowFragmentShader,
    coronaFragmentShader
} from "@shaders/star"
import { When } from "react-if"
import { INTENSITY_SCALE } from "@constants"
import { Gltf } from "@react-three/drei"


const hexToRawColor = (hex: string) => {
    if (!hex) return new Color(1, 0.4, 0)
    const cleanHex = hex.replace("#", "")
    const num = parseInt(cleanHex, 16)
    return new Color(
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255
    )
}

export interface Props {
    id: string
    children?: React.ReactNode
    labelRef?: React.RefObject<HTMLButtonElement>
}

const Star = ({ id, children, labelRef }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const surfaceMatRef = useRef<ShaderMaterial>(null!)
    const glowMatRef = useRef<ShaderMaterial>(null!)
    const coronaMatRef = useRef<ShaderMaterial>(null!)

    const celestial = useCelestial()
    const { distanceScale, sizeScale } = useSettingStore()
    const { focus, setControl } = useControlStore()

    const universe = celestial.getUniverse()
    const rawData = celestial.getObjectById(id) as StarType
    const data = useVariant(rawData) as StarType

    const isFocused = data.id === focus || data.id === universe.defaultFocus
    const isDysonSohere = data.variant_id === "dyson_sphere"
    const intensity = data.intensity / Math.pow(distanceScale, 2) * INTENSITY_SCALE
    const scale = data.radius / sizeScale
    const color = data.color
    const glowColor = data.color


    const handleClick = () => {
        setControl({ focus: id })
    }

    const surfaceMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: surfaceVertexShader,
            fragmentShader: surfaceFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(color) }
            }
        })
    }, [color])

    const glowMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(glowColor) }
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false
        })
    }, [glowColor])

    const coronaMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: coronaFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(glowColor) }
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false
        })
    }, [glowColor])

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime()
        if (surfaceMatRef.current) {
            surfaceMatRef.current.uniforms.u_time.value = elapsedTime
        }
        if (glowMatRef.current) {
            glowMatRef.current.uniforms.u_time.value = elapsedTime
        }
        if (coronaMatRef.current) {
            coronaMatRef.current.uniforms.u_time.value = elapsedTime
        }
    })

    if (!data) return null

    return (
        <CelestialBody data={data} onClick={handleClick} objectRef={objectRef} childrenComponent={children} labelRef={labelRef}>
            <pointLight intensity={isDysonSohere ? 1000 : intensity / 5 * 2} color="white" />

            <group ref={objectRef}>
                <group
                    scale={scale}
                    name={id}
                    userData={userDataFormat(data)}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick()
                    }}>

                    <When condition={isDysonSohere}>
                        <Suspense fallback={null}>
                            <Gltf src="/models/dyson.glb" scale={0.1} />
                            <Gltf rotation={[Math.PI / 2, 0, 0]} src="/models/dyson.glb" scale={0.1} />
                            <Gltf rotation={[0, 0, Math.PI / 2]} src="/models/dyson.glb" scale={0.1} />
                        </Suspense>
                    </When>

                    <mesh>
                        <sphereGeometry args={isFocused ? [1, 128, 64] : [1]} />
                        <primitive object={surfaceMaterial} ref={surfaceMatRef} attach="material" emissive={data.color} emissiveIntensity={intensity} />
                    </mesh>

                    <mesh scale={1.005}>
                        <sphereGeometry args={isFocused ? [1, 128, 64] : [1]} />
                        <primitive object={glowMaterial} ref={glowMatRef} attach="material" />
                    </mesh>

                    <mesh scale={1.01}>
                        <sphereGeometry args={isFocused ? [1, 128, 64] : [1]} />
                        <primitive object={coronaMaterial} ref={coronaMatRef} attach="material" />
                    </mesh>
                </group>

                <When condition={data.class === StarClass.Neutron}>
                    <Pulsar radius={scale} color={color} />
                </When>
            </group>

            <When condition={!!data.gordilocks}>
                <GordilocksZone data={data} />
            </When>
        </CelestialBody>
    )
}

export default Star