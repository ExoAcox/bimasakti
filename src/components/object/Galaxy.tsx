/* eslint-disable react-hooks/immutability */
import { useDetectGPU, useGLTF, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    MathUtils,
    PerspectiveCamera,
    ShaderMaterial,
    type Group,
    type Mesh,
    type PointsMaterial
} from "three"
import type { GLTF } from "three-stdlib"
import { pointGlowVertexShader, pointGlowFragmentShader } from "@shaders/galaxy"

type GLTFResult = GLTF & {
    nodes: {
        Object_2: Mesh
    }
    materials: {
        ['Scene_-_Root']: PointsMaterial
    }
}

interface Props {
    children?: React.ReactNode
    onClick?: () => void
}

const Galaxy = ({ children, onClick }: Props) => {
    const galaxyRef = useRef<Group>(null!)
    const materialRef = useRef<ShaderMaterial>(null!)

    const starTexture = useTexture("/textures/star.png")
    const { nodes } = useGLTF("/models/milky_way.glb") as unknown as GLTFResult
    const isMobile = useDetectGPU().isMobile
    const camera = useThree((state) => state.camera)

    const intensity = isMobile ? 0.50 : 1.25

    useEffect(() => {
        const perspectiveCamera = camera as PerspectiveCamera

        perspectiveCamera.fov = 75
        perspectiveCamera.updateProjectionMatrix()
    }, [camera])

    const { geometry, glowMaterial } = useMemo(() => {
        nodes.Object_2.geometry.center()
        const rawPositions = nodes.Object_2.geometry.attributes.position.array
        const count = rawPositions.length / 3

        const position = new Float32Array(rawPositions.buffer)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        const getDistanceToCenter = (x: number, y: number, z: number) =>
            Math.sqrt(x * x + y * y + z * z)

        const color = new Color()
        for (let i = 0; i < count; i++) {
            const idx = i * 3
            const x = position[idx]
            const y = position[idx + 1]
            const z = position[idx + 2]
            const distanceToCenter = getDistanceToCenter(x, y, z)
            const normalizedDistanceToCenter = distanceToCenter / 100

            color.setRGB(
                Math.cos(normalizedDistanceToCenter),
                MathUtils.randFloat(0, 0.8),
                Math.sin(normalizedDistanceToCenter)
            )
            color.toArray(colors, idx)

            const coreFactor = Math.exp(-normalizedDistanceToCenter * 2.0)
            sizes[i] = MathUtils.randFloat(0.4, 0.9) * (1.0 + coreFactor * 0.8)
        }

        const geo = new BufferGeometry()
        geo.setAttribute("position", new BufferAttribute(position, 3))
        geo.setAttribute("color", new BufferAttribute(colors, 3))
        geo.setAttribute("a_size", new BufferAttribute(sizes, 1))

        const mat = new ShaderMaterial({
            vertexShader: pointGlowVertexShader,
            fragmentShader: pointGlowFragmentShader,
            uniforms: {
                u_texture: { value: starTexture },
                u_time: { value: 0 },
                u_intensity: { value: intensity }
            },
            blending: AdditiveBlending,
            transparent: true,
            depthWrite: false,
        })

        return { geometry: geo, glowMaterial: mat }
    }, [intensity, nodes.Object_2.geometry, starTexture])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime()
        }

        galaxyRef.current.rotation.z = state.clock.getElapsedTime() / 10 * -1
    })


    return (
        <group ref={galaxyRef} onClick={() => {
            if (onClick) onClick()
        }}>
            <points geometry={geometry} scale={0.05}>
                <primitive object={glowMaterial} ref={materialRef} attach="material" />
            </points>
            {children}
        </group>
    )
}

export default Galaxy