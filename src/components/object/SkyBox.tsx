/* eslint-disable react-hooks/immutability */
import { useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { BackSide, NearestFilter, PerspectiveCamera, ShaderLib, ShaderMaterial, SRGBColorSpace, UniformsUtils, type Mesh } from "three"
import type { OrbitControls } from "three-stdlib"

interface Props {
    path: string
    size?: number
    followCamera?: boolean
}

const zoomMax = 100000
const zoomMin = 1
const fovMax = 75
const fovMin = 40

const zoomRange = zoomMax - zoomMin
const fovRange = fovMax - fovMin
const ratio = fovRange / zoomRange

const SkyBox = ({
    path,
    size = 1000000,
    followCamera = true,
}: Props) => {
    const meshRef = useRef<Mesh>(null!)
    const texture = useTexture(path)

    const controls = useThree((state) => state.controls as OrbitControls);

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

    useFrame(({ camera }) => {
        const zoom = controls?.getDistance()
        const orbitCamera = camera as PerspectiveCamera

        const fov = Math.max(fovMin, Math.min(fovMax, fovMin + (zoom - zoomMin) * ratio))
        orbitCamera.fov = fov
        orbitCamera.updateProjectionMatrix()
    })

    return (
        <mesh ref={meshRef} material={material}>
            <sphereGeometry args={[size, 64, 32]} />
        </mesh>
    )
}

export default SkyBox