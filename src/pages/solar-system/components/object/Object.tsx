/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, Mesh, Object3D } from "three"
import { type Star as StarType, type ArtificialSatellite as ArtificialSatelliteType, type Planet as PlanetType, type Satellite as SatelliteType, type Dummy } from "../../constants"
import { useFrame, useThree } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, getObjectById } from "../../function";
import { Html } from "@react-three/drei";
import { ControlContext } from "../../context";
import { useTranslation } from "react-i18next";
import { When } from "react-if"
import { OrbitLine } from "."


interface Props {
    data: StarType | PlanetType | SatelliteType | ArtificialSatelliteType | Dummy,
    onClick: () => void,
    children?: React.ReactNode
    objectRef?: React.RefObject<Mesh | null>,
    overlayRef?: React.RefObject<Mesh[]>,
    labelRef?: React.RefObject<HTMLButtonElement>
    childrenComponent?: React.ReactNode
}




const Object = ({ data, children, childrenComponent, onClick, objectRef, overlayRef, labelRef }: Props) => {
    const [occlude, setOcclude] = useState<{ current: Object3D }[] | undefined>(undefined)

    const orbitRef = useRef<Group>(null!)
    const { scene } = useThree()
    const { universe, focus, sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus } = useContext(ControlContext)
    const { t } = useTranslation()

    const focusedObject = getObjectById(focus)
    const defaultFocus = universe === "solar-system" ? "sun" : ""

    const axis = ignoreAxis ? 0 : MathUtils.degToRad(data?.axis ?? 0)
    // const scale = data.radius / sizeScale
    const rotate = useMemo(() => getInitialRotation(), [])
    const distance = useMemo(() => {
        if (!data.distance) return 0
        if (["satellite"].includes(data.type)) {
            const parentPlanet = getObjectById(data.parent) as PlanetType
            if (!parentPlanet) return 0
            const index = [...(parentPlanet.artificial_satellites ?? []), ...parentPlanet.satellites].findIndex((satellite) => satellite.id === data.id)
            return calculateSatelliteDistance(data.distance, distanceScale, parentPlanet.radius / sizeScale, index)
        } else {
            return data.distance / distanceScale
        }
    }, [data, distanceScale, sizeScale])



    useFrame((state) => {
        if (!data) return
        const elapsedTime = state.clock.getElapsedTime()
        const speed = ((elapsedTime % 60) / 60) * Math.PI * 2
        if (objectRef?.current) {
            objectRef.current.rotation.y = speed / data.rotate_duration * speedScale
        }


        if (data.overlay_textures) {
            const speedOverlay = ((elapsedTime % 50) / 50) * Math.PI * 2
            data.overlay_textures?.forEach((_, index) => {
                if (overlayRef?.current?.[index]) {
                    overlayRef.current[index].rotation.y = speedOverlay / data.rotate_duration * speedScale
                }
            })
        }

        if (!data.orbit_duration) return

        const isSatelliteFocused = ["satellite", "artificial_satellite"].includes(focusedObject?.type);
        const isParentOfFocused = isSatelliteFocused && data.id === focusedObject?.parent;
        const isFocused = focus === data.id;

        const shouldPauseOrbit = pauseOrbitWhenFocus && (isFocused || isParentOfFocused);

        if (!shouldPauseOrbit) {
            orbitRef.current.rotation.y = rotate + (speed / data.orbit_duration * speedScale);
        }
    })


    const isLabelVisible = useMemo(() => {
        const isSatellite = ["satellite", "artificial_satellite"].includes(data.type)

        if (universe === "solar-system") {
            if (!focus && defaultFocus === data.id) return false
            if (focus === data.id) return false
            if (!isSatellite) return true
            if (isSatellite) {
                if (focus === data.parent) return true
                if (focusedObject?.parent === data.parent) return true
            }
        }

        if (universe === "alpha-centauri") {

            console.log(focus, data.id, data.type)
            if (data.parent === focus) return true
            if (focus === "proxima_centauri") return false
            if (data.type === "star") return true

            // console.log(focus, data.type)

        }

        return false
    }, [data.type, data.id, data.parent, universe, focus, defaultFocus, focusedObject])

    useEffect(() => {
        if (!focus && !defaultFocus) return setOcclude(undefined);

        const object = scene.getObjectByName(focus || defaultFocus)
        if (!object) return setOcclude(undefined)

        const occlude = [{ current: object }]
        const isSatellite = ["satellite", "artificial_satellite"].includes(data.type)

        if (isSatellite && focusedObject?.parent) {
            const parentObject = scene.getObjectByName(focusedObject.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        setOcclude(occlude)
    }, [focus, scene, focusedObject, defaultFocus, data.type])

    return <group rotation={[0, 0, axis]}>
        <When condition={showOrbitLine}>
            <OrbitLine radius={distance} color={data.color} />
        </When>

        <group ref={orbitRef} rotation={[0, rotate, 0]}>
            <group position={[distance, 0, 0]}>
                <Html occlude={occlude} zIndexRange={[data.type === "star" ? 2 : 1, 0]}>
                    <When condition={isLabelVisible}>
                        <button ref={labelRef} className="hover:text-accent absolute -translate-x-1/2 -translate-y-full -mt-1 py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold text-secondary" onClick={onClick}>{t(`object.${data.id}.name`)}</button>
                    </When>
                </Html>

                {children}
                {childrenComponent}
            </group>
        </group>
    </group>
}


export default Object