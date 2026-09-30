import { useEffect, useMemo, useRef } from "react"
import { Group, Matrix4, Mesh, Raycaster, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useTranslation } from "react-i18next"
import { useControlStore } from "@state"
import type { Landmark } from "@types"
import clsx from "clsx"
import { latLngToVector3 } from "@function"
import { Else, If, Then } from "react-if"

interface Props {
    landmark: Landmark
    radius: number
    visible?: boolean
    lonOffset?: number
    custom?: boolean
}

const tempMatrix = new Matrix4()
const tempCamPos = new Vector3()
const tempWorldPos = new Vector3()
const tempDir = new Vector3()
const tempWorldOrigin = new Vector3()
const tempWorldTarget = new Vector3()
const tempWorldDir = new Vector3()
const tempLocalPos = new Vector3()

const LandmarkMarker = ({ landmark, visible = true, lonOffset = 0, custom = false }: Props) => {
    const { t } = useTranslation()
    const { focusLandmark, setControl } = useControlStore()
    const groupRef = useRef<Group>(null!)
    const buttonRef = useRef<HTMLButtonElement>(null!)

    const initialPosition = useMemo(() => {
        return latLngToVector3(landmark.latitude, landmark.longitude, lonOffset)
    }, [landmark.latitude, landmark.longitude, lonOffset])

    const positionRef = useRef<Vector3>(initialPosition.clone())
    const snappedRef = useRef(false)
    const raycaster = useMemo(() => new Raycaster(), [])

    useEffect(() => {
        const initial = latLngToVector3(landmark.latitude, landmark.longitude, lonOffset)
        positionRef.current.copy(initial)
        snappedRef.current = false
    }, [landmark.latitude, landmark.longitude, lonOffset])

    const isSelected = focusLandmark === landmark.id

    useFrame((state) => {
        if (!groupRef.current || !buttonRef.current) return

        const parent = groupRef.current.parent
        if (!parent) return

        // Raycast to snap position to actual 3D mesh surface if custom model and not yet snapped
        if (custom && !snappedRef.current) {
            parent.updateMatrixWorld(true)

            tempDir.copy(initialPosition).normalize()
            tempWorldOrigin.copy(tempDir).multiplyScalar(3.0).applyMatrix4(parent.matrixWorld)
            tempWorldTarget.set(0, 0, 0).applyMatrix4(parent.matrixWorld)
            tempWorldDir.copy(tempWorldTarget).sub(tempWorldOrigin).normalize()

            raycaster.set(tempWorldOrigin, tempWorldDir)
            const intersects = raycaster.intersectObject(parent, true)

            const meshHit = intersects.find((hit) => {
                const obj = hit.object as Mesh
                if (!obj.isMesh || !obj.geometry) return false
                // Skip fallback SphereGeometry if a detailed custom geometry (like PLY model) exists in the hit list
                if (
                    obj.geometry.type === "SphereGeometry" &&
                    intersects.some((h) => {
                        const hObj = h.object as Mesh
                        return hObj.isMesh && hObj.geometry && hObj.geometry.type !== "SphereGeometry"
                    })
                ) {
                    return false
                }
                return true
            })

            if (meshHit) {
                const hitObj = meshHit.object as Mesh
                tempMatrix.copy(parent.matrixWorld).invert()
                tempLocalPos.copy(meshHit.point).applyMatrix4(tempMatrix)

                // Offset slightly outward along surface direction (1.5% above surface)
                const surfaceDist = tempLocalPos.length()
                tempLocalPos.normalize().multiplyScalar(surfaceDist + 0.015)

                positionRef.current.copy(tempLocalPos)
                groupRef.current.position.copy(tempLocalPos)

                const isCustomMesh = hitObj.geometry.type !== "SphereGeometry"
                if (isCustomMesh) {
                    snappedRef.current = true
                }
            }
        }

        tempMatrix.copy(parent.matrixWorld).invert()
        tempCamPos.copy(state.camera.position).applyMatrix4(tempMatrix)

        const currentPos = positionRef.current
        const dot = currentPos.dot(tempCamPos)
        // Dot product horizon occlusion check for arbitrary radius surface point
        const isFacingCamera = dot > currentPos.lengthSq() * 0.95

        // Distance check: only display landmark labels when camera is zoomed in close to planet
        const worldPos = groupRef.current.getWorldPosition(tempWorldPos)
        const dist = state.camera.position.distanceTo(worldPos)
        const parentScale = parent.scale.x
        const isZoomedIn = dist < parentScale * 4.0

        buttonRef.current.style.visibility = (isFacingCamera && isZoomedIn) ? "visible" : "hidden"
    })

    if (!visible) return null

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isSelected) {
            setControl({ focusLandmark: "" })
        } else {
            setControl({ focus: landmark.parent, focusLandmark: landmark.id })
        }
    }

    return (
        <group ref={groupRef} position={initialPosition}>
            <Html
                zIndexRange={[isSelected ? 2 : 1, 0]}
                style={{
                    pointerEvents: "auto",
                    // transform: "translate(-50%, -100%)",
                }}
            >
                <div className="landmark-label">
                    <button
                        ref={buttonRef}
                        onClick={handleClick}
                        className={clsx(
                            "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150 border whitespace-nowrap shadow-md cursor-pointer select-none",
                            isSelected
                                ? "bg-sky-600 text-white border-sky-300 scale-105 shadow-sky-500/40"
                                : "bg-neutral-950/90 text-amber-200 border-amber-500/30 hover:bg-neutral-900 hover:border-amber-400 hover:text-white",
                            landmark.reverse ? "-translate-x-full flex-row-reverse" : ""
                        )}
                    >
                        <If condition={!!landmark.object}>
                            <Then>
                                <div className="size-2.5">
                                    <img
                                        alt={landmark.object?.name}
                                        src={`/icons/${landmark.object?.icon}`}
                                        className="size-2.5 object-contain"
                                        style={{ filter: "brightness(0) saturate(100%) invert(83%) sepia(67%) saturate(1800%) hue-rotate(345deg)" }}
                                    />
                                </div>
                            </Then>
                            <Else>
                                <span className="inline-block size-1.5 rounded-full bg-amber-400 shrink-0" />
                            </Else>
                        </If>

                        <span>{t(`landmark.${landmark.id}.name`, { defaultValue: landmark.id })}</span>
                    </button>
                </div>
            </Html>
        </group>
    )
}

export default LandmarkMarker
