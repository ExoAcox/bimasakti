/* eslint-disable react-hooks/immutability */
import { useKTX2, useTexture } from "@react-three/drei"
import { SRGBColorSpace } from "three"

const KTX2Loader = ({ path }: { path: string }) => {
    const texture = useKTX2(`/textures/${path}`)
    texture.colorSpace = SRGBColorSpace

    return <meshStandardMaterial map={texture} />
}

const ImageLoader = ({ path }: { path: string }) => {
    const texture = useTexture(`/textures/${path}`)
    texture.colorSpace = SRGBColorSpace

    return <meshStandardMaterial map={texture} />
}

const TextureRenderer = ({ path }: { path: string }) => {
    if (!path) return null
    const format = path.split(".")[1]

    if (format === "ktx2") {
        return <KTX2Loader path={path} />
    } else {
        return <ImageLoader path={path} />
    }
}

export default TextureRenderer