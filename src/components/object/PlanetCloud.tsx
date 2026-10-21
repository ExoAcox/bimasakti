/* eslint-disable react-hooks/immutability */
import { useCelestial } from "@function";
import { useKTX2, useTexture } from "@react-three/drei";
import { useSettingStore } from "@state";
import type { Planet } from "@types";
import { useDeferredValue } from "react";
import { NoColorSpace, type Mesh } from "three";

interface Props {
    data: Planet
    cloudRef: React.RefObject<Mesh>
    scale?: number
    forceFocus?: boolean
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

const PlanetCloud = ({ data, cloudRef, scale: scaleProp, forceFocus = false }: Props) => {
    const celestial = useCelestial()
    const isFocused = forceFocus || celestial.isFocused
    const { sizeScale } = useSettingStore()

    const path = isFocused && data.cloud_texture_hd ? data.cloud_texture_hd : data.cloud_texture!
    const format = path.split(".")[1]
    const scale = data.radius / sizeScale
    const cloudScale = scaleProp || scale * 1.001
    const opacity = data.cloud_opacity ?? 1

    const texturePath = useDeferredValue(path)

    return <mesh ref={cloudRef} scale={cloudScale}>
        <sphereGeometry args={isFocused ? [1, 128, 64] : [1]} />
        {format === "ktx2" ? (
            <KTX2Loader path={texturePath} opacity={opacity} />
        ) : (
            <ImageLoader path={texturePath} opacity={opacity} />
        )}
    </mesh>
}

export default PlanetCloud