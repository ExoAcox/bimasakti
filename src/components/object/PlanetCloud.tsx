import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";

interface Props {
    path: string;
    scale: number;
    cloudRef: React.RefObject<Mesh>
}

const CloudRenderer = ({ path, scale, cloudRef }: Props) => {
    const texture = useTexture(`/textures/${path}`)
    const cloudScale = scale * 1.01

    return <mesh ref={cloudRef} scale={cloudScale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
            color="#ffffff"
            alphaMap={texture}
            transparent={true}
            depthWrite={false}
            roughness={1.0}
            metalness={0.0}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
        />
    </mesh>
}

export default CloudRenderer