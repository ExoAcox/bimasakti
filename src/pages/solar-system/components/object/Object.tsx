/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, Mesh, Object3D, Vector3 } from "three"
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
    const internalLabelRef = useRef<HTMLButtonElement>(null!)
    const targetPos = useRef(new Vector3())

    const { scene } = useThree()
    const { universe, focus, sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus } = useContext(ControlContext)
    const { t } = useTranslation()

    const focusedObject = getObjectById(focus)
    const defaultFocus = universe === "solar-system" ? "sun" : ""

    const axis = ignoreAxis ? 0 : MathUtils.degToRad(data?.axis ?? 0)
    const scale = data.radius / sizeScale
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

    const isAncestorOfFocused = (currentId: string, focusedId: string) => {
        let curr = getObjectById(focusedId);
        while (curr && curr.parent) {
            if (curr.parent === currentId) return true;
            curr = getObjectById(curr.parent);
        }
        return false;
    };

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

        const isParentOfFocused = focus ? isAncestorOfFocused(data.id, focus) : false;
        const isFocused = focus === data.id;

        const shouldPauseOrbit = pauseOrbitWhenFocus && (isFocused || isParentOfFocused);

        if (!shouldPauseOrbit) {
            orbitRef.current.rotation.y = rotate + (speed / data.orbit_duration * speedScale);
        }
    })

    useFrame((state) => {
        if (!internalLabelRef.current) return

        const object = scene.getObjectByName(data.id)
        if (!object) return

        object.getWorldPosition(targetPos.current)
        const distance = state.camera.position.distanceTo(targetPos.current)

        if (distance > scale * 50) {
            internalLabelRef.current.style.visibility = "visible"
        } else {
            internalLabelRef.current.style.visibility = "hidden"
        }
    })

    const isLabelVisible = useMemo(() => {
        if (universe === "solar-system") {
            const isSatellite = ["satellite", "artificial_satellite"].includes(data.type)

            if (!isSatellite) return true
            if (isSatellite) {
                if (focus === data.id) return true
                if (focus === data.parent) return true
                if (focusedObject?.parent === data.parent) return true
            }
        }

        if (universe === "alpha-centauri") {
            if (data.type === "star") return true
            if (data.parent === focus) return true

            if (data.type === "planet") {
                if (focus === data.id) return true
                if (focus === data.parent) return true
                if (focusedObject?.parent === data.parent) return true
            }
        }

        return false
    }, [data.type, data.id, data.parent, universe, focus, focusedObject])

    useLayoutEffect(() => {
        if (!focus && !defaultFocus) return setOcclude(undefined);

        if (focus === data.id) return setOcclude(undefined)
        if (focusedObject?.parent === data.id) return setOcclude(undefined)

        const object = scene.getObjectByName(focus || defaultFocus)
        if (!object) return setOcclude(undefined)

        const occlude = [{ current: object }]

        const isSatellite = ["satellite", "artificial_satellite"].includes(focusedObject?.type)

        if (isSatellite && focusedObject?.parent) {
            const parentObject = scene.getObjectByName(focusedObject.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        setOcclude(occlude)
    }, [focus, scene, focusedObject, defaultFocus, data.type, data.id])

    if (data.id === "mars") {
        console.log(occlude)
    }

    return <group rotation={[0, 0, axis]}>
        <When condition={showOrbitLine}>
            <OrbitLine radius={distance} color={data.color} />
        </When>

        <group ref={orbitRef} rotation={[0, rotate, 0]}>
            <group position={[distance, 0, 0]}>
                <Html occlude={occlude} zIndexRange={[data.type === "star" ? 2 : 1, 0]}>
                    <When condition={isLabelVisible}>
                        <button ref={labelRef || internalLabelRef} className="hover:text-accent absolute -translate-x-1/2 -translate-y-full -mt-1 py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold text-secondary" onClick={onClick}>{t(`object.${data.id}.name`)}</button>
                    </When>
                </Html>

                {children}
                {childrenComponent}
            </group>
        </group>
    </group>
}


export default Object