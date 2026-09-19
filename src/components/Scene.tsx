/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useRef } from "react"
import { useSettingStore, useControlStore } from "@state"
import { useBounds } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"
import { useCelestial, useMobile } from "@function"
import { latLongToVector3 } from "@components/object/LandmarkMarker"
import type { Belt, CelestialObject, Planet } from "@types"

interface Props {
    children: React.ReactNode
    controlRef: React.RefObject<OrbitControlsImpl>
}

const ignoredFocus = ["sagittarius_a"]

const Scene = ({ children, controlRef }: Props) => {
    const lastTargetPos = useRef(new Vector3())
    const currentTargetPos = useRef(new Vector3())
    const deltaMove = useRef(new Vector3())
    const lastFocusedId = useRef<string | null>(null)
    const isZooming = useRef(false)
    const targetCamPos = useRef(new Vector3())
    const normalVec = useRef(new Vector3())
    const isLerpingLandmark = useRef(false)
    const isResettingCamera = useRef(false)
    const targetResetCamPos = useRef(new Vector3())
    const targetResetControlsTarget = useRef(new Vector3(0, 0, 0))

    const bound = useBounds()
    const isMobile = useMobile()

    const { sizeScale, pauseOrbitWhenFocus } = useSettingStore()
    const { focus, focusIndex, focusLandmark, resetControl, setControl } = useControlStore()

    const { scene, camera } = useThree()
    const celestial = useCelestial()
    const universe = celestial.getUniverse()

    useEffect(() => {
        if (focusLandmark) {
            isLerpingLandmark.current = true
        } else {
            isLerpingLandmark.current = false
        }
    }, [focusLandmark])

    useEffect(() => {
        setControl({ focusLandmark: "" })

        if (focus) {
            const object = celestial.getObjectById(focus) as CelestialObject | Belt
            resetControl(object)
            isResettingCamera.current = false
        } else if (lastFocusedId.current) {
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

    useEffect(() => {
        if (!focus) return;
        if (ignoredFocus.includes(focus)) return

        const object = scene.getObjectByName(focus)

        bound.refresh(object).fit()
    }, [bound, focus, scene, focusIndex])

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

            if (focusLandmark && isLerpingLandmark.current) {
                const focusedPlanet = celestial.getObjectById(focus) as Planet
                const targetLandmark = focusedPlanet?.landmarks?.find(l => l.id === focusLandmark)

                if (targetLandmark) {
                    const localPos = latLongToVector3(targetLandmark.latitude, targetLandmark.longitude, 1.0)
                    const landmarkWorldPos = localPos.applyMatrix4(object.matrixWorld)
                    normalVec.current.subVectors(landmarkWorldPos, currentTargetPos.current).normalize()

                    const planetRadius = (focusedPlanet.radius || 1000) / sizeScale
                    const targetDist = Math.max(planetRadius * 1.5, 0.002)

                    targetCamPos.current.copy(currentTargetPos.current).add(normalVec.current.multiplyScalar(targetDist))

                    const distSq = state.camera.position.distanceToSquared(targetCamPos.current)
                    if (distSq > 0.0001) {
                        state.camera.position.lerp(targetCamPos.current, 1)
                    } else {
                        state.camera.position.copy(targetCamPos.current)
                        isLerpingLandmark.current = false
                    }
                }
            }


            controlRef.current.target.copy(currentTargetPos.current)
            lastTargetPos.current.copy(currentTargetPos.current)
            controlRef.current.update()
        } else {
            if (isResettingCamera.current && controlRef.current) {
                state.camera.position.lerp(targetResetCamPos.current, 0.05)
                controlRef.current.target.lerp(targetResetControlsTarget.current, 0.05)
                controlRef.current.update()

                const distSqCam = state.camera.position.distanceToSquared(targetResetCamPos.current)
                const distSqTarget = controlRef.current.target.distanceToSquared(targetResetControlsTarget.current)

                if (distSqCam < 0.0001 && distSqTarget < 0.0001) {
                    state.camera.position.copy(targetResetCamPos.current)
                    controlRef.current.target.copy(targetResetControlsTarget.current)
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
    })

    useFrame(() => {
        if (controlRef.current && universe.id !== "milky_way") {
            const navigationPanel = document.getElementById("navigation-panel")
            const isMaxZoomOut = controlRef.current.getDistance() >= controlRef.current.maxDistance - 10;

            if (!navigationPanel) return
            navigationPanel.style.visibility = isMaxZoomOut ? "visible" : "hidden"
        }
    })

    return <group>
        {children}
    </group>
}

export default Scene
