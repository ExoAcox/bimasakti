import { Else, If, Then } from "react-if"

import type { Satellite as SatelliteType } from "@types"
import { useRef } from "react"
import { Mesh } from "three"
import { useControlStore } from "@state"
import { CelestialBody, ModelRenderer, TextureRenderer } from "@components/object"


interface Props {
    data: SatelliteType
    children?: React.ReactNode
}

const Satellite = ({ data, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const { sizeScale, setControl } = useControlStore()
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} childrenComponent={children}>
        <mesh ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <If condition={data.model}>
                <Then>
                    <ModelRenderer path={data.model!} />
                </Then>
                <Else>
                    <sphereGeometry args={[1, 64, 64]} />
                </Else>
            </If>
            <If condition={data.texture}>
                <Then>
                    <TextureRenderer path={data.texture!} />
                </Then>
                <Else>
                    <meshStandardMaterial color={data.color} wireframe />
                </Else>
            </If>
        </mesh>
    </CelestialBody>
}

export default Satellite
