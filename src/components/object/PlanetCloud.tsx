/* eslint-disable react-hooks/immutability */
import { useKTX2, useTexture } from "@react-three/drei";
import { useControlStore, useSettingStore } from "@state";
import type { Planet } from "@types";
import { NoColorSpace, type Mesh } from "three";

interface Props {
    data: Planet
    cloudRef: React.RefObject<Mesh>
}

const KTX2Loader = ({ path, opacity }: { path: string, opacity: number }) => {
    const texture = useKTX2(`/textures/${path}`)
    texture.colorSpace = NoColorSpace

    return <meshStandardMaterial
        color="#ffffff"
        opacity={opacity}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        roughness={1.0}
        metalness={0.0}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1} />
}

const ImageLoader = ({ path, opacity }: { path: string, opacity: number }) => {
    const texture = useTexture(`/textures/${path}`)
    texture.colorSpace = NoColorSpace

    return <meshStandardMaterial
        color="#ffffff"
        opacity={opacity}
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        roughness={1.0}
        metalness={0.0}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1} />
}

const PlanetCloud = ({ data, cloudRef }: Props) => {
    const { sizeScale } = useSettingStore()
    const { focus } = useControlStore()

    const isFocused = data.id === focus
    const path = data.cloud_texture ?? ""
    const format = path.split(".")[1]
    const scale = data.radius / sizeScale
    const cloudScale = scale * 1.001
    const opacity = data.cloud_opacity ?? 1

    return <mesh ref={cloudRef} scale={cloudScale} castShadow receiveShadow>
        <sphereGeometry args={isFocused ? [1, 128, 64] : [1]} />
        {format === "ktx2" ? (
            <KTX2Loader path={path} opacity={opacity} />
        ) : (
            <ImageLoader path={path} opacity={opacity} />
        )}
    </mesh>
}

export default PlanetCloud