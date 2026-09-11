import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";

interface Props {
    path: string;
    scale: number;
    cloudRef: React.RefObject<Mesh>
}

const CloudRenderer = ({ path, scale, cloudRef }: Props) => {
    const texture = useTexture(`/textures/${path}`)
    const cloudScale = scale * 1.075

    return <mesh ref={cloudRef} scale={cloudScale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
            alphaMap={texture}
            transparent={true}
            depthWrite={false}
        />
    </mesh>
}

export default CloudRenderer