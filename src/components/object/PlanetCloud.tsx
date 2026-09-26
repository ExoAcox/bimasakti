/* eslint-disable react-hooks/immutability */
import { useKTX2, useTexture } from "@react-three/drei";
import { NoColorSpace, type Mesh } from "three";

interface Props {
    path: string;
    scale: number;
    cloudRef: React.RefObject<Mesh>
    opacity?: number
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

const PlanetCloud = ({ path, scale, opacity = 1, cloudRef }: Props) => {
    const format = path.split(".")[1]
    const cloudScale = scale * 1.001

    return <mesh ref={cloudRef} scale={cloudScale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        {format === "ktx2" ? (
            <KTX2Loader path={path} opacity={opacity} />
        ) : (
            <ImageLoader path={path} opacity={opacity} />
        )}
    </mesh>
}

export default PlanetCloud