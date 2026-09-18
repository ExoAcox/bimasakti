/* eslint-disable react-hooks/set-state-in-effect */
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { Group, MathUtils, Matrix4, Mesh, Object3D, Vector3 } from "three"
import type { CelestialObject, Planet as PlanetType } from "@types"
import { useFrame, useThree } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, useCelestial } from "@function";
import { Html } from "@react-three/drei";
import { useSettingStore, useControlStore } from "@state";
import { useTranslation } from "react-i18next";
import { When } from "react-if"
import { OrbitLine } from "@components/object"

interface Props {
    data: CelestialObject,
    onClick: () => void,
    children?: React.ReactNode
    objectRef?: React.RefObject<Mesh | null>,
    cloudRef?: React.RefObject<Mesh | null>,
    labelRef?: React.RefObject<HTMLButtonElement>
    childrenComponent?: React.ReactNode
    orbitLineVisible?: boolean
}

const Object = ({ data, children, childrenComponent, onClick, objectRef, cloudRef, labelRef, orbitLineVisible = true }: Props) => {
    const [occlude, setOcclude] = useState<{ current: Object3D }[] | undefined>(undefined)

    const orbitRef = useRef<Group>(null!)
    const internalLabelRef = useRef<HTMLButtonElement>(null!)

    const { scene } = useThree()

    const { sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus } = useSettingStore()
    const { focus, focusLandmark, rotateSpeed } = useControlStore()
    const { t } = useTranslation()

    const celestial = useCelestial()
    const universe = celestial.getUniverse()
    const focusedObject = celestial.getObjectById(focus) as CelestialObject
    const defaultFocus = universe.defaultFocus

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

    const longestDistance = useMemo(() => {
        if (!("longest_distance" in data) || !data.longest_distance) return distance;
        return data.longest_distance / distanceScale;
    }, [data, distanceScale, distance]);

    const isAncestorOfFocused = (currentId: string, focusedId: string) => {
        let curr = celestial.getObjectById(focusedId) as CelestialObject
        while (curr && curr.parent) {
            if (curr.parent === currentId) return true;
            curr = celestial.getObjectById(curr.parent) as CelestialObject
        }
        return false;
    };

    const virtualTimeRef = useRef(0)
    const lastElapsedTimeRef = useRef<number | null>(null)

    useFrame((state) => {
        if (!data) return
        const elapsedTime = state.clock.getElapsedTime()

        if (lastElapsedTimeRef.current === null) {
            lastElapsedTimeRef.current = elapsedTime
        }
        const deltaT = elapsedTime - lastElapsedTimeRef.current
        lastElapsedTimeRef.current = elapsedTime

        virtualTimeRef.current += deltaT * rotateSpeed

        const speed = ((virtualTimeRef.current % 60) / 60) * Math.PI * 2

        if (focusLandmark) {
            return;
        }

        if (data.rotate_duration && objectRef?.current?.rotation) {
            objectRef.current.rotation.y = (speed / data.rotate_duration) * speedScale
        }

        if (data.rotate_duration && data.cloud_texture && cloudRef?.current) {
            const cloudSpeed = ((virtualTimeRef.current % 50) / 50) * Math.PI * 2
            cloudRef.current.rotation.y = (cloudSpeed / data.rotate_duration) * speedScale
        }

        if (!data.orbit_duration) return

        const isParentOfFocused = focus ? isAncestorOfFocused(data.id, focus) : false;
        const isFocused = focus === data.id;

        const shouldPauseOrbit = pauseOrbitWhenFocus && (isFocused || isParentOfFocused);

        if (!shouldPauseOrbit) {
            if (longestDistance > distance) {
                const time = rotate + (speed / data.orbit_duration * speedScale);
                const a = (longestDistance + distance) / 2;
                const c = (longestDistance - distance) / 2;
                const b = Math.sqrt(a * a - c * c);

                const x = a * Math.cos(time) - c;
                const z = -b * Math.sin(time);

                orbitRef.current.position.set(x, 0, z);
            } else {
                orbitRef.current.rotation.y = rotate + (speed / data.orbit_duration * speedScale);
            }
        }
    })

    useFrame(({ camera }) => {
        if (!internalLabelRef.current) return

        const object = scene.getObjectByName(data.id)
        if (!object) return

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
            if (universe.defaultFocus) {
                const isChildren = ["satellite", "space_craft"].includes(data.type)
                const isOrbiting = data.orbit_duration
                return isChildren && isOrbiting
            } else {
                return data.type === "planet"
            }
        }

        if (!isSmallestObject()) return true
        if (isSmallestObject()) {
            if (focus === data.id) return true
            if (data.type === "space_craft") return false
            if (focus === data.parent) return true
            if (focusedObject?.parent === data.parent) return true
        }

        return false
    }, [universe.defaultFocus, data.type, data.orbit_duration, data.id, data.parent, focus, focusedObject?.parent])

    useLayoutEffect(() => {
        const effectiveFocus = focus || defaultFocus;
        if (!effectiveFocus) return setOcclude(undefined);

        if (effectiveFocus === data.id) return setOcclude(undefined)

        const object = scene.getObjectByName(effectiveFocus)
        if (!object) return setOcclude(undefined)

        const occlude = [{ current: object }]
        if (focusedObject?.parent === data.id) return setOcclude(occlude)

        if (focusedObject?.parent) {
            const parentObject = scene.getObjectByName(focusedObject.parent)
            if (parentObject) occlude.push({ current: parentObject })
        }

        setOcclude(occlude)
    }, [focus, scene, focusedObject, defaultFocus, data.type, data.id])

    return <group rotation={[0, 0, axis]}>
        <group rotation={[0, rotate, 0]}>
            <When condition={data.orbit_duration && showOrbitLine && orbitLineVisible}>
                <OrbitLine radius={distance} longestRadius={longestDistance > distance ? longestDistance : undefined} color={data.color} />
            </When>

            <group ref={orbitRef}>
                <group position={longestDistance > distance ? [0, 0, 0] : [distance, 0, 0]}>
                    <When condition={isLabelVisible}>
                        <Html
                            occlude={occlude}
                            zIndexRange={[data.type === "star" ? 2 : 1, 0]}
                        >
                            <button ref={labelRef || internalLabelRef} className="hover:text-primary absolute -translate-x-1/2 -translate-y-full -mt-1 py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold " onClick={onClick}>{t(`object.${data.id}.name`)}</button>
                        </Html>
                    </When>

                    {children}
                    {childrenComponent}
                </group>
            </group>
        </group>
    </group>
}


export default Object