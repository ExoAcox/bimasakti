/* eslint-disable react-hooks/set-state-in-effect */
import { useControlStore } from "@state"
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { timelineFormat, useCelestial, useMobile, useVariant } from "@function";
import { Mode, type Planet, type SpaceCraft } from "@types";


import { PiFastForwardFill, PiRewindFill, PiPlayFill, PiPauseFill } from "react-icons/pi";
import { ImCloud } from "react-icons/im";
import { AiFillEye } from "react-icons/ai";
import { TbSatelliteFilled } from "react-icons/tb";
import { HiLocationMarker } from "react-icons/hi";
import { CgTerrain } from "react-icons/cg";
import { MdBrightnessMedium, MdClose, MdHistory, MdRefresh } from "react-icons/md";
import { SiUnitednations, SiGoogleearth } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useKeyboardControls, useProgress } from "@react-three/drei";
import { Controls } from "@function";

// Reusable style classes for consistent UI design
const SECTION_CLASS = "flex items-center gap-1.5 flex-wrap justify-center";

const BUTTON_BASE_CLASS =
    "relative group/btn flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50";

const TOGGLE_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "h-10 w-10 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 active:scale-95"
);

const ACTIVE_CYAN_CLASS = "bg-cyan-500/20 text-cyan-300 border-cyan-500/50  hover:bg-cyan-500/30";
const ACTIVE_SKY_CLASS = "bg-sky-500/20 text-sky-300 border-sky-500/50 hover:bg-sky-500/30";
const ACTIVE_PURPLE_CLASS = "bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30";
const ACTIVE_GREEN_CLASS = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30";

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

const SPEED_ARRAY = [0.1, 0.5, 1, 2, 3, 5]

const MODE_LIST = [
    { id: Mode.Object, label: "Object View", img: "mode_object.webp" },
    { id: Mode.ThirdPerson, label: "Third Person", img: "mode_third_person.webp" },
    { id: Mode.FirstPerson, label: "First Person", img: "mode_first_person.webp" }
]

const ControlPanel = () => {
    const { mode, focus, focusIndex, focusInput, focusLandmark, tidalLock, landmarkVisible, nationVisible, rotateSpeed, cloudVisible, atmosphereVisible, artificialSatelliteVisible, topographyVisible, dayNightMode, variant, setControl, resetControl } = useControlStore()
    const [lastVariant, setLastVariant] = useState<{ orbit_duration: number, rotate_duration: number } | undefined>()
    const [lastRotateSpeed, setLastRotateSpeed] = useState(rotateSpeed)
    const [timelinesVisible, setTimelineVisible] = useState(true)
    const [modeVisible, setModeVisible] = useState(false)
    const isLoading = useProgress(state => state.active)

    const isMobile = useMobile()
    const [sub] = useKeyboardControls<Controls>()
    const { t } = useTranslation()

    const rawData = useCelestial().getObjectById(focus) as Planet
    const data = useVariant(rawData) as Planet
    const showTimelines = data?.variants?.length && timelinesVisible
    const isStillObject = ["spacecraft-orbiter", "spacecraft-flyby", "belt"].includes(data.type)

    // const tiltDialRef = useRef<HTMLDivElement>(null)
    // const isDraggingRef = useRef(false)


    // const updateTiltFromEvent = useCallback((e: React.PointerEvent | PointerEvent) => {
    //     if (!tiltDialRef.current) return
    //     const rect = tiltDialRef.current.getBoundingClientRect()
    //     const centerX = rect.left + rect.width / 2
    //     const centerY = rect.top + rect.height / 2
    //     const dx = e.clientX - centerX
    //     const dy = e.clientY - centerY
    //     let deg = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90)
    //     if (deg > 180) deg -= 360
    //     setControl({ axisTilt: deg })
    // }, [setControl])

    // const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    //     isDraggingRef.current = true
    //     e.currentTarget.setPointerCapture(e.pointerId)
    //     updateTiltFromEvent(e)
    // }

    // const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    //     if (isDraggingRef.current) {
    //         updateTiltFromEvent(e)
    //     }
    // }

    // const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    //     if (isDraggingRef.current) {
    //         isDraggingRef.current = false
    //         try {
    //             e.currentTarget.releasePointerCapture(e.pointerId)
    //         } catch {
    //             // ignore if already released
    //         }
    //     }
    // }

    // const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    //     const step = e.shiftKey ? 5 : 1
    //     let nextTilt = axisTilt + (e.deltaY < 0 ? step : -step)
    //     if (nextTilt > 180) nextTilt -= 360
    //     if (nextTilt < -180) nextTilt += 360
    //     setControl({ axisTilt: nextTilt })
    // }


    useEffect(() => {
        setLastRotateSpeed(1)
    }, [focus])

    const timelines = useMemo(() => {
        if (!data?.variants?.length) return []

        const variants = [{ variant_id: "", order: 0 }, ...data.variants]
            .sort((a, b) => a.order - b.order)

        return variants
    }, [data])

    useEffect(() => {
        if (rotateSpeed > 0) setLastRotateSpeed(rotateSpeed)
    }, [rotateSpeed])

    const handleRotatePlay = useCallback(() => {
        const isTidalLock = data.rotate_duration === data.orbit_duration

        if (isTidalLock) {
            setControl({
                rotateSpeed: rotateSpeed === 0 ? (lastRotateSpeed > 0 ? lastRotateSpeed : 1) : 0,
                tidalLock: false,
                focusLandmark: ""
            })
        } else {
            setControl({
                rotateSpeed: rotateSpeed === 0 ? (lastRotateSpeed > 0 ? lastRotateSpeed : 1) : 0,
                focusLandmark: ""
            })
        }
    }, [data.orbit_duration, data.rotate_duration, lastRotateSpeed, rotateSpeed, setControl])

    const handleRotateNext = useCallback(() => {
        if (rotateSpeed === SPEED_ARRAY[SPEED_ARRAY.length - 1] || rotateSpeed === 0) return
        const currentIndex = SPEED_ARRAY.indexOf(rotateSpeed)
        setControl({ rotateSpeed: SPEED_ARRAY[currentIndex + 1] })
    }, [rotateSpeed, setControl])

    const handleRotatePrev = useCallback(() => {
        if (rotateSpeed === SPEED_ARRAY[0] || rotateSpeed === 0) return
        const currentIndex = SPEED_ARRAY.indexOf(rotateSpeed)
        setControl({ rotateSpeed: SPEED_ARRAY[currentIndex - 1] })
    }, [rotateSpeed, setControl])

    const handleLandmark = useCallback(() => {
        setControl({ landmarkVisible: !landmarkVisible, nationVisible: false })
    }, [landmarkVisible, setControl])

    const handleCloud = useCallback(() => {
        setControl({ cloudVisible: !cloudVisible })
    }, [cloudVisible, setControl])

    const handleAtmosphere = () => {
        setControl({ atmosphereVisible: !atmosphereVisible })
    }


    const handleNation = () => {
        setControl({ nationVisible: !nationVisible, landmarkVisible: false, focusLandmark: "" })
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

    const handleTopography = () => {
        setControl({ topographyVisible: !topographyVisible, cloudVisible: false, atmosphereVisible: false })
    }

    const handleVariant = useCallback((variant: string) => {
        setControl({ variant, focusLandmark: "", topographyVisible: false })
    }, [setControl])

    const handleTimelines = () => {
        setTimelineVisible(!timelinesVisible)
    }

    const handleMode = (mode: Mode) => {
        setControl({ mode })
        setModeVisible(false)
    }

    const handleReset = () => {
        resetControl(data)
    }

    const handleLeave = () => {
        const spacecraft = data as unknown as SpaceCraft

        resetControl(data)
        setControl({ focus: spacecraft.type === "spacecraft-orbiter" ? data.parent : "" })
    }

    const getVariantIndex = useCallback(() => {
        return timelines.findIndex(time => time.variant_id === variant)
    }, [timelines, variant])

    useEffect(() => {
        const unsub = sub(
            (state) => state,
            (keys) => {
                if (focusInput) return

                if (keys.space) handleRotatePlay()
                if (keys.up) handleRotateNext()
                if (keys.down) handleRotatePrev()
                if (keys.q) handleLandmark()
                if (keys.e) handleCloud()
                if (keys.left) {
                    const index = getVariantIndex()
                    if (index === 0) return
                    handleVariant(timelines[index - 1].variant_id)
                }

                if (keys.right) {
                    const index = getVariantIndex()
                    if (index === timelines.length - 1) return
                    handleVariant(timelines[index + 1].variant_id)
                }

                if (keys.z) {
                    console.log('left tilt')
                }

                if (keys.x) {
                    console.log('right tilt')
                }

                if (keys.c) {
                    console.log('right tilt')
                }

            }
        )

        return unsub
    }, [focusInput, getVariantIndex, handleCloud, handleLandmark, handleRotateNext, handleRotatePlay, handleRotatePrev, handleVariant, setControl, sub, timelines])

    useEffect(() => {
        if (data) {
            setLastVariant({ orbit_duration: data.orbit_duration, rotate_duration: data.rotate_duration })
        }
    }, [data])

    const isTidalLock = (object: { orbit_duration: number, rotate_duration: number }) => {
        return object.orbit_duration === object.rotate_duration
    }

    useEffect(() => {
        if (!lastVariant || !data) return

        const previousLock = isTidalLock(lastVariant)
        const currentLock = isTidalLock(data)

        if (previousLock !== currentLock) {
            setControl({ tidalLock: currentLock, rotateSpeed: currentLock ? 0 : 1 })
        }
    }, [data, data.orbit_duration, data.rotate_duration, lastVariant, rotateSpeed, setControl])

    useEffect(() => {
        setModeVisible(false)
    }, [focus])

    if (!data) return null;

    return (
        <div className={clsx(isMobile ? "" : "fixed w-fit bottom-6 left-1/2 -translate-x-1/2 bg-background backdrop-blur-md border border-white/15 shadow-2xl shadow-cyan-950/40 hover:border-cyan-500/30", "max-w-full flex-wrap flex items-center gap-3 z-40  p-2 px-3 rounded-full  transition-all duration-300")}>
            <div className={clsx(isMobile ? "order-last" : "absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full z-5", "flex items-center flex-col gap-2 w-full")}>
                <When condition={isLoading}>
                    <div className="w-fit whitespace-nowrap bg-background border border-white/15 px-2.5 py-1 font-semibold text-sm text-white shadow-xl backdrop-blur-md rounded-md italic">
                        Loading texture ...
                    </div>
                </When>

                <When condition={focusLandmark}>
                    <div className="flex w-fit items-center gap-2 bg-background border border-white/15 px-2.5 py-1 font-semibold text-sm text-white shadow-xl backdrop-blur-md rounded-md">
                        <span className="pointer-events-none">{t(`landmark.${focusLandmark}.name`)}</span>
                        <MdClose className="cursor-pointer text-red-400 size-4" onClick={handleLeaveLandmark} />
                    </div>
                </When>

                <When condition={showTimelines}>
                    <div className="w-full relative flex justify-evenly items-end gap-3 py-2 px-3 max-w-full scrollbar-thin scrollbar-thumb-slate-700">
                        <div className={clsx(!isMobile && "absolute", "absolute bottom-3.75 left-6 right-6 h-0.5 bg-linear-to-r from-slate-700 via-cyan-500/40 to-slate-700 z-0 pointer-events-none")} />

                        {timelines.map((_data) => {
                            const isSelected = variant === _data.variant_id

                            return (
                                <button
                                    key={_data.variant_id}
                                    onClick={() => handleVariant(_data.variant_id)}
                                    className="group/btn relative z-10 flex flex-col items-center gap-2.5 group/node cursor-pointer shrink-0 transition-transform active:scale-95"
                                >
                                    <div className={clsx(
                                        "group-hover/btn:flex hidden absolute -top-2 -translate-y-full px-3 py-1.5 rounded-xl text-xs flex-col gap-0.5 items-center font-medium transition-all duration-200 border whitespace-nowrap shadow-md",
                                        isSelected
                                            ? "bg-cyan-500/25 text-cyan-200 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105"
                                            : "bg-slate-800/90 text-slate-300 border-white/10 hover:bg-slate-700 hover:text-white hover:border-white/30"
                                    )}>
                                        <span className="font-semibold">{t(`object.${data.id}.variants.${_data.variant_id}.name`, t("ui.present"))}</span>
                                        <When condition={_data.order !== 0}>
                                            <span>{timelineFormat(_data.order)}</span>
                                        </When>
                                    </div>

                                    <div className={clsx(
                                        "w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                                        isSelected
                                            ? "bg-primary border-base shadow-[0_0_10px_rgba(6,182,212,0.9)] scale-125"
                                            : "bg-slate-900 border-slate-500 group-hover/node:border-cyan-400 group-hover/node:bg-slate-700"
                                    )}>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </When>
            </div>




            <div className={clsx(SECTION_CLASS, isMobile && "w-full")}>
                <When condition={data.landmarks?.length}>
                    <button
                        onClick={handleLandmark}
                        className={clsx(TOGGLE_BTN_CLASS, landmarkVisible && ACTIVE_CYAN_CLASS)}
                    >
                        <HiLocationMarker />
                        <span className={TOOLTIP_CLASS}>Landmarks</span>
                    </button>
                </When>

                <When condition={data.id === "earth" && !data.variant_id}>
                    <button
                        onClick={handleNation}
                        className={clsx(TOGGLE_BTN_CLASS, nationVisible && ACTIVE_CYAN_CLASS)}
                    >
                        <SiUnitednations />
                        <span className={TOOLTIP_CLASS}>Nations</span>
                    </button>
                </When>

                <When condition={data.cloud_texture}>
                    <button
                        onClick={handleCloud}
                        className={clsx(TOGGLE_BTN_CLASS, cloudVisible && ACTIVE_SKY_CLASS)}
                    >
                        <ImCloud />
                        <span className={TOOLTIP_CLASS}>Cloud</span>
                    </button>
                </When>

                <When condition={data.atmosphere || data.aurora}>
                    <button
                        onClick={handleAtmosphere}
                        className={clsx(TOGGLE_BTN_CLASS, atmosphereVisible && ACTIVE_GREEN_CLASS)}
                    >
                        <SiGoogleearth />
                        <span className={TOOLTIP_CLASS}>{data.atmosphere ? "Atmosphere" : "Aurora"}</span>
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
                <When condition={data.night_texture}>
                    <button
                        onClick={handleDayNight}
                        className={clsx(TOGGLE_BTN_CLASS, dayNightMode && ACTIVE_CYAN_CLASS)}
                    >
                        <MdBrightnessMedium />
                        <span className={TOOLTIP_CLASS}>Day / Night Mode</span>
                    </button>
                </When>
                <When condition={data.topography_texture}>
                    <button
                        onClick={handleTopography}
                        className={clsx(TOGGLE_BTN_CLASS, topographyVisible && ACTIVE_CYAN_CLASS)}
                    >
                        <CgTerrain />
                        <span className={TOOLTIP_CLASS}>Topography</span>
                    </button>
                </When>
                <When condition={data.variants?.length}>
                    <button
                        onClick={handleTimelines}
                        className={clsx(TOGGLE_BTN_CLASS, showTimelines && ACTIVE_CYAN_CLASS)}
                    >
                        <MdHistory />
                        <span className={TOOLTIP_CLASS}>Timelines</span>
                    </button>
                </When>
            </div>

            {/* <div className="h-6 w-px bg-divider my-auto" /> */}

            {/* <div>
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
            </div> */}

            {/* Rotation Controls Section */}
            <When condition={!isStillObject}>
                <div className={clsx(isMobile && "w-full justify-center", "flex items-center gap-2")}>
                    <When condition={!isMobile}>
                        <div className="h-6 w-px bg-divider my-auto" />
                    </When>


                    <div className={clsx(SECTION_CLASS, isMobile && "justify-center")}>
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
                                {tidalLock ? "Tidally Locked" : `${rotateSpeed}x`}
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

                    <div className={SECTION_CLASS}>
                        <When condition={!isStillObject}>
                            <button onClick={() => setModeVisible(!modeVisible)} className={clsx(TOGGLE_BTN_CLASS, "hover:bg-green-400/40")}>
                                <AiFillEye />
                                <span className={TOOLTIP_CLASS}>View Mode</span>
                            </button>
                        </When>
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
            </When>



            <When condition={modeVisible}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/90 backdrop-blur-xl py-3 px-2 border border-white/15 flex flex-col gap-2 min-w-48 shadow-2xl z-5">
                    <div className="text-xs font-semibold text-slate-400 border-b border-white/10 pb-2 px-2 flex justify-between items-center">
                        <span>View Mode</span>
                        <MdClose className="cursor-pointer text-slate-400 hover:text-white" onClick={() => setModeVisible(false)} />
                    </div>
                    <div className="flex gap-1">

                        {MODE_LIST.map((_mode) => {
                            const isSelected = mode === _mode.id

                            return (
                                <button
                                    key={_mode.id}
                                    onClick={() => handleMode(_mode.id)}
                                    className={clsx(
                                        "flex flex-col items-center justify-between px-4 pt-3 pb-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer gap-3",
                                        isSelected ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <div className="w-56 bg-red-100 rounded">
                                        <img alt={_mode.label} src={`/images/${_mode.img}`} />
                                    </div>
                                    <span className="whitespace-nowrap">{_mode.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </When>
        </div>
    )
}

export default ControlPanel