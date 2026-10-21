/* eslint-disable react-hooks/set-state-in-effect */
import { useMemo, useRef } from "react"
import { Group, MathUtils, Mesh, Vector3 } from "three"
import { Mode, type CelestialObject, type Planet as PlanetType } from "@types"
import { useFrame, useThree } from "@react-three/fiber"
import { calculateSatelliteDistance, getInitialRotation, useCelestial } from "@function";
import { Html } from "@react-three/drei";
import { useSettingStore, useControlStore } from "@state";
import { useTranslation } from "react-i18next";
import { When } from "react-if"
import { OrbitLine } from "@components/object"
import clsx from "clsx";

interface Props {
    data: CelestialObject,
    onClick: () => void,
    children?: React.ReactNode
    objectRef?: React.RefObject<Mesh | null>,
    cloudRef?: React.RefObject<Mesh | null>,
    labelRef?: React.RefObject<HTMLButtonElement>
    childrenComponent?: React.ReactNode
    visible?: boolean
}

// Reusable vectors for zero-alloc fast occlusion math
const vCamToLabel = new Vector3()
const vCamToPlanet = new Vector3()
const planetPos = new Vector3()
const labelPos = new Vector3()
const closestPoint = new Vector3()

const Object = ({ data, children, childrenComponent, onClick, objectRef, cloudRef, labelRef, visible = true }: Props) => {
    const orbitRef = useRef<Group>(null!)
    const internalLabelRef = useRef<HTMLButtonElement>(null!)

    const { scene } = useThree()

    const { sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus } = useSettingStore()
    const { mode, focus, tidalLock, rotateSpeed } = useControlStore()
    const { t } = useTranslation()

    const celestial = useCelestial()
    const universe = celestial.getUniverse()
    const focusedObject = celestial.getObjectById(focus) as CelestialObject | undefined
    const defaultFocus = universe.defaultFocus
    const isFocused = focus === data.id;
    const isSpacecraft = data.type === "spacecraft-orbiter" && data.distance < 10000

    const axis = ignoreAxis ? 0 : MathUtils.degToRad(data?.axis ?? 0)
    // const scale = data.radius / sizeScale
    const rotate = useMemo(() => getInitialRotation(), [])
    const distance = useMemo(() => {
        if (!data.distance) return 0
        if (["satellite"].includes(data.type)) {
            const parentPlanet = celestial.getObjectById(data.parent) as PlanetType
            if (!parentPlanet) return 0
            const index = [...parentPlanet.satellites ?? []].findIndex((satellite) => satellite.id === data.id)
            return calculateSatelliteDistance(data.distance, distanceScale, parentPlanet.radius / sizeScale, index)
        } else {
            return data.distance / distanceScale
        }
    }, [celestial, data.distance, data.id, data.parent, data.type, distanceScale, sizeScale])

    const isOrbitLineVisible = useMemo(() => {
        const isSpacecraft = data.type === "spacecraft-orbiter" ? (isFocused || data.parent === focus) : true;
        return data.orbit_duration && showOrbitLine && visible && isSpacecraft
    }, [data.type, data.parent, data.orbit_duration, isFocused, focus, showOrbitLine, visible])

    const longestDistance = useMemo(() => {
        if (!("longest_distance" in data) || !data.longest_distance) return distance;
        return data.longest_distance / distanceScale;
    }, [data, distanceScale, distance]);

    const isAncestorFocused = (currentId: string, focusedId: string) => {
        let curr = celestial.getObjectById(focusedId) as CelestialObject
        while (curr && curr.parent) {
            if (curr.parent === currentId) return true;
            curr = celestial.getObjectById(curr.parent) as CelestialObject
        }
        return false;
    };

    const virtualTimeRef = useRef(0)
    const lastElapsedTimeRef = useRef<number | null>(null)
    const rotationRef = useRef<number | null>(null)
    const cloudRotationRef = useRef<number>(0)

    if (data.id === "alpha_centauri_a") {
        console.log(isOrbitLineVisible)
    }

    useFrame((state) => {
        if (!data) return
        const elapsedTime = state.clock.getElapsedTime()

        if (lastElapsedTimeRef.current === null) {
            lastElapsedTimeRef.current = elapsedTime
        }
        const deltaT = elapsedTime - lastElapsedTimeRef.current
        lastElapsedTimeRef.current = elapsedTime

        const effectiveRotateSpeed = isFocused ? (rotateSpeed) : 1
        virtualTimeRef.current += deltaT * effectiveRotateSpeed

        const speed = ((virtualTimeRef.current % 60) / 60) * Math.PI * 2
        const deltaSpeed = ((deltaT * effectiveRotateSpeed) / 60) * Math.PI * 2

        if (data.rotate_duration && objectRef?.current?.rotation) {
            const isTidalLocked = data.orbit_duration === data.rotate_duration && tidalLock
            if (isTidalLocked) {
                if ((data as PlanetType).model) {
                    objectRef.current.rotation.set(0, 0, 0)
                } else {
                    const [x, y, z] = ((data as PlanetType)?.rotation ?? [0, 0, 0])
                    objectRef.current.rotation.y = MathUtils.degToRad(y)
                    rotationRef.current = MathUtils.degToRad(y)

                    if (x) objectRef.current.rotation.z = MathUtils.degToRad(x)
                    if (z) objectRef.current.rotation.z = MathUtils.degToRad(z)
                }
            } else {
                if (rotationRef.current === null) {
                    rotationRef.current = (speed / data.rotate_duration) * speedScale
                } else {
                    const deltaRotation = (deltaSpeed / data.rotate_duration) * speedScale
                    rotationRef.current += deltaRotation
                }
                objectRef.current.rotation.y = rotationRef.current
            }
        }

        if (data.rotate_duration && data.cloud_texture && cloudRef?.current) {
            const cloudDeltaSpeed = ((deltaT * (tidalLock && isFocused ? 1 : effectiveRotateSpeed)) / 50) * Math.PI * 2
            const cloudDeltaRotation = (cloudDeltaSpeed / data.rotate_duration) * speedScale
            cloudRotationRef.current += cloudDeltaRotation
            cloudRef.current.rotation.y = cloudRotationRef.current
        }

        if (!data.orbit_duration || mode !== Mode.Object) return

        const isParentFocused = focus ? isAncestorFocused(data.id, focus) : false;
        const shouldPauseOrbit = pauseOrbitWhenFocus && (isFocused || isParentFocused || data.type === "spacecraft-orbiter");

        if (!shouldPauseOrbit) {
            if (longestDistance > distance) {
                const time = (speed / data.orbit_duration * speedScale);
                const a = (longestDistance + distance) / 2;
                const c = (longestDistance - distance) / 2;
                const b = Math.sqrt(a * a - c * c);

                const x = a * Math.cos(time) - c;
                const z = -b * Math.sin(time);

                orbitRef.current.position.set(x, 0, z);
            } else {
                orbitRef.current.rotation.y = (speed / data.orbit_duration * speedScale);
            }
        }
    })

    // Occlude alternative
    useFrame(({ camera }) => {
        if (!internalLabelRef.current) return

        const object = scene.getObjectByName(data.id)
        if (!object) return

        const distance = celestial.getCameraDistance(camera, object)
        const scale = Math.max(300, data.radius) / sizeScale * 200

        let isVisible = isSpacecraft ? true : (distance > scale)

        if (isSpacecraft) {
            if (distance > scale) isVisible = false
        }

        if (isVisible) {
            const checkOcclusion = (occluderId: string) => {
                const targetObj = scene.getObjectByName(occluderId)
                if (!targetObj) return false

                targetObj.getWorldPosition(planetPos)
                object.getWorldPosition(labelPos)

                const distCamToPlanet = camera.position.distanceTo(planetPos)
                const distCamToLabel = camera.position.distanceTo(labelPos)
                const targetRadius = targetObj.scale.x

                if (distCamToPlanet < distCamToLabel) {
                    vCamToLabel.subVectors(labelPos, camera.position)
                    vCamToPlanet.subVectors(planetPos, camera.position)

                    const lenSq = vCamToLabel.lengthSq()
                    if (lenSq > 0) {
                        const projLen = vCamToPlanet.dot(vCamToLabel) / lenSq
                        if (projLen > 0 && projLen < 1) {
                            closestPoint.copy(camera.position).addScaledVector(vCamToLabel, projLen)
                            const distToCenter = closestPoint.distanceTo(planetPos)

                            if (distToCenter < targetRadius * 1.1) {
                                return true
                            }
                        }
                    }
                }

                return false
            }

            if (defaultFocus && defaultFocus !== data.id && checkOcclusion(defaultFocus)) {
                isVisible = false
            } else if (focus && focus !== data.id && focus !== defaultFocus && checkOcclusion(focus)) {
                isVisible = false
            } else if (focusedObject?.parent && focusedObject.parent !== data.id && focusedObject.parent !== defaultFocus && focusedObject.parent !== focus && checkOcclusion(focusedObject.parent)) {
                isVisible = false
            }
        }

        internalLabelRef.current.style.display = isVisible ? "flex" : "none"

        if (data.type !== "spacecraft-orbiter") {
            internalLabelRef.current.style.background = focus === data.id ? "rgba(0,0,0,0.75)" : "transparent"
        }

        if (internalLabelRef.current.parentElement?.parentElement) {
            internalLabelRef.current.parentElement.parentElement.style.zIndex = focus === data.id ? "5" : "1"
        }
    })


    const isLabelVisible = (() => {
        if (!visible) return false

        const isSmallestObject = () => {
            if (universe.defaultFocus) {
                const isChildren = ["satellite", "spacecraft-orbiter"].includes(data.type)
                return isChildren
            } else {
                return data.type === "planet"
            }
        }

        if (!isSmallestObject()) return true
        if (isSmallestObject()) {
            if (focus === data.id) return true
            if (focus === data.parent) return true
            if (focusedObject?.parent === data.parent && data.parent !== defaultFocus) return true
        }

        return false
    })()


    const labelClass = isSpacecraft
        ? "hover:text-accent flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150 border whitespace-nowrap shadow-md bg-neutral-950/90 text-sky-200 border-sky-500/30 hover:bg-neutral-900 hover:border-sky-400 hover:text-white"
        : clsx("hover:text-accent absolute -translate-y-2/7 -translate-x-1/2 flex flex-col px-1.5 py-1 items-center whitespace-nowrap rounded text-xs font-semibold")

    return <group rotation={[0, 0, axis]}>
        <group rotation={[0, rotate, 0]}>
            <When condition={isOrbitLineVisible}>
                <OrbitLine radius={distance} longestRadius={longestDistance > distance ? longestDistance : undefined} color={data.color} />
            </When>

            <group ref={orbitRef}>
                <group position={longestDistance > distance ? [0, 0, 0] : [distance, 0, 0]}>
                    <When condition={isLabelVisible}>
                        <Html
                            center
                            zIndexRange={[data.type === "star" ? 3 : 2, 0]}
                        >
                            <button
                                ref={labelRef || internalLabelRef}
                                className={labelClass}
                                type="button"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick();
                                }}>
                                <When condition={focusedObject?.parent !== data.id}>
                                    <div className={clsx(isSpacecraft ? "size-3" : "size-4")}>
                                        <img alt="" src={`/icons/${data.icon}`} />
                                    </div>
                                </When>

                                {t(`object.${data.id}.name`)}
                            </button>
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