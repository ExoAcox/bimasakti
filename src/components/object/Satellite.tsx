import { Else, If, Then } from "react-if"

import type { Satellite as SatelliteType } from "@types"
import { useRef } from "react"
import { Mesh } from "three"
import { useControlStore } from "@state"
import { CelestialBody, PlyLoader, TextureLoader } from "@components/object"
import { Detailed } from "@react-three/drei"
import { LOWREST_SCALE } from "@constants"


interface Props {
    data: SatelliteType
    children?: React.ReactNode
}

const Satellite = ({ data, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const { sizeScale, distanceScale, setControl } = useControlStore()
    const distance = LOWREST_SCALE / distanceScale
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} childrenComponent={children}>
        <group ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <Detailed distances={[0, distance]}>
                <mesh castShadow receiveShadow>
                    <If condition={data.model}>
                        <Then>
                            <PlyLoader path={data.model!} />
                        </Then>
                        <Else>
                            <sphereGeometry args={[1, 64, 64]} />
                        </Else>
                    </If>
                    <If condition={data.texture}>
                        <Then>
                            <TextureLoader path={data.texture!} />
                        </Then>
                        <Else>
                            <meshStandardMaterial color={data.color} wireframe />
                        </Else>
                    </If>
                </mesh>
                <mesh>
                    <sphereGeometry />
                    <meshStandardMaterial color={data.color} />
                </mesh>
            </Detailed>
        </group>
    </CelestialBody>
}

export default Satellite
