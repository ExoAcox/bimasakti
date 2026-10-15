/* eslint-disable react-hooks/immutability */
import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { Color, Mesh, MeshStandardMaterial, SRGBColorSpace } from "three"

interface Props {
    scale: number
}

const Terrain = ({ scale }: Props) => {
    const { scene } = useGLTF("/models/moon_terrain.glb")

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)
        clone.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh
                mesh.castShadow = true
                mesh.receiveShadow = true

                if (mesh.geometry && !mesh.geometry.attributes.uv2 && mesh.geometry.attributes.uv) {
                    mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv
                }

                if (mesh.material) {
                    const mat = (mesh.material as MeshStandardMaterial).clone()
                    if (mat.map) {
                        mat.map.colorSpace = SRGBColorSpace
                    }

                    if (mesh.name === "Petavius_ZB_LP_2_0") {
                        // Base / side pedestal of terrain chunk
                        mat.color = new Color("#08080a")
                        mat.roughness = 1.0
                        mat.metalness = 0.0
                    } else {
                        // Moon crater surface regolith
                        mat.roughness = 0.92
                        mat.metalness = 0.04
                    }
                    mesh.material = mat
                }
            }
        })
        return clone
    }, [scene])

    return (
        <group>
            <primitive
                object={clonedScene}
                scale={[scale, scale, scale]}
                position={[0, 0, 0]}
            />
        </group>
    )
}

useGLTF.preload("/models/moon_terrain.glb")

export default Terrain
