/* eslint-disable react-hooks/immutability */
import { useRef } from "react"
import { type Mesh } from "three"
import { Detailed } from "@react-three/drei"

import type { Planet as PlanetType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, PlanetCloud, PlanetRing, LandmarkMarker, PlyLoader, TextureLoader, Earth } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { Else, If, Then, When } from "react-if"

interface Props {
    data: PlanetType
    children?: React.ReactNode
    nightMode?: "auto" | "night" | "day"
    nightIntensity?: number
}

const PlanetMesh = ({ data, hd }: { data: PlanetType, hd?: boolean }) => {

    if (data.id === "earth") return <Earth data={data} hd />

    return <mesh castShadow receiveShadow>
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
                <TextureLoader path={hd ? data.texture_hd! : data.texture!} />
            </Then>
            <Else>
                <meshStandardMaterial color={data.color} wireframe />
            </Else>
        </If>
    </mesh>
}


const Planet = ({
    data,
    children
}: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const { sizeScale, distanceScale } = useSettingStore()
    const { focus, landmarkVisible, cloudVisible, setControl } = useControlStore()
    const distance = LOWREST_SCALE / distanceScale
    const scale = data.radius / sizeScale

    const distances = data.texture_hd ? [0, scale * 2, distance] : [0, distance]

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    const showLandmark = focus === data.id && landmarkVisible
    const showCloud = data.cloud_texture && cloudVisible

    return (
        <CelestialBody
            data={data}
            objectRef={objectRef}
            onClick={handleClick}
            cloudRef={cloudRef}
            childrenComponent={children}
        >
            <group
                ref={objectRef}
                name={data.id}
                scale={scale}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}
            >
                <Detailed distances={distances}>
                    <When condition={data.texture_hd}>
                        <PlanetMesh data={data} hd />
                    </When>

                    <PlanetMesh data={data} />

                    <mesh>
                        <sphereGeometry />
                        <meshStandardMaterial color={data.color} />
                    </mesh>
                </Detailed>

                <When condition={Boolean(data.ring?.texture)}>
                    <PlanetRing data={data} />
                </When>

                <When condition={showLandmark}>
                    {data.landmarks?.map((landmark) => (
                        <LandmarkMarker key={landmark.id} radius={data.radius} landmark={landmark} />
                    ))}
                </When>
            </group>

            <When condition={showCloud}>
                <PlanetCloud
                    path={data.cloud_texture!}
                    scale={scale}
                    cloudRef={cloudRef}
                />
            </When>
        </CelestialBody>
    )
}

export default Planet
