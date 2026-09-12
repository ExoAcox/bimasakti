/* eslint-disable react-hooks/immutability */
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { BackSide, NearestFilter, ShaderLib, ShaderMaterial, SRGBColorSpace, UniformsUtils, type Mesh } from "three"

interface Props {
    texturePath?: string
    size?: number
    followCamera?: boolean
}

const SkyBox = ({
    texturePath = "/textures/milkyway.jpg",
    size = 1000000,
    followCamera = true,
}: Props) => {
    const meshRef = useRef<Mesh>(null!)
    const texture = useTexture(texturePath)

    const material = useMemo(() => {
        texture.colorSpace = SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = NearestFilter
        texture.magFilter = NearestFilter

        const shader = ShaderLib.equirect
        const uniforms = UniformsUtils.clone(shader.uniforms)
        uniforms.tEquirect.value = texture

        return new ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms,
            depthWrite: false,
            side: BackSide,
        })
    }, [texture])

    useFrame(({ camera }) => {
        if (followCamera && meshRef.current) {
            meshRef.current.position.copy(camera.position)
        }
    })

    return (
        <mesh ref={meshRef} material={material}>
            <sphereGeometry args={[size, 64, 64]} />
        </mesh>
    )
}

export default SkyBox