import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"
import { Box3, MathUtils, Vector3, type Mesh } from "three"


interface Props {
    path: string
    rotation?: [number, number, number]
    center?: boolean
}


const GltfLoader = ({ path, rotation, center = true }: Props) => {
    const { scene } = useGLTF(`/models/${path}`)

    const model = useMemo(() => {
        const clone = scene.clone(true)

        clone.traverse((child) => {
            if ((child as Mesh).isMesh) {
                child.frustumCulled = false
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        const box = new Box3().setFromObject(clone)
        const size = box.getSize(new Vector3())
        const sizeArr = [size.x, size.y, size.z].sort((a, b) => a - b)
        const dimension = () => {
            if (sizeArr[0] * 2.3 <= sizeArr[2]) {
                return sizeArr[2]
            } else {
                return sizeArr[0]
            }
        }

        const scaleFactor = 1.5 / dimension()
        clone.scale.setScalar(scaleFactor)

        if (center) {
            const position = box.getCenter(new Vector3())
            clone.position.copy(position).multiplyScalar(-scaleFactor)
        }

        return clone
    }, [scene, center])

    const [x = 0, y = 0, z = 0] = rotation ?? []

    const eulerRotation = useMemo(() => {
        return [
            MathUtils.degToRad(x),
            MathUtils.degToRad(y),
            MathUtils.degToRad(z),
        ] as [number, number, number]
    }, [x, y, z])

    return (
        <group rotation={eulerRotation}>
            <primitive object={model} />
        </group>
    )
}


export default GltfLoader