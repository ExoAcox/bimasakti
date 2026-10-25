


import { Suspense, useEffect, useMemo, useRef } from "react"
import { Color, ShaderMaterial, AdditiveBlending, BackSide, Mesh } from "three"
import { useFrame } from "@react-three/fiber"
import { useSettingStore, useControlStore } from "@state"
import { StarClass, type Star as StarType } from "@types"
import { CelestialBody, GordilocksZone, Pulsar, SpaceCraft, StarDisk } from "@components/object"
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

export interface Props {
    id: string
    children?: React.ReactNode
    labelRef?: React.RefObject<HTMLButtonElement>
}

export const getStarClassColors = (starClass?: StarClass) => {
    switch (starClass) {
        case StarClass.Blue:
        case StarClass.BlueSubgiant:
            return {
                flareColor: new Color(0.1, 0.5, 1.5),
                hotspotColor: new Color(0.7, 1.1, 1.6),
                innerHeatScale: 0.2
            }
        case StarClass.Neutron:
            return {
                flareColor: new Color(0.1, 0.9, 1.4),
                hotspotColor: new Color(0.5, 1.1, 1.5),
                innerHeatScale: 0.25
            }
        case StarClass.Red:
            return {
                flareColor: new Color(1.1, 0.35, 0.15),
                hotspotColor: new Color(1.3, 0.65, 0.35),
                innerHeatScale: 1
            }
        case StarClass.RedGiant:
            return {
                flareColor: new Color(1.2, 0.25, 0.1),
                hotspotColor: new Color(1.4, 0.5, 0.2),
                innerHeatScale: 1
            }
        case StarClass.Orange:
            return {
                flareColor: new Color(1.0, 0.65, 0.2),
                hotspotColor: new Color(1.2, 0.95, 0.55),
                innerHeatScale: 0.9
            }
        case StarClass.Yellow:
        default:
            return {
                flareColor: new Color(1.0, 0.85, 0.4),
                hotspotColor: new Color(1.2, 1.1, 0.9),
                innerHeatScale: 1.0
            }
    }
}

const Star = ({ id, children, labelRef }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const surfaceMatRef = useRef<ShaderMaterial>(null!)
    const glowMatRef = useRef<ShaderMaterial>(null!)
    const coronaMatRef = useRef<ShaderMaterial>(null!)

    const celestial = useCelestial()
    const { distanceScale, sizeScale } = useSettingStore()
    const { focus, focusIndex, setControl } = useControlStore()

    const universe = celestial.getUniverse()
    const rawData = celestial.getObjectById(id) as StarType
    const data = useVariant(rawData) as StarType

    const isFocused = data.id === focus || data.id === universe.defaultFocus
    const focusedObject = celestial.getObjectById(focus)
    const isDysonSohere = data.variant_id === "dyson_sphere"
    const intensity = useMemo(() => {
        const isSpacecraft = (focusedObject?.type === "spacecraft-orbiter" && focusedObject?.parent === data.id ? 100 : 1)
        return data.intensity / Math.pow(distanceScale, 2) * INTENSITY_SCALE / isSpacecraft
    }, [data, distanceScale, focusedObject])
    const scale = data.radius / sizeScale
    const color = data.color
    const glowColor = data.color

    const { flareColor, hotspotColor, innerHeatScale } = useMemo(() => {
        return getStarClassColors(data.class)
    }, [data.class])

    const handleClick = () => {
        if (data.id === focus) {
            return setControl({ focusIndex: focusIndex + 1 })
        }

        setControl({ focus: id })
    }

    useEffect(() => {
        console.log(focus)
    }, [focus])

    const surfaceMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: surfaceVertexShader,
            fragmentShader: surfaceFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(color) },
                u_hotspotColor: { value: hotspotColor },
                u_innerHeatScale: { value: innerHeatScale }
            }
        })
    }, [color, hotspotColor, innerHeatScale])

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
                u_color: { value: new Color(glowColor) },
                u_flareColor: { value: flareColor }
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false
        })
    }, [glowColor, flareColor])

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

                <When condition={data.protoplanetaryDisk}>
                    <StarDisk />
                </When>
            </group>

            <When condition={!!data.gordilocks}>
                <GordilocksZone data={data} />
            </When>

            {data.artificial_satellites?.map(craft => (
                <SpaceCraft
                    key={craft.id}
                    data={craft}
                />
            ))}
        </CelestialBody>
    )
}

export default Star