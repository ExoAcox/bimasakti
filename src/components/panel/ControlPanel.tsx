/* eslint-disable react-hooks/set-state-in-effect */
import { useControlStore } from "@state"
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Case, Switch, Then, When } from "react-if";
import { useCelestial } from "@function";
import type { Planet } from "@types";


import { PiFastForwardFill, PiRewindFill, PiPlayFill, PiPauseFill } from "react-icons/pi";
import { ImCloud } from "react-icons/im";
import { GoCircle } from "react-icons/go";
import { TbSatelliteFilled } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";
import { MdBrightnessMedium, MdClose, MdRefresh } from "react-icons/md";
import { useTranslation } from "react-i18next";



interface Props {
    id: string
}

// Reusable style classes for consistent UI design
const SECTION_CLASS = "flex items-center gap-1.5";

const BUTTON_BASE_CLASS =
    "relative group/btn flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none select-none cursor-pointer disabled:opacity-50";

const TOGGLE_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "h-10 w-10 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 active:scale-95"
);

const ACTIVE_CYAN_CLASS = "bg-cyan-500/20 text-cyan-300 border-cyan-500/50  hover:bg-cyan-500/30";
const ACTIVE_SKY_CLASS = "bg-sky-500/20 text-sky-300 border-sky-500/50 hover:bg-sky-500/30";
const ACTIVE_PURPLE_CLASS = "bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30";

const NAV_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "h-10 w-10 border border-transparent text-slate-300 hover:text-white hover:bg-white/10 active:scale-90"
);

const PLAY_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "h-10 px-4 gap-2.5 border border-white/15 bg-white/5 hover:bg-white/15 text-white active:scale-95 shadow-md"
);

const PLAY_BTN_ACTIVE_CLASS = "border-cyan-500/40 bg-cyan-950/40 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.25)]";

const TOOLTIP_CLASS =
    "absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 whitespace-nowrap rounded-md bg-slate-900/90 border border-white/15 px-2.5 py-1 text-xs text-slate-200 shadow-xl backdrop-blur-md z-50";

const SPEED_ARRAY = [0.1, 0.5, 1, 1.5, 2, 3, 5]
const LayerPanel = ({ id }: Props) => {
    const { focusIndex, focusLandmark, landmarkVisible, rotateSpeed, cloudVisible, artificialSatelliteVisible, dayNightMode, axisTilt, setControl, resetControl } = useControlStore()
    const [lastRotateSpeed, setLastRotateSpeed] = useState(rotateSpeed)

    const [activePanel, setActivePanel] = useState("")

    const tiltDialRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)
    const { t } = useTranslation()

    const updateTiltFromEvent = useCallback((e: React.PointerEvent | PointerEvent) => {
        if (!tiltDialRef.current) return
        const rect = tiltDialRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        let deg = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90)
        if (deg > 180) deg -= 360
        setControl({ axisTilt: deg })
    }, [setControl])

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        updateTiltFromEvent(e)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            updateTiltFromEvent(e)
        }
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false
            try {
                e.currentTarget.releasePointerCapture(e.pointerId)
            } catch {
                // ignore if already released
            }
        }
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 5 : 1
        let nextTilt = axisTilt + (e.deltaY < 0 ? step : -step)
        if (nextTilt > 180) nextTilt -= 360
        if (nextTilt < -180) nextTilt += 360
        setControl({ axisTilt: nextTilt })
    }

    const data = useCelestial().getObjectById(id) as Planet

    useEffect(() => {
        if (rotateSpeed > 0) setLastRotateSpeed(rotateSpeed)
    }, [rotateSpeed])

    const handleRotatePlay = () => {
        setControl({ rotateSpeed: rotateSpeed === 0 ? (lastRotateSpeed > 0 ? lastRotateSpeed : 1) : 0, focusLandmark: "" })
    }

    const handleRotateNext = () => {
        const currentIndex = SPEED_ARRAY.indexOf(rotateSpeed)
        setControl({ rotateSpeed: SPEED_ARRAY[currentIndex + 1] })
    }

    const handleRotatePrev = () => {
        const currentIndex = SPEED_ARRAY.indexOf(rotateSpeed)
        setControl({ rotateSpeed: SPEED_ARRAY[currentIndex - 1] })
    }

    const handleCloud = () => {
        setControl({ cloudVisible: !cloudVisible })
    }

    const handleLandmark = () => {
        setControl({ landmarkVisible: !landmarkVisible })
    }

    const handleLeaveLandmark = () => {
        setControl({ focusLandmark: "", focusIndex: focusIndex + 1 })
    }

    const handleSatellite = () => {
        setControl({ artificialSatelliteVisible: !artificialSatelliteVisible })
    }

    const handleDayNight = () => {
        setControl({ dayNightMode: !dayNightMode })
    }

    const handleReset = () => {
        resetControl(data)
        setControl({ focusIndex: focusIndex + 1 })
    }

    const handleLeave = () => {
        setControl({ focus: "" })
    }

    if (!data) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40 bg-background backdrop-blur-md p-2 px-3 rounded-full border border-white/15 shadow-2xl shadow-cyan-950/40 hover:border-cyan-500/30 transition-all duration-300">

            <When condition={focusLandmark}>
                <div className="absolute flex items-center gap-2 -top-3 left-1/2 -translate-x-1/2 -translate-y-full bg-background border border-white/15 px-2.5 py-1 font-semibold text-sm text-white shadow-xl backdrop-blur-md rounded-md">
                    <span className="pointer-events-none">{t(`landmark.${focusLandmark}.name`)}</span>
                    <MdClose className="cursor-pointer text-red-400 size-4" onClick={handleLeaveLandmark} />
                </div>
            </When>


            <div className={SECTION_CLASS}>
                <When condition={data.landmarks?.length}>
                    <button
                        onClick={handleLandmark}
                        className={clsx(TOGGLE_BTN_CLASS, landmarkVisible && ACTIVE_CYAN_CLASS)}
                    >
                        <HiLocationMarker />
                        <span className={TOOLTIP_CLASS}>Landmarks</span>
                    </button>
                </When>

                <When condition={data.cloud_texture}>
                    <button
                        onClick={handleCloud}
                        className={clsx(TOGGLE_BTN_CLASS, cloudVisible && ACTIVE_SKY_CLASS)}
                    >
                        <ImCloud />
                        <span className={TOOLTIP_CLASS}>Clouds</span>
                    </button>
                </When>

                <When condition={data.artificial_satellites?.length}>
                    <button
                        onClick={handleSatellite}
                        className={clsx(TOGGLE_BTN_CLASS, artificialSatelliteVisible && ACTIVE_PURPLE_CLASS)}
                    >
                        <TbSatelliteFilled />
                        <span className={TOOLTIP_CLASS}>Satellites</span>
                    </button>
                </When>

                <When condition={data.id === "earth"}>
                    <button
                        onClick={handleDayNight}
                        className={clsx(TOGGLE_BTN_CLASS, dayNightMode && ACTIVE_CYAN_CLASS)}
                    >
                        <MdBrightnessMedium />
                        <span className={TOOLTIP_CLASS}>Day / Night Mode</span>
                    </button>

                </When>
            </div>

            <div className="h-6 w-px bg-divider my-auto" />

            <div>
                <button
                    onClick={() => setActivePanel(activePanel === "axis_tilt" ? "" : "axis_tilt")}
                    className={clsx(PLAY_BTN_CLASS)}
                >
                    <div className="relative">
                        <GoCircle />
                        <div style={{ rotate: axisTilt + "deg" }} className="bg-base w-px h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-sm text-white">{axisTilt}°</span>
                    <span className={TOOLTIP_CLASS}>Axis Tilt</span>
                </button>

                <When condition={activePanel === "axis_tilt"}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/90 backdrop-blur-xl p-2 border border-white/15 flex items-center gap-2">
                        <div
                            ref={tiltDialRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            onWheel={handleWheel}
                            className="py-14 px-18 relative select-none cursor-grab active:cursor-grabbing touch-none"
                        >
                            <div className="relative pointer-events-none" style={{
                                rotate: axisTilt + "deg"
                            }}>
                                <div className="size-48 rounded-full border-white/90 border-2"></div>
                                <div className="bg-white/90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 rounded w-1"></div>
                            </div>

                            <label className="absolute top-1 left-1/2 -translate-x-1/2 pl-1.5 pointer-events-none text-xs text-slate-300">0°</label>
                            <label className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-300">90°</label>
                            <label className="absolute bottom-1 left-1/2 -translate-x-1/2 pl-1.5 pointer-events-none text-xs text-slate-300">180°</label>
                            <label className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-300">-90°</label>
                        </div>
                    </div>
                </When>
            </div>

            {/* Rotation Controls Section */}
            <When condition={data.rotate_duration}>
                <div className="h-6 w-px bg-divider my-auto" />

                <div className={SECTION_CLASS}>
                    <button
                        onClick={handleRotatePrev}
                        className={NAV_BTN_CLASS}
                        disabled={rotateSpeed === SPEED_ARRAY[0] || rotateSpeed === 0}
                    >
                        <PiRewindFill />
                        <span className={TOOLTIP_CLASS}>Slower</span>
                    </button>

                    <button
                        onClick={handleRotatePlay}
                        className={clsx(PLAY_BTN_CLASS, rotateSpeed > 0 && PLAY_BTN_ACTIVE_CLASS)}
                    >
                        <span className="font-mono text-xs tracking-wider font-semibold">
                            {rotateSpeed}x
                        </span>
                        {rotateSpeed > 0 ? (
                            <PiPauseFill className=" text-red-300 shrink-0" />
                        ) : (
                            <PiPlayFill className=" text-base shrink-0" />
                        )}
                        <span className={TOOLTIP_CLASS}>{rotateSpeed > 0 ? "Pause" : "Rotate"}</span>
                    </button>

                    <button
                        onClick={handleRotateNext}
                        className={NAV_BTN_CLASS}
                        disabled={rotateSpeed === SPEED_ARRAY[SPEED_ARRAY.length - 1] || rotateSpeed === 0}
                    >
                        <PiFastForwardFill />
                        <span className={TOOLTIP_CLASS}>Faster</span>
                    </button>
                </div>

                <div className="h-6 w-px bg-divider my-auto" />
            </When>

            <div className={SECTION_CLASS}>
                <button onClick={handleReset} className={clsx(TOGGLE_BTN_CLASS, "hover:bg-amber-400/50")}>
                    <MdRefresh />
                    <span className={TOOLTIP_CLASS}>Reset</span>
                </button>
                <button onClick={handleLeave} className={clsx(TOGGLE_BTN_CLASS, "hover:bg-red-500/50")}>
                    <MdClose />
                    <span className={TOOLTIP_CLASS}>Leave</span>
                </button>
            </div>

        </div>
    )
}

export default LayerPanel