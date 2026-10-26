import { useMemo, useRef } from "react"
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Group,
    Mesh,
    ShaderMaterial
} from "three"
import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useCelestial, userDataFormat } from "@function"
import { useSettingStore, useControlStore } from "@state"
import type { Blackhole as BlackholeType } from "@types"
import { blackholePointFragmentShader, blackholePointVertexShader } from "@shaders/blackhole"
import { CelestialBody, Pulsar } from "."
import { When } from "react-if"



interface Props {
    id: string
    children?: React.ReactNode
}

interface AccretionPointsProps {
    src: string
    scale?: number
    texturePath?: string
    intensity?: number
    size?: number
}

const AccretionPoints = ({
    src,
    scale = 1,
    texturePath = "/textures/star.png",
    intensity = 2.0,
    size = 25.0
}: AccretionPointsProps) => {
    const materialRef = useRef<ShaderMaterial>(null!)
    const pointTexture = useTexture(texturePath)
    const { scene } = useGLTF(src)

    const { geometry, glowMaterial } = useMemo(() => {
        let foundGeo: BufferGeometry | null = null

        scene.traverse((child) => {
            const potentialMesh = child as unknown as { geometry?: BufferGeometry }
            if (potentialMesh.geometry && !foundGeo) {
                foundGeo = potentialMesh.geometry
            }
        })

        if (!foundGeo) {
            return { geometry: new BufferGeometry(), glowMaterial: new ShaderMaterial() }
        }

        const sourceGeo: BufferGeometry = foundGeo
        const rawPositions = sourceGeo.attributes.position.array
        const count = rawPositions.length / 3

        const rawColors = sourceGeo.attributes.color?.array
        const rawAttrs = sourceGeo.attributes as Record<string, BufferAttribute | undefined>
        const rawSizes = rawAttrs._size?.array || rawAttrs._SIZE?.array

        // Filter out particles that fall inside the 3D event horizon sphere (radius < 1.02)
        const scaleVec = Array.isArray(scale) ? scale : [scale, scale, scale]
        const validIndices: number[] = []
        for (let i = 0; i < count; i++) {
            const x = rawPositions[i * 3] * scaleVec[0]
            const y = rawPositions[i * 3 + 1] * scaleVec[1]
            const z = rawPositions[i * 3 + 2] * scaleVec[2]
            const r = Math.sqrt(x * x + y * y + z * z)
            if (r >= 1.02) {
                validIndices.push(i)
            }
        }

        const validCount = validIndices.length
        const position = new Float32Array(validCount * 3)
        const colors = new Float32Array(validCount * 3)
        const sizes = new Float32Array(validCount)

        for (let j = 0; j < validCount; j++) {
            const i = validIndices[j]
            position[j * 3] = rawPositions[i * 3]
            position[j * 3 + 1] = rawPositions[i * 3 + 1]
            position[j * 3 + 2] = rawPositions[i * 3 + 2]

            if (rawColors) {
                colors[j * 3] = rawColors[i * 3]
                colors[j * 3 + 1] = rawColors[i * 3 + 1]
                colors[j * 3 + 2] = rawColors[i * 3 + 2]
            } else {
                colors[j * 3] = 1.0
                colors[j * 3 + 1] = 1.0
                colors[j * 3 + 2] = 1.0
            }

            const raw = rawSizes ? Number(rawSizes[i]) : 0.05
            sizes[j] = Math.max(0.4, Math.min(raw * 15.0, 1.2))
        }

        const geo = new BufferGeometry()
        geo.setAttribute("position", new BufferAttribute(position, 3))
        geo.setAttribute("color", new BufferAttribute(colors, 3))
        geo.setAttribute("a_size", new BufferAttribute(sizes, 1))

        const mat = new ShaderMaterial({
            vertexShader: blackholePointVertexShader,
            fragmentShader: blackholePointFragmentShader,
            uniforms: {
                u_texture: { value: pointTexture },
                u_time: { value: 0 },
                u_intensity: { value: intensity },
                u_size: { value: size * 2.2 }
            },
            blending: AdditiveBlending,
            transparent: true,
            depthWrite: false,
        })

        return { geometry: geo, glowMaterial: mat }
    }, [scene, pointTexture, intensity, size, scale])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime()
        }
    })

    return (
        <points geometry={geometry} scale={scale}>
            <primitive object={glowMaterial} ref={materialRef} attach="material" />
        </points>
    )
}

const Blackhole = ({ id, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const diskRef = useRef<Group>(null!)
    const jetsRef = useRef<Group>(null!)
    const pulsarRef = useRef<Group>(null!)

    const { sizeScale } = useSettingStore()
    const { rotateSpeed, diskVisible, plasmaBeamVisible, setControl } = useControlStore()
    const data = useCelestial().getObjectById(id) as BlackholeType
    const scale = data.radius / sizeScale

    const handleClick = () => {
        if (data) setControl({ focus: data.id })
    }

    useFrame((_, delta) => {
        if (diskRef.current) {
            diskRef.current.rotation.y -= delta * 0.5 * rotateSpeed
        }
        if (jetsRef.current) {
            jetsRef.current.rotation.y += delta * 20 * rotateSpeed
        }
        if (pulsarRef.current) {
            pulsarRef.current.rotation.y += delta * 100 * rotateSpeed
        }
    })

    if (!data) return null

    return (
        <CelestialBody data={data} objectRef={objectRef} onClick={handleClick}>
            <group ref={objectRef} name={data.id} userData={userDataFormat(data)} scale={scale}>
                <mesh
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick()
                    }}
                >
                    <sphereGeometry args={[1, 64, 32]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>

                <When condition={diskVisible}>
                    <group ref={diskRef} rotation={[Math.PI, 0, 0]}>
                        <AccretionPoints
                            src="/models/sgr_a_ring.glb"
                            scale={1.0}
                            intensity={2}
                            size={24.0}
                        />
                        <AccretionPoints
                            src="/models/sgr_a_torus.glb"
                            scale={1.8}
                            intensity={1.5}
                            size={36.0}
                        />
                        <AccretionPoints
                            src="/models/sgr_a_spirals_inner.glb"
                            scale={3.2}
                            intensity={1.0}
                            size={32.0}
                        />

                        <group rotation={[0, Math.PI / 2, 0]}>
                            <AccretionPoints
                                src="/models/sgr_a_spirals_inner.glb"
                                scale={3.2}
                                intensity={1.0}
                                size={32.0}
                            />
                        </group>

                        <group rotation={[0, Math.PI / 4, 0]}>
                            <AccretionPoints
                                src="/models/sgr_a_spirals_inner.glb"
                                scale={3.2}
                                intensity={1.0}
                                size={32.0}
                            />
                        </group>
                    </group>
                </When>
            </group>

            <When condition={plasmaBeamVisible}>
                <group ref={jetsRef}>
                    <AccretionPoints
                        src="/models/sgr_a_jets.glb"
                        scale={scale * 5}
                        texturePath="/textures/star.png"
                        intensity={3.8}
                        size={32.0}
                    />
                </group>

                <group ref={pulsarRef}>
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={45} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={90} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={135} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={180} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={225} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={270} />
                    <Pulsar radius={scale / 10} color={"#bae6fd"} tilt={3} rotation={315} />
                </group>
            </When>

            {children}
        </CelestialBody>
    )
}

export default Blackhole