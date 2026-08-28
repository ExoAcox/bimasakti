/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, Mesh, Object3D } from "three"
import { type ArtificialSatellite as ArtificialSatelliteType, type Planet as PlanetType, type Satellite as SatelliteType } from "../constant"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, getObjectById } from "../function";
import OrbitLine from "./OrbitLine";
import { Html, useTexture } from "@react-three/drei";
import PlanetRing from "./PlanetRing";
import { ControlContext } from "../context";
import { useTranslation } from "react-i18next";
import ArtificialSatellite from "./ArtificialSatellite";
import { Else, If, Then, When } from "react-if"


interface Props {
    id: string;
    children?: React.ReactNode
    isSatellite?: string;
}

interface PlanetMaterialProps {
    texturePath: string;
}

const PlanetMaterial = ({ texturePath }: PlanetMaterialProps) => {
    const texture = useTexture(`/solar-system/textures/${texturePath}`)
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



const Planet = ({ id, children }: Props) => {
    const orbitRef = useRef<Group>(null!)
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const [occlude, setOcclude] = useState<{ current: Object3D }[] | undefined>(undefined)

    const { scene } = useThree()
    const { focus, sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus, setControl } = useContext(ControlContext)
    const { t } = useTranslation()

    const data = getObjectById(id) as (PlanetType | SatelliteType | ArtificialSatelliteType)
    const focusedObject = getObjectById(focus)

    const axis = ignoreAxis ? 0 : MathUtils.degToRad(data?.axis ?? 0)
    const scale = (data?.radius ?? 0) / sizeScale
    const distance = () => {
        if (!data) return 0
        if (["satellite", "artificial_satellite"].includes(data.type)) {
            const parentPlanet = getObjectById(data.parent) as PlanetType
            if (!parentPlanet) return 0
            const index = [...(parentPlanet.artificial_satellites ?? []), ...parentPlanet.satellites].findIndex((satellite) => satellite.id === data.id)
            return calculateSatelliteDistance(data.distance, distanceScale, parentPlanet.radius / sizeScale, index)
        } else {
            return data.distance / distanceScale
        }
    }

    useFrame((state) => {
        if (!data) return
        const elapsedTime = state.clock.getElapsedTime()
        const speed = ((elapsedTime % 60) / 60) * Math.PI * 2
        if (objectRef.current) {
            objectRef.current.rotation.y = speed / data.rotate_duration * speedScale
        }


        if (data.overlay_textures) {
            const speedOverlay = ((elapsedTime % 50) / 50) * Math.PI * 2
            data.overlay_textures?.forEach((_, index) => {
                if (overlayRef.current[index]) {
                    overlayRef.current[index].rotation.y = speedOverlay / data.rotate_duration * speedScale
                }
            })
        }

        // if (!focus) {
        //     return orbitRef.current.rotation.y = speed / data.orbit_duration * speedScale;
        // }



        const isSatelliteFocused = ["satellite", "artificial_satellite"].includes(focusedObject?.type);
        const isParentOfFocused = isSatelliteFocused && data.id === focusedObject?.parent;
        const isFocused = focus === data.id;

        const shouldPauseOrbit = pauseOrbitWhenFocus && (isFocused || isParentOfFocused);

        if (!shouldPauseOrbit) {
            orbitRef.current.rotation.y = speed / data.orbit_duration * speedScale;
        }
    })

    const handleClick = (event: ThreeEvent<MouseEvent>, id: string) => {
        event.stopPropagation()
        setControl({ focus: id })
    }

    const dataId = data.id
    const dataType = data.type
    const dataParent = data.parent

    const isLabelVisible = useMemo(() => {
        const isSatellite = ["satellite", "artificial_satellite"].includes(dataType)

        if (focus === dataId) return false
        if (!isSatellite) return true
        if (isSatellite && focus === dataParent) return true

        return false
    }, [dataType, focus, dataId, dataParent])

    useEffect(() => {
        const object = scene.getObjectByName(focus || "sun")
        if (!object) setOcclude(undefined)

        const occlude = [{ current: object }]
        if (focusedObject?.parent) {
            const parentObject = scene.getObjectByName(focusedObject.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        setOcclude(occlude)
    }, [focus, scene, focusedObject])

    if (!data) return null

    return <group rotation={[0, 0, axis]}>
        <When condition={showOrbitLine}>
            <OrbitLine radius={distance()} color={data.color} />
        </When>

        <group ref={orbitRef} rotation={[0, getInitialRotation(data.id), 0]}>
            <group position={[distance(), 0, 0]}>
                <Html occlude={occlude} zIndexRange={[1, 0]}>
                    <When condition={isLabelVisible}>
                        <button className="py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold bg-white" onClick={() => setControl({ focus: data.id })}>{t(`object.${data.id}.name`)}</button>
                    </When>
                </Html>

                <If condition={data.type === "artificial_satellite"}>
                    <Then>
                        <group ref={objectRef} name={data.id} scale={scale} onClick={(e) => handleClick(e, data.id)} castShadow receiveShadow>
                            <ArtificialSatellite data={data as ArtificialSatelliteType} />
                        </group>
                    </Then>
                    <Else>
                        <mesh ref={objectRef} name={data.id} scale={scale} onClick={(e) => handleClick(e, data.id)} castShadow receiveShadow>
                            <sphereGeometry args={[1, 64, 64]} />
                            <If condition={data.texture}>
                                <Then>
                                    <PlanetMaterial texturePath={data.texture} />
                                </Then>
                                <Else>
                                    <meshStandardMaterial color={data.color} />
                                </Else>
                            </If>
                        </mesh>
                    </Else>
                </If>

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

                <When condition={!!(data as PlanetType).ring}>
                    <PlanetRing data={data as PlanetType} />
                </When>

                {/* {
                        (data as PlanetType).artificial_satellites?.map((satellite) => {
                            return <ArtificialSatellite key={satellite.id} data={satellite} />
                        })
                    } */}

                {children}
            </group>
        </group>
    </group>
}


export default Planet