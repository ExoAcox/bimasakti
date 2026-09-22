import { useMemo, useRef, useState } from "react"
import { Group, MathUtils, Matrix4, Vector3 } from "three"
import { Html } from "@react-three/drei"
import { useTranslation } from "react-i18next"
import type { Nation } from "@types"
import clsx from "clsx"
import { useFrame } from "@react-three/fiber"
import { latLngToVector3 } from "@function"

interface Props {
    nation: Nation
    radius: number
    visible?: boolean
    lonOffset?: number
}

const tempMatrix = new Matrix4()
const tempWorldPos = new Vector3()
const tempCamPos = new Vector3()

const NationMarker = ({ nation, visible = true, lonOffset = 0 }: Props) => {
    const { t } = useTranslation()
    const groupRef = useRef<Group>(null!)
    const buttonRef = useRef<HTMLDivElement>(null!)



    const position = useMemo(() => {
        return latLngToVector3(nation.latitude, nation.longitude, lonOffset)
    }, [nation.latitude, nation.longitude, lonOffset])

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
        const isZoomedIn = dist < parentScale * 3.0

        buttonRef.current.style.visibility = (isFacingCamera && isZoomedIn) ? "visible" : "hidden"
    })

    if (!visible) return null

    return (
        <group ref={groupRef} position={position}>
            <Html
                zIndexRange={[1, 0]}
            >
                <div
                    ref={buttonRef}
                    className={clsx(
                        "flex items-center  gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150 border whitespace-nowrap shadow-md select-none",
                        "bg-neutral-950/90 text-amber-200 border-amber-500/30"
                    )}
                >
                    <div className="w-3">
                        <img
                            className="w-3 h-auto shrink-0"
                            src={`https://flags.restcountries.com/v5/w160/${nation.id.toLowerCase()}.jpg`} alt={nation.id}
                        />
                    </div>
                    <span>{t(`nation.${nation.id}.name`)}</span>
                </div>
            </Html>
        </group>
    )
}

export default NationMarker
