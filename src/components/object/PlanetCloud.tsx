/* eslint-disable react-hooks/immutability */
import { useCelestial } from "@function";
import { useKTX2, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Planet } from "@types";
import { useDeferredValue, useRef } from "react";
import { NoColorSpace, type Mesh } from "three";

interface Props {
    data: Planet
    forceFocus?: boolean
}

const KTX2Loader = ({ path, opacity }: { path: string, opacity: number }) => {
    const texture = useKTX2(`/textures/${path}`)
    texture.colorSpace = NoColorSpace

    return <meshStandardMaterial
        color="#ffffff"
        opacity={opacity}
        map={texture}
        transparent={true}
        depthWrite={false}
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
        map={texture}
        transparent={true}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1} />
}

const PlanetCloud = ({ data, forceFocus = false }: Props) => {
    const celestial = useCelestial()
    const isFocused = forceFocus || celestial.isFocused
    const cloudRef = useRef<Mesh>(null!)

    const path = isFocused && data.cloud_texture_hd ? data.cloud_texture_hd : data.cloud_texture!
    const format = path.split(".")[1]
    const cloudScale = 1.001
    const opacity = data.cloud_opacity ?? 1

    const texturePath = useDeferredValue(path)

    useFrame((_, delta) => {
        if (cloudRef.current) {
            cloudRef.current.rotation.y += delta * 0.05
        }
    });

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