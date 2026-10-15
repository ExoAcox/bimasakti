/* eslint-disable react-hooks/immutability */
import { useGLTF, useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { Color, DoubleSide, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Vector2 } from "three"

interface Props {
    scale: number
}

const Terrain = ({ scale }: Props) => {
    const { scene } = useGLTF("/models/mars_terrain.glb")

    const textures = useTexture({
        map: "/textures/rocky_terrain_03/diff_2k.jpg",
        normalMap: "/textures/rocky_terrain_03/nor_gl_2k.jpg",
        roughnessMap: "/textures/rocky_terrain_03/rough_2k.jpg",
        aoMap: "/textures/rocky_terrain_03/ao_2k.jpg",
    })

    const customMaterial = useMemo(() => {
        const { map, normalMap, roughnessMap, aoMap } = textures

        const repeatCount = 18
            ;[map, normalMap, roughnessMap, aoMap].forEach((tex) => {
                tex.wrapS = RepeatWrapping
                tex.wrapT = RepeatWrapping
                tex.repeat.set(repeatCount, repeatCount)
                tex.needsUpdate = true
            })

        map.colorSpace = SRGBColorSpace

        return new MeshStandardMaterial({
            map,
            normalMap,
            normalScale: new Vector2(1.8, 1.8),
            roughnessMap,
            roughness: 0.92,
            metalness: 0.05,
            aoMap,
            aoMapIntensity: 1.0,
            color: new Color("#d98358"), // Mars reddish-ochre regolith tint
        })
    }, [textures])

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)
        clone.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.material = customMaterial

                if (mesh.geometry && !mesh.geometry.attributes.uv2 && mesh.geometry.attributes.uv) {
                    mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv
                }
            }
        })
        return clone
    }, [scene, customMaterial])

    return (
        <group>
            <primitive
                object={clonedScene}
                scale={[scale, scale, scale]}
                position={[0, 0, 0]}
            />
            {/* Vertical testing plane */}
            {/* <mesh rotation={[0, Math.PI / 2, 0]} position={[-100, 0, 0]} castShadow>
                <planeGeometry args={[500, 68]} />
                <meshBasicMaterial side={DoubleSide} fog={false} />
            </mesh> */}
        </group>
    )
}

export default Terrain