import { Else, If, Then, When } from "react-if"

import type { Planet as PlanetType } from "@types"
import { useRef } from "react"
import type { Mesh } from "three"
import { useControlStore } from "@state"
import { CelestialBody, ModelRenderer, PlanetRing, TextureRenderer, PlanetCloud } from "@components/object"



interface Props {
    data: PlanetType
    children?: React.ReactNode
}

const Planet = ({ data, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const { sizeScale, setControl } = useControlStore()
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} cloudRef={cloudRef} childrenComponent={children}>
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

        <When condition={data.cloud_texture}>
            <PlanetCloud
                path={data.cloud_texture!}
                scale={scale}
                cloudRef={cloudRef} />
        </When>

        <When condition={!!data.ring}>
            <PlanetRing data={data} />
        </When>
    </CelestialBody>
}

export default Planet