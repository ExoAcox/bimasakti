import type { Mesh, Object3D } from "three"

const Model = ({ data }: { data: Object3D }) => {
    if (data.type === "Group") {
        return (
            <group>
                {data.children.map(child => <Model key={child.uuid} data={child} />)}
            </group>
        )
    }

    if (data.type === "Mesh") {
        const object = data as Mesh
        return <mesh castShadow receiveShadow geometry={object.geometry} material={object.material} />
    }

    return null
}

export default Model