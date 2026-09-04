import { useGLTF } from "@react-three/drei"
import type { ArtificialSatellite as ArtificialSatelliteType } from "@types"
import { Object3D, Mesh } from "three"
import { useContext, useRef } from "react"
import { ControlContext } from "@context"
import { useCelestial } from "@function"
import { CelestialBody } from "@components/object"


interface Props {
    id: string
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

const ArtificialSatellite = ({ id }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const data = useCelestial().getObjectById(id) as ArtificialSatelliteType
    const gltf = useGLTF(data.model)

    const { sizeScale, setControl } = useContext(ControlContext)
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick}>
        <group ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <RenderObject data={gltf.scene} />
        </group>
        {/* <primitive object={gltf} ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow /> */}
    </CelestialBody>


}

export default ArtificialSatellite