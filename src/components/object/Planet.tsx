import { useRef, Suspense, useDeferredValue, useMemo } from "react"
import { type Mesh } from "three"
import { Detailed, useDetectGPU } from "@react-three/drei"

import { type Planet as PlanetType, type SpaceCraft as SpaceCraftType } from "@types"
import { useSettingStore, useControlStore } from "@state"
import { CelestialBody, PlanetCloud, PlanetRing, LandmarkMarker, TextureLoader, SpaceCraft, Aurora, Atmosphere, NightMaterial, PlyLoader, GltfLoader } from "@components/object"
import { LOWREST_SCALE } from "@constants"
import { When } from "react-if"
import nations from "@constants/solar-system/nation"
import NationMarker from "./NationMarker"
import { useCelestial, userDataFormat, useVariant } from "@function"

interface Props {
    data: PlanetType
    children?: React.ReactNode
    nightMode?: "auto" | "night" | "day"
    nightIntensity?: number
}

const PlanetMesh = ({ data }: { data: PlanetType }) => {
    const { focus } = useControlStore()
    const isFocused = data.id === focus
    const isChildParentFocused = useCelestial().isFocused(data.id)
    const isMobile = useDetectGPU().isMobile
    const shouldRenderHd = isChildParentFocused && !isMobile

    const { topographyVisible } = useControlStore()
    const texturePath = () => {
        if (data.topography_texture && topographyVisible && isFocused) return data.topography_texture
        return shouldRenderHd && data.texture_hd ? data.texture_hd : data.texture!
    }
    const texture = useDeferredValue(texturePath())

    const geometry = useMemo(() => {
        if (data.model && isFocused) {
            const format = data.model.split(".")[1]

            if (format === "ply") {
                return <PlyLoader path={data.model} rotation={data.rotation} />
            } else {
                return <GltfLoader path={data.model} rotation={data.rotation} />
            }
        } else {
            return <sphereGeometry args={isFocused ? [1, 128, 64] : [1, 64, 32]} />
        }
    }, [data.model, data.rotation, isFocused])

    const material = useMemo(() => {
        if (topographyVisible && isFocused) {
            return <TextureLoader path={texture} />
        } else if (data.night_texture) {
            return <NightMaterial
                textures={[
                    `/textures/${shouldRenderHd && data.night_texture_hd ? data.texture_hd : data.texture}`,
                    `/textures/${shouldRenderHd && data.night_texture_hd ? data.night_texture_hd : data.night_texture}`,
                ]}
                intensity={data.night_opacity}
            />
        } else if (data.texture) {
            return <TextureLoader path={texture} />
        } else {
            return <meshStandardMaterial color={data.color} />
        }
    }, [topographyVisible, isFocused, data.night_texture, data.texture, data.night_texture_hd, data.texture_hd, data.night_opacity, data.color, texture, shouldRenderHd])

    const geometryRender = useDeferredValue(geometry)
    const materialRender = useDeferredValue(material)

    return <mesh castShadow receiveShadow>
        <Suspense fallback={<sphereGeometry />}>
            {geometryRender}
        </Suspense>
        <Suspense fallback={<meshStandardMaterial color={data.color} wireframe />}>
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
    const isFocused = data.id === focus

    const handleClick = () => {
        const object = celestial.getObjectById(focus) as PlanetType | undefined

        if (data.id === object?.parent && object?.radius < 1 && object?.distance < 10000) return;

        setControl({ focus: data.id })
    }

    if (!data) return null

    const showLandmark = isFocused ? focus === data.id && landmarkVisible : false
    const showNation = isFocused ? data.id === "earth" && nationVisible && !variant : false
    const showCloud = isFocused ? data.cloud_texture && cloudVisible : data.cloud_texture
    const showAtmosphere = isFocused ? (data.atmosphere || data.aurora) && atmosphereVisible : (data.atmosphere || data.aurora)


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

                <When condition={data.ring?.texture}>
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

                <When condition={showAtmosphere}>
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
                {celestial.getObjectsByType("spacecraft-flyby").map(craft => (
                    <SpaceCraft
                        key={craft.id}
                        data={craft as SpaceCraftType}
                    />
                ))}
            </When>
        </CelestialBody>
    )
}

export default Planet
