/* eslint-disable react-hooks/rules-of-hooks */



import { useContext, useMemo, useRef } from "react"
import { Group, MathUtils, Mesh } from "three"
import { SCALE, TIME_SCALE, type Planet as PlanetType } from "../constant"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { getPlanetById, getSatelliteById } from "../function";
import OrbitLine from "./OrbitLine";
import { useTexture } from "@react-three/drei";
import PlanetRing from "./PlanetRing";
import { ControlContext } from "../context";


interface Props {
    id: string;
    children?: React.ReactNode
    isSatellite?: boolean;
}

interface PlanetMaterialProps {
    texturePath: string;
}

const PlanetMaterial = ({ texturePath }: PlanetMaterialProps) => {
    const texture = useTexture(`/solar-system/textures/${texturePath}`)
    return <meshStandardMaterial map={texture} />
}

const Planet = ({ id, children, isSatellite }: Props) => {
    const orbitRef = useRef<Group>(null!)
    const objectRef = useRef<Mesh>(null!)
    const overlayRef = useRef<Mesh[]>([])

    const { focus, setControl } = useContext(ControlContext)

    const data = useMemo(() => {
        if (isSatellite) {
            return getSatelliteById(id)
        } else {
            return getPlanetById(id)
        }
    }, [id, isSatellite])

    if (!data) return null

    const radius = data.radius / SCALE
    const distance = data.distance / SCALE
    const axis = MathUtils.degToRad(data.axis)


    useFrame(() => {
        const now = Date.now();
        const speed = ((now % 60000) / 60000) * Math.PI * 2;
        objectRef.current.rotation.y = speed / data.rotate_duration * TIME_SCALE


        if (data.overlay_textures) {
            const speed = ((now % 50000) / 50000) * Math.PI * 2;
            data.overlay_textures?.forEach((_, index) => {
                overlayRef.current[index].rotation.y = speed / data.rotate_duration * TIME_SCALE
            })
        }


        if (!focus) {
            orbitRef.current.rotation.y = speed / data.orbit_duration * TIME_SCALE
        }
    })

    const handleClick = (event: ThreeEvent<Mesh>) => {
        event.stopPropagation()
        setControl({ focus: event.object.name })
    }

    return <>
        <group rotation={[0, 0, axis]}>
            <OrbitLine radius={distance} color={data.color} />

            <group ref={orbitRef}>
                <group position={[distance, 0, 0]}>
                    <mesh ref={objectRef} name={data.id} onClick={handleClick}>
                        <sphereGeometry args={[radius, 64, 64]} />
                        <meshStandardMaterial wireframe color={data.color} />
                        {data.texture ? (
                            <PlanetMaterial texturePath={data.texture} />
                        ) : (
                            <meshStandardMaterial wireframe color={data.color} />
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