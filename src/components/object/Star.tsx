


import { useMemo, useRef } from "react"
import { Color, ShaderMaterial, AdditiveBlending, BackSide, Mesh } from "three"
import { useFrame } from "@react-three/fiber"
import { useControlStore } from "@state"
import type { Star as StarType } from "@types"
import { CelestialBody, GordilocksZone } from "@components/object"
import { useCelestial } from "@function"
import {
    surfaceVertexShader,
    surfaceFragmentShader,
    glowVertexShader,
    glowFragmentShader,
    coronaFragmentShader
} from "@shaders"
import { When } from "react-if"
import { INTENSITY_SCALE } from "@constants"


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

    const { distanceScale, sizeScale, setControl } = useControlStore()

    const data = useCelestial().getObjectById(id) as StarType
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
                u_color: { value: hexToRawColor(color) }
            }
        })
    }, [color])

    const glowMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: hexToRawColor(glowColor) }
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
                u_color: { value: hexToRawColor(glowColor) }
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
            <pointLight intensity={intensity / 5 * 2} color="white" />

            <group
                scale={scale}
                ref={objectRef}
                name={id}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}
                castShadow
                receiveShadow>
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                    {/* <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={intensity / 20} /> */}
                    <primitive object={surfaceMaterial} ref={surfaceMatRef} attach="material" emissive={data.color} emissiveIntensity={intensity} />
                </mesh>

                {/* 
                <mesh scale={1.5}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial emissive="white" emissiveIntensity={10} />
                </mesh> */}

                <mesh scale={1.005}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive object={glowMaterial} ref={glowMatRef} attach="material" />
                </mesh>

                <mesh scale={1.01}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive object={coronaMaterial} ref={coronaMatRef} attach="material" />
                </mesh>
            </group>

            <When condition={!!data.gordilocks}>
                <GordilocksZone data={data} />
            </When>
        </CelestialBody>
    )
}

export default Star