/* eslint-disable react-hooks/set-state-in-effect */
import { useControlStore } from "@state"
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import { handleZoomIn, handleZoomOut, timelineFormat, useCelestial, useMobile, useVariant } from "@function";
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
import { useNavigate } from "react-router";

// Reusable style classes for consistent UI design
const SECTION_CLASS = "flex items-center gap-1.5 flex-wrap justify-center";

const BUTTON_BASE_CLASS =
    "relative group/btn flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:pointer-events-none cursor-pointer";

const TOGGLE_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "size-9 rounded-xl border border-panel-border text-secondary hover:text-primary hover:border-panel-border-hover active:scale-95"
);

// Function-tailored active & hover classes
const BTN_LANDMARK_CLASS = "hover:border-yellow/40 hover:bg-yellow/10";
const ACTIVE_LANDMARK_CLASS = "bg-yellow/20 border-yellow/50 hover:bg-yellow/30";

const BTN_NATION_CLASS = "hover:border-sky-400/40 hover:bg-sky-500/10";
const ACTIVE_NATION_CLASS = "bg-sky-500/20 border-sky-400/50  hover:bg-sky-500/30";

const BTN_CLOUD_CLASS = "hover:border-accent/40 hover:bg-cyan-500/10";
const ACTIVE_CLOUD_CLASS = "bg-cyan-500/20 border-accent/50 hover:bg-cyan-500/30";

const BTN_ATMOSPHERE_CLASS = "hover:border-emerald-400/40 hover:bg-emerald-500/10";
const ACTIVE_ATMOSPHERE_CLASS = "bg-emerald-500/20 border-emerald-400/50  hover:bg-emerald-500/30";

const BTN_SATELLITE_CLASS = "hover:border-purple-400/40 hover:bg-purple-500/10";
const ACTIVE_SATELLITE_CLASS = "bg-purple-500/20 border-purple-400/50  hover:bg-purple-500/30";

const BTN_DAYNIGHT_CLASS = "hover:border-amber-400/40 hover:bg-amber-500/10";
const ACTIVE_DAYNIGHT_CLASS = "bg-amber-500/20 border-amber-400/50  hover:bg-amber-500/30";

const BTN_TOPOGRAPHY_CLASS = "hover:border-orange-400/40 hover:bg-orange-500/10";
const ACTIVE_TOPOGRAPHY_CLASS = "bg-orange-500/20 border-orange-400/50  hover:bg-orange-500/30";

const BTN_TIMELINE_CLASS = "hover:border-indigo-400/40 hover:bg-indigo-500/10";
const ACTIVE_TIMELINE_CLASS = "bg-indigo-500/20 border-indigo-400/50 hover:bg-indigo-500/30";

const NAV_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "size-9 rounded-xl border border-transparent text-secondary hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-accent/30 active:scale-90"
);

const PLAY_BTN_CLASS = clsx(
    BUTTON_BASE_CLASS,
    "h-9 px-3.5 gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-cyan-500/10 hover:border-accent/30 hover:text-cyan-200 text-primary active:scale-95 font-mono text-xs"
);

const PLAY_BTN_ACTIVE_CLASS = "border-accent/50 bg-cyan-950/40 text-cyan-200";

const TOOLTIP_CLASS =
    "absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 whitespace-nowrap rounded-lg bg-panel-bg border border-white/15 px-2.5 py-1 text-[11px] font-sans text-secondary shadow-2xl backdrop-blur-xl z-50";

const SPEED_ARRAY = [0.1, 0.5, 1, 2, 3, 5]

const MODE_LIST: { id: Mode, label: string, img: string }[] = [
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
    const navigate = useNavigate()

    const isMobile = useMobile()
    const [sub] = useKeyboardControls<Controls>()
    const { t } = useTranslation()

    const rawData = useCelestial().getObjectById(focus) as Planet
    const data = useVariant(rawData) as Planet
    const showTimelines = data?.variants?.length && timelinesVisible
    const isStillObject = ["spacecraft-orbiter", "spacecraft-flyby", "belt"].includes(data.type)

    const modeLists = useMemo(() => {
        const liveView = {
            id: Mode.LiveView, label: "Live View", img: "mode_first_person.webp"
        }

        return [
            ...MODE_LIST,
            ...(data.liveview ? [liveView] : [])
        ]
    }, [data.liveview])

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
        if (mode === Mode.LiveView) {
            return navigate(`/liveview/${data.id}`)
        }

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
        <div
            className={clsx(
                isMobile
                    ? ""
                    : "fixed w-fit bottom-4 left-1/2 -translate-y-full -translate-x-1/2 bg-panel-bg backdrop-blur-2xl border border-panel-border shadow-panel hover:border-accent/30",
                "max-w-full flex-wrap flex items-center gap-2.5 z-40 p-2 px-3.5 rounded-2xl transition-all duration-300 relative"
            )}
        >
            {/* Top Glowing Cosmic Line */}
            <When condition={!isMobile}>
                <div className="absolute top-0 inset-x-8 h-[1.5px] bg-linear-to-r from-transparent via-accent/60 to-transparent pointer-events-none" />
            </When>

            {/* Overlays / Banners */}
            <div className={clsx(isMobile ? "order-last" : "absolute -top-2.5 left-1/2 -translate-x-1/2 -translate-y-full z-10", "flex items-center flex-col gap-2 w-full")}>
                <When condition={isLoading}>
                    <div className="w-fit whitespace-nowrap bg-panel-bg border border-white/15 px-3 py-1 font-mono text-xs text-highlight shadow-xl backdrop-blur-xl rounded-xl italic flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                        {t("ui.loading_texture", "Loading texture...")}
                    </div>
                </When>

                <When condition={focusLandmark}>
                    <div className="flex w-fit items-center gap-2.5 bg-panel-bg border border-yellow/40 px-3 py-1.5 font-space-grotesk font-semibold text-xs text-primary shadow-xl backdrop-blur-xl rounded-xl">
                        <span className="size-1.5 rounded-full bg-yellow animate-pulse" />
                        <span>{t(`landmark.${focusLandmark}.name`)}</span>
                        <button onClick={handleLeaveLandmark} className="text-tertiary hover:text-red transition-colors ml-1 cursor-pointer">
                            <MdClose className="size-3.5" />
                        </button>
                    </div>
                </When>

                <When condition={showTimelines}>
                    <div className="w-full relative flex justify-evenly items-center gap-1.5 sm:gap-3 py-1 sm:py-2 px-2 sm:px-4 max-w-full">
                        <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 right-3 sm:right-6 h-[1.5px] sm:h-[2px] bg-linear-to-r from-transparent via-accent/50 to-transparent z-0 pointer-events-none" />

                        {timelines.map((_data) => {
                            const isSelected = variant === _data.variant_id;

                            return (
                                <button
                                    key={_data.variant_id}
                                    onClick={() => handleVariant(_data.variant_id)}
                                    className="group/btn relative z-10 flex flex-col items-center justify-center p-1 sm:p-1.5 group/node cursor-pointer shrink-0 transition-transform active:scale-95"
                                >
                                    <div
                                        className={clsx(
                                            "group-hover/btn:flex hidden absolute -top-2 -translate-y-full px-3 py-1.5 rounded-xl text-xs flex-col gap-0.5 items-center font-medium transition-all duration-200 border whitespace-nowrap shadow-2xl backdrop-blur-xl",
                                            isSelected
                                                ? "bg-accent/25 text-highlight border-accent/60 shadow-glow scale-105"
                                                : "bg-panel-bg text-secondary border-panel-border hover:bg-slate-900 hover:text-primary hover:border-panel-border-hover"
                                        )}
                                    >
                                        <span className="font-semibold">{t(`object.${data.id}.variants.${_data.variant_id}.name`, t("ui.present"))}</span>
                                        <When condition={_data.order !== 0}>
                                            <span className="text-[10px] font-mono text-highlight">{timelineFormat(_data.order)}</span>
                                        </When>
                                    </div>

                                    <div
                                        className={clsx(
                                            "size-2.5 sm:size-3.5 rounded-full border-[1.5px] sm:border-2 transition-all duration-200 flex items-center justify-center",
                                            isSelected
                                                ? "bg-accent border-white shadow-glow scale-125"
                                                : "bg-slate-900 border-slate-500 group-hover/node:border-accent group-hover/node:bg-slate-700"
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </When>
            </div>




            {/* Feature Toggles Section */}
            <div className={clsx(SECTION_CLASS, isMobile && "w-full")}>
                <When condition={data.landmarks?.length}>
                    <button
                        onClick={handleLandmark}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_LANDMARK_CLASS, landmarkVisible && ACTIVE_LANDMARK_CLASS)}
                    >
                        <HiLocationMarker className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.landmarks", "Landmarks")}</span>
                    </button>
                </When>

                <When condition={data.id === "earth" && !data.variant_id}>
                    <button
                        onClick={handleNation}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_NATION_CLASS, nationVisible && ACTIVE_NATION_CLASS)}
                    >
                        <SiUnitednations className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.nations", "Nations")}</span>
                    </button>
                </When>

                <When condition={data.cloud_texture}>
                    <button
                        onClick={handleCloud}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_CLOUD_CLASS, cloudVisible && ACTIVE_CLOUD_CLASS)}
                    >
                        <ImCloud className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.cloud", "Cloud")}</span>
                    </button>
                </When>

                <When condition={data.atmosphere || data.aurora}>
                    <button
                        onClick={handleAtmosphere}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_ATMOSPHERE_CLASS, atmosphereVisible && ACTIVE_ATMOSPHERE_CLASS)}
                    >
                        <SiGoogleearth className="size-4" />
                        <span className={TOOLTIP_CLASS}>{data.atmosphere ? t("ui.atmosphere", "Atmosphere") : t("ui.aurora", "Aurora")}</span>
                    </button>
                </When>

                <When condition={data.artificial_satellites?.length}>
                    <button
                        onClick={handleSatellite}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_SATELLITE_CLASS, artificialSatelliteVisible && ACTIVE_SATELLITE_CLASS)}
                    >
                        <TbSatelliteFilled className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.satellites", "Satellites")}</span>
                    </button>
                </When>

                <When condition={data.night_texture}>
                    <button
                        onClick={handleDayNight}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_DAYNIGHT_CLASS, dayNightMode && ACTIVE_DAYNIGHT_CLASS)}
                    >
                        <MdBrightnessMedium className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.day_night_mode", "Day / Night Mode")}</span>
                    </button>
                </When>

                <When condition={data.topography_texture}>
                    <button
                        onClick={handleTopography}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_TOPOGRAPHY_CLASS, topographyVisible && ACTIVE_TOPOGRAPHY_CLASS)}
                    >
                        <CgTerrain className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.topography", "Topography")}</span>
                    </button>
                </When>

                <When condition={data.variants?.length}>
                    <button
                        onClick={handleTimelines}
                        className={clsx(TOGGLE_BTN_CLASS, BTN_TIMELINE_CLASS, showTimelines && ACTIVE_TIMELINE_CLASS)}
                    >
                        <MdHistory className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.timelines", "Timelines")}</span>
                    </button>
                </When>
            </div>



            <div className={clsx(isMobile && "w-full justify-center", "flex items-center gap-2")}>
                <When condition={!isStillObject}>
                    <When condition={!isMobile}>
                        <div className="h-5 w-px bg-white/10 my-auto" />
                    </When>

                    <div className={clsx(SECTION_CLASS, isMobile && "justify-center")}>
                        <button
                            onClick={handleRotatePrev}
                            className={NAV_BTN_CLASS}
                            disabled={rotateSpeed === SPEED_ARRAY[0] || rotateSpeed === 0}
                        >
                            <PiRewindFill className="size-4" />
                            <span className={TOOLTIP_CLASS}>{t("ui.slower", "Slower")}</span>
                        </button>

                        <button
                            onClick={handleRotatePlay}
                            className={clsx(PLAY_BTN_CLASS, rotateSpeed > 0 && PLAY_BTN_ACTIVE_CLASS)}
                        >
                            <span className="font-mono text-xs tracking-wider font-semibold">
                                {tidalLock ? t("ui.tidally_locked", "Tidally Locked") : `${rotateSpeed}x`}
                            </span>
                            {rotateSpeed > 0 ? (
                                <PiPauseFill className="text-red-300 size-3.5 shrink-0" />
                            ) : (
                                <PiPlayFill className="text-cyan-300 size-3.5 shrink-0" />
                            )}
                            <span className={TOOLTIP_CLASS}>
                                {rotateSpeed > 0 ? t("ui.pause", "Pause") : t("ui.rotate", "Rotate")}
                            </span>
                        </button>

                        <button
                            onClick={handleRotateNext}
                            className={NAV_BTN_CLASS}
                            disabled={rotateSpeed === SPEED_ARRAY[SPEED_ARRAY.length - 1] || rotateSpeed === 0}
                        >
                            <PiFastForwardFill className="size-4" />
                            <span className={TOOLTIP_CLASS}>{t("ui.faster", "Faster")}</span>
                        </button>
                    </div>

                    <div className="h-5 w-px bg-white/10 my-auto" />
                </When>

                <div className={SECTION_CLASS}>
                    <When condition={!isStillObject}>
                        <button
                            onClick={() => setModeVisible(!modeVisible)}
                            className={clsx(
                                TOGGLE_BTN_CLASS,
                                "hover:bg-green/40",
                                modeVisible && "bg-green/40"
                            )}
                        >
                            <AiFillEye className="size-4" />
                            <span className={TOOLTIP_CLASS}>{t("ui.view_mode", "View Mode")}</span>
                        </button>
                    </When>
                    <button
                        onClick={handleReset}
                        className={clsx(TOGGLE_BTN_CLASS, "hover:bg-yellow/50")}
                    >
                        <MdRefresh className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.reset", "Reset")}</span>
                    </button>
                    <button
                        onClick={handleLeave}
                        className={clsx(TOGGLE_BTN_CLASS, "hover:bg-red/50")}
                    >
                        <MdClose className="size-4" />
                        <span className={TOOLTIP_CLASS}>{t("ui.leave", "Leave")}</span>
                    </button>
                </div>
            </div>

            <When condition={modeVisible}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full rounded-2xl bg-panel-bg backdrop-blur-2xl p-3 border border-white/15 flex flex-col gap-2.5 min-w-56 shadow-panel z-10">
                    <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent pointer-events-none" />
                    <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-secondary border-b border-panel-border pb-2 px-1 flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-highlight">
                            <AiFillEye className="size-3.5" />
                            {t("ui.view_mode", "View Mode")}
                        </span>
                        <button
                            type="button"
                            onClick={() => setModeVisible(false)}
                            className="size-6 rounded-lg flex items-center justify-center text-tertiary hover:text-primary hover:bg-white/10 transition-colors"
                        >
                            <MdClose className="size-3.5" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        {modeLists.map((_mode) => {
                            const isSelected = mode === _mode.id

                            return (
                                <button
                                    key={_mode.id}
                                    onClick={() => handleMode(_mode.id)}
                                    className={clsx(
                                        "group flex flex-col items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer gap-2.5 border",
                                        isSelected
                                            ? "bg-accent/15 text-highlight border-accent/50 shadow-glow"
                                            : "border-panel-border-subtle bg-card-bg text-secondary hover:bg-card-hover hover:text-primary hover:border-panel-border-hover"
                                    )}
                                >
                                    <div className="w-48 sm:w-56 overflow-hidden rounded-lg border border-panel-border bg-slate-900/60">
                                        <img
                                            alt={_mode.label}
                                            src={`/images/${_mode.img}`}
                                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <span className="whitespace-nowrap font-medium tracking-wide">{_mode.label}</span>
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