import { Else, If, Then, When } from "react-if"
import { useCelestial } from "@function"

import type { Planet as PlanetType } from "@types"
import { useContext, useRef } from "react"
import type { Mesh } from "three"
import { ControlContext } from "@context"
import { useTexture } from "@react-three/drei"
import { CelestialBody, PlanetRing } from "@components/object"

const PlanetMaterial = ({ path }: { path: string }) => {
    const texture = useTexture(`/solar-system/textures/${path}`)
    return <meshStandardMaterial map={texture} />
}

interface PlanetOverlayProps {
    texturePath: string;
    radius: number;
    overlayRef: (el: Mesh | null) => void;
}

const PlanetOverlay = ({ texturePath, radius, overlayRef }: PlanetOverlayProps) => {
    const texture = useTexture(`/solar-system/textures/${texturePath}`)
    const overlayRadius = radius / 100 * 0.75
    const scale = radius + overlayRadius

    return <mesh ref={overlayRef} scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
            alphaMap={texture}
            transparent={true}
            depthWrite={false}
        />
    </mesh>
}

interface Props {
    id: string
    children?: React.ReactNode
}

const Planet = ({ id, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const { sizeScale, setControl } = useContext(ControlContext)

    const data = useCelestial().getObjectById(id) as PlanetType
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
            <sphereGeometry args={[1, 64, 64]} />
            <If condition={data.texture}>
                <Then>
                    <PlanetMaterial path={data.texture!} />
                </Then>
                <Else>
                    <meshStandardMaterial color={data.color} wireframe />
                </Else>
            </If>
        </mesh>

        {data.overlay_textures?.map((texturePath, index) => (
            <PlanetOverlay
                key={index}
                texturePath={texturePath}
                radius={scale}
                overlayRef={(el) => {
                    overlayRef.current[index] = el!
                }}
            />
        ))}

        <When condition={!!data.ring}>
            <PlanetRing data={data} />
        </When>
    </CelestialBody>
}

export default Planet