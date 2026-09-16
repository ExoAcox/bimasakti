import { useTexture } from "@react-three/drei"

const TextureRenderer = ({ path }: { path: string }) => {
    const texture = useTexture(`/textures/${path}`)
    return <meshStandardMaterial map={texture} />
}

export default TextureRenderer