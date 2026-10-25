/* eslint-disable react-hooks/immutability */
import { useMemo, useRef } from "react"
import { useLoader } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { TDSLoader } from "three-stdlib"
import {
    AdditiveBlending,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    RepeatWrapping,
    SRGBColorSpace,
    type Blending
} from "three"

interface Props {
    modelPath?: string
    texturePath?: string
    scale?: number
    rotation?: [number, number, number]
    speed?: number
    opacity?: number
    color?: string
    blending?: Blending
}

const StarDisk = ({
    modelPath = "protoplanetary_disk.3ds",
    texturePath = "protoplanetary_disk.png",
    scale = 500,
    opacity = 1.0,
    blending = AdditiveBlending
}: Props) => {
    const diskRef = useRef<Group>(null!)

    const raw = useLoader(TDSLoader, `/models/${modelPath}`)
    const texture = useTexture(`/textures/${texturePath}`)

    const model = useMemo(() => {
        const cloned = raw.clone(true)

        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.colorSpace = SRGBColorSpace
        texture.needsUpdate = true

        cloned.traverse((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh
                if (mesh.geometry) {
                    mesh.geometry = mesh.geometry.clone()
                    const uv = mesh.geometry.attributes.uv
                    if (uv) {
                        for (let i = 0; i < uv.count; i++) {
                            const v = uv.getY(i)
                            // 3DS files specify inverted/negative V coordinates which clamp to row 0 (alpha=0)
                            // Shifting negative V by +1.0 normalizes UV mapping to [0.214, 0.786]
                            if (v < 0) {
                                uv.setY(i, v + 1.0)
                            }
                        }
                        uv.needsUpdate = true
                    }
                    mesh.geometry.computeVertexNormals()
                }

                mesh.material = new MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity,
                    side: DoubleSide,
                    depthWrite: false,
                    blending
                })
            }
        })
        return cloned
    }, [raw, texture, opacity, blending])

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <primitive
                ref={diskRef}
                object={model}
                scale={scale}
            />
        </group>
    )
}

export default StarDisk
