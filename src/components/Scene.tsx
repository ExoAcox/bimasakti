/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useSettingStore, useControlStore, defaultControl } from "@state"
import { OrbitControls, useBounds } from "@react-three/drei"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"
import { useCelestial, useMobile, useVariant } from "@function"
import { latLngToVector3 } from "@function"
import { Mode, type CelestialObject, type Planet, type Universe } from "@types"

interface Props {
    data: Universe
}

const ignoredFocus = ["sagittarius_a"]

const Scene = ({ data }: Props) => {
    const controlRef = useRef<OrbitControlsType>(null!)
    const lastTargetPos = useRef(new Vector3())
    const currentTargetPos = useRef(new Vector3())
    const deltaMove = useRef(new Vector3())
    const lastFocusedId = useRef<string | null>(null)
    const isZooming = useRef(false)
    const targetCamPos = useRef(new Vector3())
    const normalVec = useRef(new Vector3())
    const targetResetCamPos = useRef(new Vector3())
    const targetResetControlsTarget = useRef(new Vector3(0, 0, 0))
    const isResettingCamera = useRef(false)
    const targetZoomDistance = useRef<number | null>(null)
    const zoomOffsetVec = useRef(new Vector3())

    const bound = useBounds()
    const isMobile = useMobile()

    const { sizeScale, pauseOrbitWhenFocus } = useSettingStore()
    const { mode, focus, focusIndex, focusLandmark, resetControl, setControl } = useControlStore()
    const [lastVariant, setLastVariant] = useState<{ radius: number, distance: number } | undefined>()


    const { scene, camera } = useThree()
    const celestial = useCelestial()
    const universe = celestial.getUniverse()

    const focusData = focus ? (celestial.getObjectById(focus) as Planet) : undefined
    const variantData = useVariant(focusData as Planet)

    useEffect(() => {
        setControl(defaultControl)
    }, [universe])

    const minDistance = useMemo(() => {
        const objectId = focus || universe.defaultFocus
        if (!objectId || mode !== Mode.Object) return universe.minDistance

        const object = celestial.getObjectById(objectId) as CelestialObject
        if (!object?.radius) return universe.minDistance

        return object.radius / sizeScale * 1.5
    }, [focus, mode, universe, sizeScale])

    // Focus to default position
    useLayoutEffect(() => {
        if (controlRef.current) {
            const position = (isMobile ? universe.mobile?.cameraPosition : universe.cameraPosition) || universe.cameraPosition
            controlRef.current.target.set(0, 0, 0);

            if (Array.isArray(position)) {
                camera.position.set(position[0], position[1], position[2]);
            } else if (position instanceof Vector3) {
                camera.position.copy(position);
            }
            controlRef.current.update();
        }
    }, [universe, controlRef, camera.position, isMobile])

    // Reset default position
    useEffect(() => {
        if (focus) {
            const object = celestial.getObjectById(focus)
            resetControl(object)

            isResettingCamera.current = false
        } else if (lastFocusedId.current) {
            setControl({ focusLandmark: "" })

            const position = ((isMobile ? universe.mobile?.cameraPosition : universe.cameraPosition) || universe.cameraPosition)
            if (Array.isArray(position)) {
                targetResetCamPos.current.set(position[0], position[1], position[2]);
            } else if (position instanceof Vector3) {
                targetResetCamPos.current.copy(position);
            }

            targetResetControlsTarget.current.set(0, 0, 0);
            isResettingCamera.current = true;
        }
    }, [focus])

    // Focus to object
    useEffect(() => {
        if (!focus) return;
        if (ignoredFocus.includes(focus)) return

        const object = scene.getObjectByName(focus)
        bound.refresh(object).fit()
    }, [bound, focus, scene, focusIndex])

    // Refocus if variant changed
    useEffect(() => {
        if (focus && focusData && variantData) {
            if (lastVariant?.radius !== variantData.radius || lastVariant?.distance !== variantData.distance) {
                setLastVariant({ radius: variantData.radius, distance: variantData.distance })
                const object = scene.getObjectByName(focus)
                bound.refresh(object).fit()
            }
        } else {
            setLastVariant(undefined)
        }
    }, [bound, focus, focusData, variantData, scene])

    // Focus to landmark
    useEffect(() => {
        if (!focusLandmark) return setControl({ focusIndex: focusIndex + 1 })

        setControl({
            landmarkVisible: true,
            nationVisible: false,
            rotateSpeed: 0,
            cloudVisible: false
        })

        const object = scene.getObjectByName(focus)
        const planet = celestial.getObjectById(focus) as Planet
        const landmark = celestial.getLandmark(focusLandmark)
        if (!object || !planet || !landmark) return

        const localPos = latLngToVector3(landmark.latitude, landmark.longitude, 1.0)
        const landmarkWorldPos = localPos.applyMatrix4(object.matrixWorld)
        normalVec.current.subVectors(landmarkWorldPos, currentTargetPos.current).normalize()

        const planetRadius = (planet.radius || 1000) / sizeScale
        const targetDist = Math.max(planetRadius * 1.5, 0.002)

        targetCamPos.current.copy(currentTargetPos.current).add(normalVec.current.multiplyScalar(targetDist))
        camera.position.copy(targetCamPos.current)
    }, [focusLandmark])

    useFrame((state) => {
        if (focus) {
            isResettingCamera.current = false
            const object = scene.getObjectByName(focus)
            if (!object) return

            object.updateMatrixWorld(true)
            object.getWorldPosition(currentTargetPos.current)

            if (lastFocusedId.current !== focus) {
                lastFocusedId.current = focus
                isZooming.current = true
                lastTargetPos.current.copy(currentTargetPos.current)
            } else {
                deltaMove.current.subVectors(currentTargetPos.current, lastTargetPos.current)
                if (!pauseOrbitWhenFocus) {
                    state.camera.position.add(deltaMove.current)
                }
            }

            // if (focusLandmark && isLerpingLandmark.current) {
            //     const focusedPlanet = celestial.getObjectById(focus) as Planet
            //     const targetLandmark = focusedPlanet?.landmarks?.find(l => l.id === focusLandmark)

            //     if (targetLandmark) {
            //         const localPos = latLongToVector3(targetLandmark.latitude, targetLandmark.longitude, 1.0)
            //         const landmarkWorldPos = localPos.applyMatrix4(object.matrixWorld)
            //         normalVec.current.subVectors(landmarkWorldPos, currentTargetPos.current).normalize()

            //         const planetRadius = (focusedPlanet.radius || 1000) / sizeScale
            //         const targetDist = Math.max(planetRadius * 1.5, 0.002)

            //         targetCamPos.current.copy(currentTargetPos.current).add(normalVec.current.multiplyScalar(targetDist))

            //         const distSq = state.camera.position.distanceToSquared(targetCamPos.current)
            //         if (distSq > 0.0001) {
            //             state.camera.position.lerp(targetCamPos.current, 1)
            //         } else {
            //             state.camera.position.copy(targetCamPos.current)
            //             isLerpingLandmark.current = false
            //         }
            //     }
            // }


            controlRef.current.target.copy(currentTargetPos.current)
            lastTargetPos.current.copy(currentTargetPos.current)
            controlRef.current.update()
        } else {
            if (isResettingCamera.current && controlRef.current) {
                state.camera.position.lerp(targetResetCamPos.current, 0.05)
                controlRef.current.target.lerp(targetResetControlsTarget.current, 0.05)
                controlRef.current.enabled = false
                controlRef.current.update()

                const distSqCam = state.camera.position.distanceToSquared(targetResetCamPos.current)
                const distSqTarget = controlRef.current.target.distanceToSquared(targetResetControlsTarget.current)

                if (distSqCam < 10 && distSqTarget < 10) {
                    state.camera.position.copy(targetResetCamPos.current)
                    controlRef.current.target.copy(targetResetControlsTarget.current)
                    controlRef.current.enabled = true
                    controlRef.current.update()

                    isResettingCamera.current = false
                    lastFocusedId.current = null
                    isZooming.current = false
                }
            } else {
                lastFocusedId.current = null
                isZooming.current = false
            }
        }

        if (targetZoomDistance.current !== null && controlRef.current) {
            const currentDist = controlRef.current.getDistance()
            const diff = targetZoomDistance.current - currentDist
            if (Math.abs(diff) > 0.001) {
                const newDist = currentDist + diff * 0.25
                zoomOffsetVec.current.subVectors(state.camera.position, controlRef.current.target)
                if (zoomOffsetVec.current.lengthSq() < 1e-8) {
                    zoomOffsetVec.current.set(0, 0, newDist)
                } else {
                    zoomOffsetVec.current.setLength(newDist)
                }
                state.camera.position.copy(controlRef.current.target).add(zoomOffsetVec.current)
                controlRef.current.update()
            } else {
                targetZoomDistance.current = null
            }
        }
    })

    useEffect(() => {
        const handleSetZoom = (e: Event) => {
            const customEvent = e as CustomEvent<{ value: number }>
            if (!controlRef.current) return
            const t = Math.max(0, Math.min(1, customEvent.detail.value))
            const minD = Math.max(0.0001, controlRef.current.minDistance)
            const maxD = Math.max(minD * 1.5, controlRef.current.maxDistance)

            const logMin = Math.log(minD)
            const logMax = Math.log(maxD)
            targetZoomDistance.current = Math.exp(logMax - t * (logMax - logMin))
        }

        const controls = controlRef.current
        const handleControlsStart = () => {
            targetZoomDistance.current = null
        }

        window.addEventListener("bimasakti:set-zoom", handleSetZoom)
        controls?.addEventListener("start", handleControlsStart)

        return () => {
            window.removeEventListener("bimasakti:set-zoom", handleSetZoom)
            controls?.removeEventListener("start", handleControlsStart)
        }
    }, [])

    useFrame(() => {
        if (controlRef.current && universe.id !== "milky_way") {
            const navigationPanel = document.getElementById("navigation-panel")
            const isMaxZoomOut = controlRef.current.getDistance() >= controlRef.current.maxDistance - 10;

            if (navigationPanel) {
                navigationPanel.style.visibility = isMaxZoomOut ? "visible" : "hidden"
            }

            const zoomSlider = document.getElementById("sidebar-zoom-slider") as HTMLInputElement | null
            if (zoomSlider && document.activeElement !== zoomSlider && targetZoomDistance.current === null) {
                const currentDist = controlRef.current.getDistance()
                const minD = Math.max(0.0001, controlRef.current.minDistance)
                const maxD = Math.max(minD * 1.5, controlRef.current.maxDistance)
                const logMin = Math.log(minD)
                const logMax = Math.log(maxD)
                const span = logMax - logMin
                if (span > 1e-4) {
                    const currentLog = Math.log(Math.max(minD, Math.min(maxD, currentDist)))
                    const t = (logMax - currentLog) / span
                    const val = Math.round(Math.max(0, Math.min(1, t)) * 100)
                    if (Number(zoomSlider.value) !== val) {
                        zoomSlider.value = String(val)
                    }
                }
            }
        }
    })

    return <OrbitControls
        makeDefault
        enableDamping
        zoomSpeed={3}
        enablePan={false}
        ref={controlRef}
        minDistance={minDistance}
        maxDistance={data.maxDistance}
    />

}

export default Scene
