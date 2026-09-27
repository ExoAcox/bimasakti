/* eslint-disable react-hooks/rules-of-hooks */

import { useRef, Suspense, useDeferredValue, useMemo } from "react"
import { type Mesh } from "three"
import { Detailed } from "@react-three/drei"

import type { Planet as PlanetType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, PlanetCloud, PlanetRing, LandmarkMarker, PlyLoader, TextureLoader, SpaceCraft, Aurora, Atmosphere, EarthMaterial } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { Else, If, Then, When } from "react-if"
import nations from "@constants/solar-system/nation"
import NationMarker from "./NationMarker"
import { userDataFormat, useVariant } from "@function"

interface Props {
    data: PlanetType
    children?: React.ReactNode
    nightMode?: "auto" | "night" | "day"
    nightIntensity?: number
}

const PlanetMesh = ({ data }: { data: PlanetType }) => {
    const { focus } = useControlStore()

    const isFocused = focus === data.id
    const texturePath = (isFocused && data.texture_hd) ? data.texture_hd : data.texture!
    const texture = useDeferredValue(texturePath)
    const isPresentEarth = data.id === "earth" && !data.variant_id

    const material = useMemo(() => {
        if (isPresentEarth) {
            return <EarthMaterial
                textures={[
                    `/textures/${isFocused ? "earth_hd.ktx2" : "earth.ktx2"}`,
                    `/textures/${isFocused ? "earth_night_hd.ktx2" : "earth_night.ktx2"}`,
                ]}
                nightIntensity={1}
            />
        } else if (data.texture) {
            return <TextureLoader path={texture} />
        } else {
            return <meshStandardMaterial color={data.color} />
        }
    }, [isPresentEarth, data.texture, data.color, isFocused, texture])

    const materialRender = useDeferredValue(material)

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
            {materialRender}
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

    const data = useVariant(rawData) as PlanetType

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
                userData={userDataFormat(data)}
                scale={scale}
                onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                }}
            >
                <Detailed distances={[0, distance]}>
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
