/* eslint-disable react-hooks/immutability */
import { useKTX2, useTexture } from "@react-three/drei";
import { NoColorSpace, type Mesh } from "three";

interface Props {
    path: string;
    scale: number;
    cloudRef: React.RefObject<Mesh>
}

const KTX2Loader = ({ path }: { path: string }) => {
    const texture = useKTX2(`/textures/${path}`)
    texture.colorSpace = NoColorSpace

    return <meshStandardMaterial
        color="#ffffff"
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        roughness={1.0}
        metalness={0.0}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1} />
}

const ImageLoader = ({ path }: { path: string }) => {
    const texture = useTexture(`/textures/${path}`)
    texture.colorSpace = NoColorSpace

    return <meshStandardMaterial
        color="#ffffff"
        alphaMap={texture}
        transparent={true}
        depthWrite={false}
        roughness={1.0}
        metalness={0.0}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1} />
}

const CloudRenderer = ({ path, scale, cloudRef }: Props) => {
    const format = path.split(".")[1]
    const cloudScale = scale * 1.01

    return <mesh ref={cloudRef} scale={cloudScale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        {format === "ktx2" ? (
            <KTX2Loader path={path} />
        ) : (
            <ImageLoader path={path} />
        )}
    </mesh>
}

export default CloudRenderer