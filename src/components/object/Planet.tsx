/* eslint-disable react-hooks/rules-of-hooks */

import { useRef, Suspense, useDeferredValue } from "react"
import { type Mesh } from "three"
import { Detailed } from "@react-three/drei"

import type { Planet as PlanetType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, PlanetCloud, PlanetRing, LandmarkMarker, PlyLoader, TextureLoader, SpaceCraft, Aurora, Atmosphere, EarthMaterial } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { Case, Default, Else, If, Switch, Then, When } from "react-if"
import nations from "@constants/solar-system/nation"
import NationMarker from "./NationMarker"
import { useVariant } from "@function"

interface Props {
    data: PlanetType
    children?: React.ReactNode
    nightMode?: "auto" | "night" | "day"
    nightIntensity?: number
}

const PlanetMesh = ({ data, hd }: { data: PlanetType, hd?: boolean }) => {
    const texturePath = (hd && data.texture_hd) ? data.texture_hd : data.texture!
    const texture = useDeferredValue(texturePath)
    const isPresentEarth = data.id === "earth" && !data.variant_id

    return <mesh castShadow receiveShadow>
        <If condition={data.model}>
            <Then>
                <PlyLoader path={data.model!} />
            </Then>
            <Else>
                <sphereGeometry args={[1, 64, 64]} />
            </Else>
        </If>
        <Suspense fallback={<meshStandardMaterial color={data.color} />}>
            <Switch>
                <Case condition={isPresentEarth}>
                    <EarthMaterial
                        textures={[
                            `/textures/${hd ? "earth_hd.ktx2" : "earth.ktx2"}`,
                            `/textures/${hd ? "earth_night_hd.ktx2" : "earth_night.ktx2"}`,
                        ]}
                        nightIntensity={1}
                    />
                </Case>
                <Case condition={data.texture}>
                    <TextureLoader path={texture} />
                </Case>
                <Default>
                    <meshStandardMaterial color={data.color} />
                </Default>
            </Switch>
        </Suspense>
    </mesh>
}


const Planet = ({
    data: rawData,
    children
}: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const { mode, sizeScale, distanceScale } = useSettingStore()
    const { focus, variant, landmarkVisible, nationVisible, cloudVisible, atmosphereVisible, setControl } = useControlStore()
    const distance = LOWREST_SCALE / distanceScale

    const data = useVariant(rawData)

    const scale = data.radius / sizeScale
    const distances = data.texture_hd ? [0, scale * 3, distance] : [0, distance]

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    if (!data) return null

    const isNormalMode = mode === "normal"
    const showLandmark = focus === data.id && landmarkVisible && isNormalMode
    const showNation = data.id === "earth" && nationVisible && isNormalMode && !variant
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
                userData={data}
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

                <When condition={Boolean(data.aurora) && data.id !== "earth" && atmosphereVisible}>
                    <Suspense fallback={null}>
                        <Aurora data={data} />
                    </Suspense>
                </When>

                <When condition={Boolean(data.ring?.texture)}>
                    <PlanetRing data={data} />
                </When>

                <When condition={showLandmark}>
                    {data.landmarks?.reverse().map((landmark) => (
                        <LandmarkMarker key={landmark.id} radius={data.radius} landmark={landmark} />
                    ))}
                </When>

                <When condition={showNation}>
                    {nations.reverse().map((nation) => (
                        <NationMarker key={nation.id} radius={data.radius} nation={nation} />
                    ))}
                </When>

                <When condition={atmosphereVisible}>
                    <When condition={data.atmosphere}>
                        <Atmosphere data={data} />
                    </When>
                    <When condition={data.aurora}>
                        <Aurora data={data} />
                    </When>
                </When>
            </group>

            <When condition={showCloud}>
                <Detailed distances={[0, distance]}>
                    <PlanetCloud
                        path={data.cloud_texture!}
                        opacity={data.cloud_opacity}
                        scale={scale}
                        cloudRef={cloudRef}
                    />
                    <mesh />
                </Detailed>
            </When>

            {data.artificial_satellites?.map(craft => (
                <SpaceCraft
                    key={craft.id}
                    data={craft}
                />
            ))}
        </CelestialBody>
    )
}

export default Planet
