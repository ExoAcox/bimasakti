import { useMemo, useRef } from "react"
import { Group, Matrix4, MathUtils, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useTranslation } from "react-i18next"
import { useControlStore } from "@state"
import type { Landmark } from "@types"
import clsx from "clsx"
import { useCelestial } from "@function"

interface Props {
    landmark: Landmark
    radius: number
    visible?: boolean
    lonOffset?: number
}

export const latLongToVector3 = (
    lat: number,
    lon: number,
    lonOffset: number = 0
): Vector3 => {
    const latRad = MathUtils.degToRad(lat)
    const lonRad = MathUtils.degToRad(lon + lonOffset)

    const y = 1.01 * Math.sin(latRad)
    const horizRadius = 1.01 * Math.cos(latRad)

    // Three.js SphereGeometry equirectangular UV texture alignment:
    // lon = 0° (Prime Meridian) -> +X
    // lon = +90° E (Asia / Himalayas) -> -Z
    // lon = -90° W (Americas / Mexico) -> +Z
    const x = horizRadius * Math.cos(lonRad)
    const z = -horizRadius * Math.sin(lonRad)

    return new Vector3(x, y, z)
}

const tempMatrix = new Matrix4()
const tempCamPos = new Vector3()
const tempWorldPos = new Vector3()

const LandmarkMarker = ({ landmark, visible = true, lonOffset = 0 }: Props) => {
    const { t } = useTranslation()
    const { focusLandmark, setControl } = useControlStore()
    const groupRef = useRef<Group>(null!)
    const buttonRef = useRef<HTMLButtonElement>(null!)

    const position = useMemo(() => {
        return latLongToVector3(landmark.latitude, landmark.longitude, lonOffset)
    }, [landmark.latitude, landmark.longitude, lonOffset])

    const isSelected = focusLandmark === landmark.id

    useFrame((state) => {
        if (!groupRef.current || !buttonRef.current) return

        const parent = groupRef.current.parent
        if (parent) {
            tempMatrix.copy(parent.matrixWorld).invert()
            tempCamPos.copy(state.camera.position).applyMatrix4(tempMatrix)
        } else {
            tempCamPos.copy(state.camera.position)
        }

        // Fast mathematical dot-product occlusion check on sphere surface (front hemisphere)
        const dot = position.dot(tempCamPos)
        const isFacingCamera = dot > 1

        // Distance check: only display landmark labels when camera is zoomed in close to planet
        const worldPos = groupRef.current.getWorldPosition(tempWorldPos)
        const dist = state.camera.position.distanceTo(worldPos)
        const parentScale = parent ? parent.scale.x : 1
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
        <group ref={groupRef} position={position}>
            <Html
                zIndexRange={[1, 0]}
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
                            "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all duration-150 border whitespace-nowrap shadow-md cursor-pointer select-none",
                            isSelected
                                ? "bg-sky-600 text-white border-sky-300 scale-105 shadow-sky-500/40"
                                : "bg-neutral-950/90 text-amber-200 border-amber-500/30 hover:bg-neutral-900 hover:border-amber-400 hover:text-white"
                        )}
                    >
                        <span className="inline-block size-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{t(`landmark.${landmark.id}.name`, { defaultValue: landmark.id })}</span>
                    </button>
                </div>
            </Html>
        </group>
    )
}

export default LandmarkMarker
