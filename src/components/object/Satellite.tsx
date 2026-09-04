import { Else, If, Then } from "react-if"
import { useCelestial } from "@function"

import type { Satellite as SatelliteType } from "@types"
import { useContext, useMemo, useRef } from "react"
import { BufferAttribute, BufferGeometry, Mesh } from "three"
import { ControlContext } from "@context"
import { useTexture } from "@react-three/drei"
import { CelestialBody } from "@components/object"
import { useLoader } from "@react-three/fiber"
import { PLYLoader } from "three-stdlib"

const generateSphericalUVs = (geometry: BufferGeometry) => {
    if (!geometry || geometry.attributes.uv) return

    const pos = geometry.attributes.position
    if (!pos) return

    const uvs = new Float32Array(pos.count * 2)

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)

        const radius = Math.sqrt(x * x + y * y + z * z) || 1
        const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI)
        const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, y / radius))) / Math.PI

        uvs[i * 2] = u
        uvs[i * 2 + 1] = v
    }

    geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
}

const ModelGeometry = ({ path }: { path: string }) => {
    const geometry = useLoader(PLYLoader, `/solar-system/models/${path}`)

    useMemo(() => {
        if (geometry) {
            geometry.center()
            geometry.computeVertexNormals()
            generateSphericalUVs(geometry)
        }
    }, [geometry])

    return <primitive object={geometry} attach="geometry" />
}

const PlanetMaterial = ({ path }: { path: string }) => {
    const texture = useTexture(`/solar-system/textures/${path}`)
    return <meshStandardMaterial map={texture} />
}

interface Props {
    id: string
    children?: React.ReactNode
}

const Planet = ({ id, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const { sizeScale, setControl } = useContext(ControlContext)

    const data = useCelestial().getObjectById(id) as SatelliteType
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: id })
    }

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} overlayRef={overlayRef} childrenComponent={children}>
        <mesh ref={objectRef} name={id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <If condition={(data as SatelliteType).model}>
                <Then>
                    <ModelGeometry path={(data as SatelliteType).model} />
                </Then>
                <Else>
                    <sphereGeometry args={[1, 64, 64]} />
                </Else>
            </If>
            <If condition={data.texture}>
                <Then>
                    <PlanetMaterial path={data.texture!} />
                </Then>
                <Else>
                    <meshStandardMaterial color={data.color} wireframe />
                </Else>
            </If>
        </mesh>
    </CelestialBody>
}

export default Planet