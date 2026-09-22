import { Detailed, Gltf } from "@react-three/drei"
import { SpaceCraftClass, type SpaceCraft as SpaceCraftType } from "@types"
import { MathUtils, Mesh } from "three"
import { useRef } from "react"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { When } from "react-if"

interface Props {
    data: SpaceCraftType
}

const SpaceCraft = ({ data }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const { artificialSatelliteVisible, setControl } = useControlStore()
    const { sizeScale, distanceScale } = useSettingStore()
    const scale = Math.max(data.radius / sizeScale, 5e-8)
    const distance = LOWREST_SCALE / distanceScale
    const rotation: [number, number, number] = data.orbit_duration ? [0, 0, 0] : [0, MathUtils.degToRad(-90), 0]

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} orbitLineVisible={artificialSatelliteVisible}>

        <When condition={data.class === SpaceCraftClass.FlyBy}>
            <directionalLight position={[3, 0, 0]} color="white" intensity={0.5} />
        </When>

        <group
            ref={objectRef}
            name={data.id}
            userData={data}
            scale={scale}
            rotation={rotation}
            visible={artificialSatelliteVisible}
            onClick={(e) => {
                e.stopPropagation()
                handleClick()
            }}
        >
            <Detailed distances={[0, distance]}>
                <Gltf src={`/models/${data.model}`} />
                <mesh>
                    <sphereGeometry />
                    <meshStandardMaterial color={data.color} />
                </mesh>
            </Detailed>
        </group>
    </CelestialBody>
}

export default SpaceCraft