import { useRef } from "react"
import type { Mesh } from "three"
import type { Blackhole as BlackholeType } from "@types"
import { useControlStore } from "@state"
import { CelestialBody } from "@components/object"
import { useCelestial } from "@function"
import { Html } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import type { OrbitControls } from "three-stdlib"
// import {
//     accretionDiskVertexShader,
//     accretionDiskFragmentShader,
//     photonRingVertexShader,
//     photonRingFragmentShader
// } from "@shaders"

// const hexToColor = (hex: string) => {
//     if (!hex || hex === "#000000") return new Color(1.0, 0.45, 0.05)
//     const cleanHex = hex.replace("#", "")
//     const num = parseInt(cleanHex, 16)
//     return new Color(
//         ((num >> 16) & 255) / 255,
//         ((num >> 8) & 255) / 255,
//         (num & 255) / 255
//     )
// }

interface Props {
    id: string
    children?: React.ReactNode
}

const Blackhole = ({ id, children }: Props) => {
    const labelRef = useRef<HTMLLabelElement>(null!)
    // const accretionMatRef = useRef<ShaderMaterial>(null!)
    // const verticalAccretionMatRef = useRef<ShaderMaterial>(null!)
    // const photonRingMatRef = useRef<ShaderMaterial>(null!)

    const controls = useThree((state) => state.controls as OrbitControls);

    const { sizeScale, setControl } = useControlStore()
    const data = useCelestial().getObjectById(id) as BlackholeType
    const scale = data.radius / sizeScale

    // const diskColor = useMemo(() => hexToColor(data?.color || "#ff7700"), [data?.color])

    const handleClick = () => {
        if (data) setControl({ focus: data.id })
    }

    // const accretionDiskMaterial = useMemo(() => {
    //     return new ShaderMaterial({
    //         vertexShader: accretionDiskVertexShader,
    //         fragmentShader: accretionDiskFragmentShader,
    //         uniforms: {
    //             u_time: { value: 0 },
    //             u_color: { value: diskColor }
    //         },
    //         side: DoubleSide,
    //         transparent: true,
    //         depthWrite: false,
    //         blending: AdditiveBlending
    //     })
    // }, [diskColor])

    // const photonRingMaterial = useMemo(() => {
    //     return new ShaderMaterial({
    //         vertexShader: photonRingVertexShader,
    //         fragmentShader: photonRingFragmentShader,
    //         uniforms: {
    //             u_time: { value: 0 },
    //             u_color: { value: diskColor }
    //         },
    //         side: FrontSide,
    //         transparent: true,
    //         depthWrite: false,
    //         blending: AdditiveBlending
    //     })
    // }, [diskColor])

    // useFrame((state) => {
    //     const elapsedTime = state.clock.getElapsedTime()
    //     if (accretionMatRef.current) {
    //         accretionMatRef.current.uniforms.u_time.value = elapsedTime
    //     }
    //     if (verticalAccretionMatRef.current) {
    //         verticalAccretionMatRef.current.uniforms.u_time.value = elapsedTime
    //     }
    //     if (photonRingMatRef.current) {
    //         photonRingMatRef.current.uniforms.u_time.value = elapsedTime
    //     }
    // })

    useFrame(() => {
        if (labelRef.current) {
            labelRef.current.style.visibility = controls.getDistance() <= 0.0015 ? "visible" : "hidden"
        }
    })

    if (!data) return null

    return (
        <group name={data.id} scale={scale}>
            {/* Event Horizon Core (Black Sphere) */}
            <Html>
                <label ref={labelRef} className="invisible absolute -translate-x-1/2 -translate-y-full -mt-10 text-sm font-semibold text-secondary">Wormhole</label>
            </Html>
            <mesh
                renderOrder={10}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Glowing Photon Ring Rim */}
            {/* <mesh scale={1.02}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive object={photonRingMaterial} ref={photonRingMatRef} attach="material" />
                </mesh> */}

            {/* Primary Horizontal Accretion Disk (Ring Geometry leaves 1.25 inner hole clear) */}
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.25, 5.0, 64, 16]} />
                    <primitive object={accretionDiskMaterial} ref={accretionMatRef} attach="material" />
                </mesh> */}

            {/* Secondary Tilted Accretion Glow Ring */}
            {/* <mesh rotation={[Math.PI / 12, Math.PI / 6, 0]}>
                    <ringGeometry args={[1.35, 4.6, 64, 16]} />
                    <primitive object={accretionDiskMaterial} ref={verticalAccretionMatRef} attach="material" />
                </mesh> */}
        </group>
    )
}

export default Blackhole