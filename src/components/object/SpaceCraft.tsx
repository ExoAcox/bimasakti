/* eslint-disable react-hooks/immutability */
import { Detailed, useGLTF } from "@react-three/drei"
import { type SpaceCraft as SpaceCraftType } from "@types"
import { Box3, MathUtils, Mesh, Vector3 } from "three"
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { userDataFormat } from "@function"
import { When } from "react-if"

interface Props {
    data: SpaceCraftType
}

interface GltfProps {
    data: SpaceCraftType
    objectRef: RefObject<Mesh>
}


const centeredIds = ["iss", "tiangong"]

const WireframeMesh = () => {
    return <mesh scale={2}>
        <sphereGeometry />
        <meshStandardMaterial wireframe />
    </mesh>
}

const GltfLoader = ({ data, objectRef }: GltfProps) => {
    const { scene } = useGLTF(`/models/${data.model}`)

    const model = useMemo(() => {
        const clone = scene.clone(true)

        if (centeredIds.includes(data.id)) {
            const box = new Box3().setFromObject(clone)
            const center = box.getCenter(new Vector3())

            clone.position.x -= center.x
            clone.position.y -= center.y
            clone.position.z -= center.z
        }

        return clone
    }, [scene, data.id])

    useEffect(() => {
        if (!objectRef.current) return

        const [x, y, z] = data.rotation ?? [0, 0, 0]

        objectRef.current.rotation.set(
            MathUtils.degToRad(x),
            MathUtils.degToRad(y),
            MathUtils.degToRad(z)
        )
    }, [data.rotation, objectRef])

    return <primitive object={model} />
}


const SpaceCraft = ({ data }: Props) => {
    const objectRef = useRef<Mesh>(null!)

    const { focus, artificialSatelliteVisible, setControl } = useControlStore()
    const { sizeScale, distanceScale } = useSettingStore()

    const isFocused = data.id === focus
    const scale = Math.max(data.radius / sizeScale, 5e-8)
    const distance = LOWREST_SCALE / distanceScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

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
                        <GltfLoader data={data} objectRef={objectRef} />
                    </When>
                    <WireframeMesh />
                </Detailed>
            </Suspense>
        </group>
    </CelestialBody>
}

export default SpaceCraft