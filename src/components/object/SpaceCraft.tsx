/* eslint-disable react-hooks/immutability */
import { Detailed } from "@react-three/drei"
import { type SpaceCraft as SpaceCraftType } from "@types"
import { MathUtils, Mesh } from "three"
import { Suspense, useEffect, useRef } from "react"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, GltfLoader } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { useCelestial, userDataFormat } from "@function"
import { When } from "react-if"
import { useThree } from "@react-three/fiber"

interface Props {
    data: SpaceCraftType
}


const centeredIds = ["iss", "tiangong"]

const WireframeMesh = () => {
    return <mesh scale={1}>
        <sphereGeometry />
        <meshStandardMaterial wireframe />
    </mesh>
}


const SpaceCraft = ({ data }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const { focus, focusIndex, artificialSatelliteVisible, setControl } = useControlStore()
    const { sizeScale, distanceScale } = useSettingStore()

    const celestial = useCelestial()
    const camera = useThree(state => state.camera)

    const isFocused = data.id === focus
    const scale = Math.max(data.radius / sizeScale, 5e-8)
    const distance = LOWREST_SCALE / distanceScale
    const center = centeredIds.includes(data.id)

    const handleClick = () => {
        if (isFocused) {
            const distance = celestial.getCameraDistance(camera, objectRef.current)

            if (scale * 10 < distance) {
                return setControl({ focusIndex: focusIndex + 1 })
            }
        } else {
            setControl({ focus: data.id })
        }


    }

    useEffect(() => {
        if (!objectRef.current) return

        const [x, y, z] = data.rotation ?? [0, 0, 0]

        objectRef.current.rotation.set(
            MathUtils.degToRad(x),
            MathUtils.degToRad(y),
            MathUtils.degToRad(z)
        )
    }, [data.rotation, objectRef])

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} visible={artificialSatelliteVisible}>
        <When condition={data.type === "spacecraft-flyby"}>
            <directionalLight position={[3, 0, 0]} color="white" intensity={0.5} />
        </When>

        <group
            ref={objectRef}
            name={data.id}
            userData={userDataFormat(data)}
            scale={scale}
            visible={artificialSatelliteVisible}
            onClick={(e) => {
                e.stopPropagation()
                handleClick()
            }}
        >
            <Suspense fallback={<WireframeMesh />}>
                <Detailed distances={[0, distance]}>
                    <When condition={isFocused}>
                        <GltfLoader path={data.model} rotation={data.rotation} center={center} />
                    </When>
                    <WireframeMesh />
                </Detailed>
            </Suspense>
        </group>
    </CelestialBody>
}

export default SpaceCraft