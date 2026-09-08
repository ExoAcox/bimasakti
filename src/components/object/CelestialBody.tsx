/* eslint-disable react-hooks/set-state-in-effect */
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, Mesh, Object3D } from "three"
import type { CelestialObject, Planet as PlanetType } from "@types"
import { useFrame, useThree } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, useCelestial } from "@function";
import { Html } from "@react-three/drei";
import { useControlStore } from "@state";
import { useTranslation } from "react-i18next";
import { When } from "react-if"
import { OrbitLine } from "@components/object"
import { useParams } from "react-router";


interface Props {
    data: CelestialObject,
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
    // const targetPos = useRef(new Vector3())

    const { scene } = useThree()
    const { universe } = useParams()
    const { focus, sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus } = useControlStore()
    const { t } = useTranslation()

    const celestial = useCelestial()
    const focusedObject = celestial.getObjectById(focus)
    const defaultFocus = universe === "solar_system" ? "sun" : ""

    const axis = ignoreAxis ? 0 : MathUtils.degToRad(data?.axis ?? 0)
    // const scale = data.radius / sizeScale
    const rotate = useMemo(() => getInitialRotation(), [])
    const distance = useMemo(() => {
        if (!data.distance) return 0
        if (["satellite"].includes(data.type)) {
            const parentPlanet = celestial.getObjectById(data.parent) as PlanetType
            if (!parentPlanet) return 0
            const index = [...(parentPlanet.artificial_satellites ?? []), ...(parentPlanet.satellites ?? [])].findIndex((satellite) => satellite.id === data.id)
            return calculateSatelliteDistance(data.distance, distanceScale, parentPlanet.radius / sizeScale, index)
        } else {
            return data.distance / distanceScale
        }
    }, [celestial, data.distance, data.id, data.parent, data.type, distanceScale, sizeScale])

    const isAncestorOfFocused = (currentId: string, focusedId: string) => {
        let curr = celestial.getObjectById(focusedId);
        while (curr && curr.parent) {
            if (curr.parent === currentId) return true;
            curr = celestial.getObjectById(curr.parent);
        }
        return false;
    };

    useFrame((state) => {
        if (!data) return
        const elapsedTime = state.clock.getElapsedTime()
        const speed = ((elapsedTime % 60) / 60) * Math.PI * 2
        if (data.rotate_duration && objectRef?.current?.rotation) {
            objectRef.current.rotation.y = speed / data.rotate_duration * speedScale
        }

        if (data.rotate_duration && data.overlay_textures) {
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

    useFrame(({ camera }) => {
        if (!internalLabelRef.current) return

        const object = scene.getObjectByName(data.id)
        if (!object) return

        // object.getWorldPosition(targetPos.current)
        const distance = celestial.getCameraDistance(camera, object)
        const scale = Math.max(300, data.radius) / sizeScale * 50

        internalLabelRef.current.style.background = focus === data.id ? "rgba(0,0,0,0.75)" : "transparent"
        internalLabelRef.current.style.visibility = distance > scale ? "visible" : "hidden"

        if (internalLabelRef.current.parentElement?.parentElement) {
            internalLabelRef.current.parentElement.parentElement.style.zIndex = focus === data.id ? "5" : "1"
        }
    })

    const isLabelVisible = useMemo(() => {
        const isSmallestObject = () => {
            if (universe === "solar_system") {
                return ["satellite", "artificial_satellite"].includes(data.type)
            } else {
                return data.type === "planet"
            }
        }

        if (!isSmallestObject()) return true
        if (isSmallestObject()) {
            if (focus === data.id) return true
            if (focus === data.parent) return true
            if (focusedObject?.parent === data.parent) return true
        }

        return false
    }, [data.type, data.id, data.parent, universe, focus, focusedObject])

    useLayoutEffect(() => {
        if (!focus && !defaultFocus) return setOcclude(undefined);

        if (focus === data.id) return setOcclude(undefined)
        // if (defaultFocus === data.id) return setOcclude(undefined)

        const object = scene.getObjectByName(focus || defaultFocus)
        if (!object) return setOcclude(undefined)

        const occlude = [{ current: object }]
        if (focusedObject?.parent === data.id) return setOcclude(occlude)

        const isSatellite = ["satellite", "artificial_satellite"].includes(focusedObject?.type ?? "")

        if (isSatellite && focusedObject?.parent) {
            const parentObject = scene.getObjectByName(focusedObject.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        setOcclude(occlude)
    }, [focus, scene, focusedObject, defaultFocus, data.type, data.id])


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