/* eslint-disable react-hooks/rules-of-hooks */




import { useContext, useMemo, useRef } from "react"
import { Group, MathUtils, Mesh } from "three"
import { SCALE, type Planet, type Planet as PlanetType, type Satellite as SatelliteType } from "../constant"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, getObjectById } from "../function";
import OrbitLine from "./OrbitLine";
import { Html, useTexture } from "@react-three/drei";
import PlanetRing from "./PlanetRing";
import { ControlContext } from "../context";
import { useTranslation } from "react-i18next";


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



const Planet = ({ id, children }: Props) => {
    const orbitRef = useRef<Group>(null!)
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const { scene } = useThree()
    const { focus, sizeScale, distanceScale, speedScale, showOrbitLine, setControl } = useContext(ControlContext)
    const { t } = useTranslation()

    const data = getObjectById(id) as (PlanetType | SatelliteType)


    if (!data) return null




    const isSatellite = data.type === "satellite"
    const radius = data.radius / sizeScale
    const distance = () => {
        if (data.type === "satellite") {
            const parentPlanet = getObjectById(data.parent) as Planet
            const index = parentPlanet.satellites.findIndex((satellite) => satellite.id === data.id)
            return calculateSatelliteDistance(data.distance, distanceScale, parentPlanet.radius / sizeScale, index)
        } else {
            return data.distance / distanceScale
        }
    }

    const axis = MathUtils.degToRad(data.axis)

    if (data.id === "phobos") {
        console.log(distance, SCALE, sizeScale, (SCALE / sizeScale) / distanceScale)
    }


    useFrame(() => {
        const now = Date.now();
        const speed = ((now % 60000) / 60000) * Math.PI * 2;
        objectRef.current.rotation.y = speed / data.rotate_duration * speedScale


        if (data.overlay_textures) {
            const speed = ((now % 50000) / 50000) * Math.PI * 2;
            data.overlay_textures?.forEach((_, index) => {
                overlayRef.current[index].rotation.y = speed / data.rotate_duration * speedScale
            })
        }


        if (!focus) {
            // orbitRef.current.rotation.y = speed / data.orbit_duration * TIME_SCALE
        }
    })

    const handleClick = (event: ThreeEvent<Mesh>) => {
        event.stopPropagation()
        setControl({ focus: event.object.name })
    }

    const isLabelVisible = useMemo(() => {
        if (focus === data.id) return false
        if (!isSatellite) return true
        if (isSatellite && focus === data.parent) return true

        return false
    }, [focus, data.id, data.parent, isSatellite])

    const focusedObject = useMemo(() => {
        if (!focus) return undefined

        const object = scene.getObjectByName(focus)
        if (!object) return undefined

        const occlude = [{ current: object }]
        const objectDetail = getObjectById(focus) as SatelliteType
        if (objectDetail?.parent) {
            const parentObject = scene.getObjectByName(objectDetail.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        return occlude
    }, [focus, scene])

    return <>
        <group rotation={[0, 0, axis]}>
            {showOrbitLine ? <OrbitLine radius={distance()} color={data.color} /> : null}

            <group ref={orbitRef} rotation={[0, getInitialRotation(data.id), 0]}>
                <group position={[distance(), 0, 0]}>
                    <Html occlude={focusedObject} zIndexRange={[1, 0]}>
                        {isLabelVisible && <button className="py-1 px-2 rounded-lg text-sm font-semibold bg-white" onClick={() => setControl({ focus: data.id })}>{t(`object.${data.id}.name`)}</button>}
                    </Html>

                    <mesh ref={objectRef} name={data.id} onClick={handleClick}>
                        <sphereGeometry args={[radius, 64, 64]} />
                        {data.texture ? (
                            <PlanetMaterial texturePath={data.texture} />
                        ) : (
                            <meshStandardMaterial color={data.color} />
                        )}
                    </mesh>

                    {data.overlay_textures?.map((texturePath, index) => {
                        const texture = useTexture(`/solar-system/textures/${texturePath}`)
                        const overlayRadius = radius / 100 * 1

                        return <mesh ref={(el) => overlayRef.current[index] = el} key={index}>
                            <sphereGeometry args={[radius + overlayRadius, 64, 64]} />
                            <meshStandardMaterial
                                alphaMap={texture}
                                transparent={true}
                                depthWrite={false}
                            />
                        </mesh>
                    })}

                    {
                        (data as PlanetType).ring && <PlanetRing data={data as PlanetType} />
                    }

                    {children}
                </group>
            </group>
        </group>

    </>
}


export default Planet