import { useGLTF } from "@react-three/drei"
import type { ArtificialSatellite as ArtificialSatelliteType } from "@types"
import { Mesh } from "three"
import { useRef } from "react"
import { useControlStore } from "@state"
import { CelestialBody, Model } from "@components/object"


interface Props {
    data: ArtificialSatelliteType
}

const ArtificialSatellite = ({ data }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const gltf = useGLTF(data.model)

    const { sizeScale, setControl } = useControlStore()
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick}>
        <group ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <Model data={gltf.scene} />
        </group>
        {/* <primitive object={gltf} ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow /> */}
    </CelestialBody>


}

export default ArtificialSatellite