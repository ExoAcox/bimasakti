import { useGLTF } from "@react-three/drei"
import type { ArtificialSatellite as ArtificialSatelliteType } from "../../constant"
import { Object3D, Mesh } from "three"

interface Props {
    data: ArtificialSatelliteType
}

const RenderObject = ({ data }: { data: Object3D }) => {
    if (data.type === "Group") {
        return (
            <group>
                {data.children.map(child => <RenderObject key={child.uuid} data={child} />)}
            </group>
        )
    }

    if (data.type === "Mesh") {
        const object = data as Mesh
        return <mesh castShadow receiveShadow geometry={object.geometry} material={object.material} />
    }

    return null
}

const ArtificialSatellite = ({ data }: Props) => {
    const gltf = useGLTF(data.model)

    return <RenderObject data={gltf.scene} />
}

export default ArtificialSatellite