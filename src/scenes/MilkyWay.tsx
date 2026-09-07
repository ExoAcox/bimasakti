import { Html, Stars, useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    MathUtils,
    ShaderMaterial,
    type Group,
    type Mesh,
    type PointsMaterial
} from "three"
import type { GLTF } from "three-stdlib"
import { universes } from "@constants"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { classPosition } from "@function"
import { useGalaxyStore } from "@state"

type GLTFResult = GLTF & {
    nodes: {
        Object_2: Mesh
    }
    materials: {
        ['Scene_-_Root']: PointsMaterial
    }
}

const pointGlowVertexShader = /* glsl */ `
uniform float u_time;
attribute vec3 color;
attribute float a_size;

varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Larger size for smooth, seamless mist overlap
    gl_PointSize = a_size * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`

const pointGlowFragmentShader = /* glsl */ `
uniform sampler2D u_texture;
uniform float u_time;

varying vec3 vColor;

void main() {
    vec2 centerCoord = gl_PointCoord - vec2(0.5);
    float dist = length(centerCoord);
    if (dist > 0.5) discard;

    // Exponential Gaussian-like soft falloff for a diffuse mist / fog spread
    float mist = exp(-dist * 10.0);
    
    // Very gentle subtle pulse
    float pulse = 0.95 + 0.05 * sin(u_time * 1.5);
    
    // Intensity multiplier allowing overlapping mist to bloom softly
    float intensity = mist * 1.25 * pulse;

    vec4 texColor = texture2D(u_texture, gl_PointCoord);

    // Soft opacity with solid center fading out smoothly
    float alpha = mist * texColor.a;

    gl_FragColor = vec4(vColor * intensity, alpha);
}
`

const MilkyWay = () => {
    const { setFocus } = useGalaxyStore()

    const galaxyRef = useRef<Group>(null!)
    const materialRef = useRef<ShaderMaterial>(null!)
    const { t } = useTranslation()

    const starTexture = useTexture("/textures/star.png")
    const { nodes } = useGLTF("/models/milky_way.glb") as unknown as GLTFResult

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
                u_time: { value: 0 }
            },
            blending: AdditiveBlending,
            transparent: true,
            depthWrite: false,
        })

        return { geometry: geo, glowMaterial: mat }
    }, [nodes, starTexture])

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime()
        }

        galaxyRef.current.rotation.z = state.clock.getElapsedTime() / 10 * -1
    })

    const handleClick = (id: string) => {
        setFocus(id)
    }

    return (
        <>
            <Stars />
            <group ref={galaxyRef} onClick={() => setFocus("")}>
                <points geometry={geometry} scale={0.05}>
                    <primitive object={glowMaterial} ref={materialRef} attach="material" />
                </points>
                {
                    universes.map((universe) => {
                        if (universe.id === "milky_way") return null

                        const { root, parent, line } = classPosition(universe.labelPosition)

                        return (
                            <group position={universe.position} key={universe.id}>
                                <Html className={clsx("-mt-1 absolute", root)} >
                                    <button className={clsx("flex cursor-pointer", parent)} onClick={() => handleClick(universe.id)}>
                                        <label className="py-px px-1 whitespace-nowrap rounded text-[8px] font-semibold text-white bg-background hover:text-accent cursor-pointer"  >{t(`object.${universe.id}.name`)}</label>
                                        <div className={clsx("bg-background", line)} />
                                    </button>
                                </Html>
                                <mesh name={universe.id}>
                                    <sphereGeometry args={[0.00001]} />
                                    <meshBasicMaterial color="white" opacity={0} transparent />
                                </mesh>
                            </group>
                        )
                    })
                }
            </group>
        </>
    )
}

export default MilkyWay