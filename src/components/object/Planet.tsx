import { useRef, Suspense, useDeferredValue, useMemo } from "react"
import { type Mesh } from "three"
import { Detailed } from "@react-three/drei"

import { SpaceCraftClass, type Planet as PlanetType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, PlanetCloud, PlanetRing, LandmarkMarker, TextureLoader, SpaceCraft, Aurora, Atmosphere, NightMaterial, PlyLoader } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { Else, If, Then, When } from "react-if"
import nations from "@constants/solar-system/nation"
import NationMarker from "./NationMarker"
import { useCelestial, userDataFormat, useVariant } from "@function"
import spacecraft from "@constants/solar-system/spacecraft"

interface Props {
    data: PlanetType
    children?: React.ReactNode
    nightMode?: "auto" | "night" | "day"
    nightIntensity?: number
}

const PlanetMesh = ({ data }: { data: PlanetType }) => {
    const isFocused = useCelestial().isFocused(data.id)

    const { topographyVisible } = useControlStore()
    const texturePath = () => {
        if (data.topography_texture && topographyVisible) return data.topography_texture
        return isFocused && data.texture_hd ? data.texture_hd : data.texture!
    }
    const texture = useDeferredValue(texturePath())

    const material = useMemo(() => {
        if (topographyVisible) {
            return <TextureLoader path={texture} />
        } else if (data.night_texture) {
            return <NightMaterial
                textures={[
                    `/textures/${isFocused && data.night_texture_hd ? data.texture_hd : data.texture}`,
                    `/textures/${isFocused && data.night_texture_hd ? data.night_texture_hd : data.night_texture}`,
                ]}
                intensity={data.night_opacity}
            />
        } else if (data.texture) {
            return <TextureLoader path={texture} />
        } else {
            return <meshStandardMaterial color={data.color} />
        }
    }, [data.night_texture, data.texture, data.night_texture_hd, data.texture_hd, data.night_opacity, data.color, topographyVisible, texture, isFocused])

    const materialRender = useDeferredValue(material)

    return <mesh castShadow receiveShadow>
        <If condition={data.model}>
            <Then>
                <PlyLoader path={data.model!} />
            </Then>
            <Else>
                <sphereGeometry args={isFocused ? [1, 128, 64] : [1, 64, 32]} />
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

    const celestial = useCelestial()
    const { sizeScale, distanceScale } = useSettingStore()
    const { focus, variant, landmarkVisible, nationVisible, cloudVisible, atmosphereVisible, setControl } = useControlStore()
    const distance = LOWREST_SCALE / distanceScale

    const data = useVariant(rawData) as PlanetType
    const scale = data.radius / sizeScale

    const handleClick = () => {
        const object = celestial.getObjectById(focus) as PlanetType
        if (data.id === object.parent && object.radius < 1 && object.distance < 10000) return;

        setControl({ focus: data.id })
    }

    if (!data) return null

    const showLandmark = focus === data.id && landmarkVisible
    const showNation = data.id === "earth" && nationVisible && !variant
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
                        <LandmarkMarker key={landmark.id} radius={data.radius} landmark={landmark} custom={Boolean(data.model)} />
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
                        data={data}
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

            <When condition={data.id === "earth"}>
                {spacecraft.filter(craft => craft.class === SpaceCraftClass.FlyBy).map(craft => (
                    <SpaceCraft
                        key={craft.id}
                        data={craft}
                    />
                ))}
            </When>
        </CelestialBody>
    )
}

export default Planet
