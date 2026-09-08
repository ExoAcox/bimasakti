import { Else, If, Then } from "react-if"
import { useCelestial } from "@function"

import type { Blackhole as BlackholeType } from "@types"
import { useRef } from "react"
import type { Mesh } from "three"
import { useControlStore } from "@state"
import { useGLTF, useTexture } from "@react-three/drei"
import { CelestialBody } from "@components/object"

const BlackholeModel = ({ path }: { path: string }) => {
    const gltf = useGLTF(`/models/${path}`)
    return <primitive object={gltf.scene} />
}

const BlackholeMesh = ({ path }: { path: string }) => {
    const texture = useTexture(`/textures/${path}`)
    return <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
    </mesh>
}

interface Props {
    id: string
    children?: React.ReactNode
}

const Blackhole = ({ id, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const { sizeScale, setControl } = useControlStore()

    const data = useCelestial().getObjectById(id) as BlackholeType
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} overlayRef={overlayRef} childrenComponent={children}>
        <group ref={objectRef} name={id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }}>
            <If condition={data.model}>
                <Then>
                    <BlackholeModel path={data.model!} />
                </Then>
                <Else>
                    <BlackholeMesh path={data.texture!} />
                </Else>
            </If>
        </group>
    </CelestialBody>
}

export default Blackhole