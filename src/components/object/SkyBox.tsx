/* eslint-disable react-hooks/immutability */
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

interface Props {
    texturePath?: string
    size?: number
    followCamera?: boolean
}

const SkyBox = ({
    texturePath = "/solar-system/textures/milkyway.jpg",
    size = 1000000,
    followCamera = true,
}: Props) => {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useTexture(texturePath)

    const material = useMemo(() => {
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearFilter

        const shader = THREE.ShaderLib.equirect
        const uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        uniforms.tEquirect.value = texture

        return new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        })
    }, [texture])

    useFrame(({ camera }) => {
        if (followCamera && meshRef.current) {
            meshRef.current.position.copy(camera.position)
        }
    })

    return (
        <mesh ref={meshRef} material={material}>
            <boxGeometry args={[size, size, size]} />
        </mesh>
    )
}

export default SkyBox