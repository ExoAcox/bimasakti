/* eslint-disable react-hooks/set-state-in-effect */
import clsx from "clsx";
import { useControlStore } from "@state";
import { useCelestial, lengthFormat, timeFormat, useVariant, useMobile } from "@function";
import { type Belt, type CelestialObject, type Planet, type SpaceCraft, type Star } from "@types";

import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { useEffect, useState } from "react";
import { IoChevronDown, IoPlanetOutline } from "react-icons/io5";
import {
    TbChevronRight,
    TbRulerMeasure,
    TbRotateClockwise,
    TbRotate360,
    TbArrowsHorizontal,
    TbSatellite,
    TbMapPin,
    TbLayersIntersect,
    TbArrowUpRight,
    TbSparkles,
    TbPlanet,
    TbMoonStars
} from "react-icons/tb";
import { BiArrowBack } from "react-icons/bi";
import { AU_SCALE } from "@constants";

const PanelDetail = () => {
    const [isPanelOpen, setPanelOpen] = useState(true);
    const [activeSection, setActiveSection] = useState("");

    const { focus, focusLandmark, variant, setControl } = useControlStore();

    const isMobile = useMobile();
    const isTablet = useMobile(1080);
    const celestial = useCelestial();
    const rawData = celestial.getObjectById(focus) as Planet;
    const data = useVariant(rawData);

    const { t } = useTranslation();

    useEffect(() => {
        setActiveSection("");
    }, [focus]);

    useEffect(() => {
        if (isTablet) {
            setPanelOpen(false);
        }
    }, [focus, isTablet]);

    if (!data) return null;

    const parentPlanet = (data.parent ? celestial.getObjectById(data.parent) : {}) as Planet;

    const handleClick = () => {
        setPanelOpen(!isPanelOpen);
    };

    const handleClickSection = (value: string) => {
        setActiveSection(activeSection === value ? "" : value);
    };

    const objectName = variant ? t(`object.${data?.id}.variants.${variant}.name`, t(`object.${data?.id}.name`)) : t(`object.${data?.id}.name`);
    const objectDescription = variant ? t(`object.${data?.id}.variants.${variant}.description`, t(`object.${data?.id}.description`)) : t(`object.${data?.id}.description`);

    const getBadgeInfo = () => {
        const celestialType = (data as CelestialObject | Belt).type;

        if (celestialType === "planet") {
            const planetClass = (data as Planet).class;
            const classKey = planetClass ? planetClass.toLowerCase().replace(/[\s-]+/g, "_") : "";
            return {
                label: classKey ? t(`class.${classKey}`, planetClass) : t("ui.planets", "Planet"),
                color: "text-blue bg-blue/10 border-blue/20"
            };
        }
        if (celestialType === "star") {
            const starClass = (data as Star).class;
            const classKey = starClass ? starClass.toLowerCase().replace(/[\s-]+/g, "_") : "";
            return {
                label: classKey ? t(`class.${classKey}`, starClass) : t("ui.stars", "Star"),
                color: "text-yellow bg-yellow/10 border-yellow/20"
            };
        }
        if (celestialType === "satellite") {
            return { label: t("ui.satellites", "Satellite"), color: "text-accent bg-accent/10 border-accent/20" };
        }
        if (celestialType === "spacecraft-orbiter" || celestialType === "spacecraft-flyby") {
            const craftClass = (data as unknown as SpaceCraft).class;
            const classKey = craftClass ? craftClass.toLowerCase().replace(/[\s-]+/g, "_") : "";
            return {
                label: classKey ? t(`class.${classKey}`, craftClass) : t("ui.spacecraft", "Spacecraft"),
                color: "text-green bg-green/10 border-green/20"
            };
        }
        if (celestialType === "belt") {
            return { label: t("ui.belts", "Belt"), color: "text-yellow bg-yellow/10 border-yellow/20" };
        }
        if (celestialType === "blackhole") {
            return { label: t("ui.blackhole", "Black Hole"), color: "text-red bg-red/10 border-red/20" };
        }
        if (celestialType === "asteroid") {
            return { label: t("ui.asteroid", "Asteroid"), color: "text-red bg-red/10 border-red/20" };
        }
        if (celestialType === "comet") {
            return { label: t("ui.comet", "Comet"), color: "text-red bg-red/10 border-red/20" };
        }

        return { label: "", color: "" };
    }

    const getTitleSize = (name: string) => {
        if (name.length > 23) return "text-lg md:text-xl";
        if (name.length > 15) return "text-xl md:text-2xl";
        return "text-2xl";
    }

    return (
        <div className={clsx(!isMobile && "fixed top-4 right-4 z-50", "transition-transform duration-300", !isPanelOpen && "translate-x-[calc(100%+1rem)]")}>

            <When condition={!isMobile}>
                <button
                    className={clsx(isPanelOpen ? "-left-8 w-8" : "-left-16 w-16", "absolute top-4 h-12 flex gap-1 items-center justify-center bg-panel-bg backdrop-blur-2xl rounded-l-xl border border-r-0 border-panel-border cursor-pointer hover:bg-card-hover hover:border-accent/40 hover:text-highlight transition-all text-secondary group")}
                    onClick={handleClick}
                    title={isPanelOpen ? t("ui.close_panel", "Tutup panel") : t("ui.open_panel", "Buka panel")}
                >
                    <TbChevronRight
                        className={clsx(
                            "size-4.5 transition-transform duration-300 shrink-0",
                            !isPanelOpen ? "rotate-180" : "group-hover:translate-x-0.5"
                        )}
                    />

                    <When condition={!isPanelOpen}>
                        <img src={`/icons/${data.icon}`} alt={objectName} className="size-6 shrink-0 object-contain drop-shadow" />
                    </When>
                </button>
            </When>

            <div
                className={clsx(
                    isMobile
                        ? "w-full pb-8 pt-3 px-4 text-sm relative"
                        : "w-84 md:w-96 max-h-[calc(100vh-2rem)] overflow-y-auto pb-6 pt-5 px-5 text-sm rounded-2xl bg-panel-bg backdrop-blur-2xl border border-panel-border relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent shadow-panel hover:border-accent/30 transition-all duration-300"
                )}
            >
                {/* Top Glowing Cosmic Line (Desktop Only) */}
                {!isMobile && (
                    <div className="absolute top-0 inset-x-8 h-[1.5px] bg-linear-to-r from-transparent via-accent/60 to-transparent pointer-events-none" />
                )}

                {/* Normal Object Detail View */}
                <When condition={!focusLandmark}>
                    {/* Header & Description Section for Snap Point */}
                    <div id="detail-description-section">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={clsx("inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border font-medium", getBadgeInfo().color)}>
                                        <span className="size-1.5 rounded-full bg-current animate-pulse" />
                                        {getBadgeInfo().label}
                                    </span>
                                </div>
                                <h1
                                    className={clsx(
                                        "font-bold font-space-grotesk tracking-tight text-primary wrap-break-word leading-tight drop-shadow-sm text-balance",
                                        getTitleSize(objectName)
                                    )}
                                    title={objectName}
                                >
                                    {objectName}
                                </h1>
                                {/* {data.parent && (
                                    <p className="text-xs text-tertiary mt-0.5 truncate">
                                        {t("ui.parent_object")}: <span className="text-slate-200">{t(`object.${data.parent}.name`)}</span>
                                    </p>
                                )} */}
                            </div>

                            <When condition={data.icon}>
                                <div className="relative shrink-0 flex items-center justify-center size-14 rounded-2xl bg-linear-to-b from-white/10 to-white/3 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.4)] p-2">
                                    <img src={`/icons/${data.icon}`} alt={objectName} className="size-10 object-contain drop-shadow" />
                                </div>
                            </When>
                        </div>

                        {/* Description Card */}
                        {objectDescription && (
                            <div className="mt-3.5 p-3 rounded-xl bg-white/3 border border-white/5 text-secondary text-sm leading-relaxed">
                                {objectDescription}
                            </div>
                        )}
                    </div>

                    {/* Telemetry Matrix Grid */}
                    <div id="detail-telemetry-section" className="mt-4">
                        <div className="flex items-center gap-2 mb-2 px-0.5">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-tertiary font-semibold">
                                {t("ui.telemetry_and_specs", "Telemetri & Spesifikasi")}
                            </span>
                        </div>

                        {/* Planet / Star / Satellite Metrics */}
                        <div className="flex flex-wrap gap-2">
                            <When condition={data.rotate_duration}>
                                <div className={clsx(data.orbit_duration ? "min-w-[45%]" : "min-w-[70%]", "flex-1 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors")}>
                                    <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                                        <TbRotateClockwise className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">{t("ui.rotation_period")}</span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-white tracking-tight">
                                        {timeFormat(data.rotate_duration)}
                                    </div>
                                </div>

                                <When condition={data.orbit_duration}>
                                    <div className="flex-1 min-w-[45%] p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors">
                                        <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                                            <TbRotate360 className="size-3.5" />
                                            <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">{t("ui.orbital_period")}</span>
                                        </div>
                                        <div className="font-space-grotesk text-xs sm:text-sm font-bold text-white tracking-tight">
                                            {data.orbit_duration && data.rotate_duration === data.orbit_duration ? "Tidally Locked" : timeFormat(data.orbit_duration)}
                                        </div>
                                    </div>
                                </When>
                            </When>


                            <div className="flex-1 min-w-[35%] p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors">
                                <div className="flex flex-1 items-center gap-1.5 text-accent mb-1">
                                    <TbRulerMeasure className="size-3.5" />
                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">{t("ui.diameter")}</span>
                                </div>
                                <div className="font-space-grotesk text-xs sm:text-sm font-bold text-white tracking-tight">
                                    {lengthFormat(data.radius * 2)}
                                </div>
                            </div>

                            <When condition={(data as Planet).childCount}>
                                <div className="flex-1 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors">
                                    <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                                        {data.type === "star" ?
                                            <TbPlanet className="size-3.5" /> : <TbMoonStars className="size-3.5" />}
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary truncate">
                                            {data.type === "star" ? t("ui.planets", "Planets") : t("ui.moons", "Moons")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-white tracking-tight">
                                        {(data as Planet).childCount}
                                    </div>
                                </div>
                            </When>

                            <When condition={data.distance}>
                                <div className="flex-1 p-2.5 min-w-[60%] col-span-2 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 transition-colors">
                                    <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                                        <TbArrowsHorizontal className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary truncate">
                                            {t("ui.distance_from")} {data.parent ? t(`object.${data.parent}.name`) : t("object.sun.name")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-white tracking-tight">
                                        {lengthFormat(data.distance)}
                                        {Number((data.distance / AU_SCALE).toFixed(1)) ? (
                                            <>
                                                <span className="mx-2.5">·</span>
                                                {(data.distance / AU_SCALE).toLocaleString(undefined, { maximumFractionDigits: 1 })} AU
                                            </>
                                        ) : ""}
                                    </div>
                                </div>
                            </When>
                        </div>

                        {/* Asteroid Belt Metrics */}
                        <When condition={(data as unknown as Belt).type === "belt"}>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                                    <div className="flex items-center gap-2 text-amber-400">
                                        <TbSparkles className="size-4" />
                                        <span className="text-xs text-tertiary">{t("ui.object_count")}</span>
                                    </div>
                                    <span className="font-space-grotesk font-bold text-white">± {(data as unknown as Belt).count?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                                    <div className="flex items-center gap-2 text-accent">
                                        <TbLayersIntersect className="size-4" />
                                        <span className="text-xs text-tertiary">{t("ui.inner_radius")}</span>
                                    </div>
                                    <span className="font-space-grotesk font-bold text-white">{lengthFormat((data as unknown as Belt).inner_radius)}</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <TbLayersIntersect className="size-4" />
                                        <span className="text-xs text-tertiary">{t("ui.outer_radius")}</span>
                                    </div>
                                    <span className="font-space-grotesk font-bold text-white">{lengthFormat((data as unknown as Belt).outer_radius)}</span>
                                </div>
                            </div>
                        </When>
                    </div>

                    {/* Parent Planet / Object Card */}
                    <When condition={data.type === "satellite" || ((data as unknown as SpaceCraft).type === "spacecraft-orbiter")}>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-tertiary font-semibold block mb-2 px-0.5">
                                {t(data.type === "satellite" ? "ui.parent_planet" : "ui.parent_object")}
                            </span>

                            <button
                                className="group w-full flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 border border-blue-400/20 hover:border-blue-400/40 transition-all text-left"
                                onClick={() => setControl({ focus: parentPlanet.id })}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {parentPlanet.icon && (
                                        // <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform">
                                        <img src={`/icons/${parentPlanet.icon}`} className="size-10 object-contain" alt={parentPlanet.icon} />
                                        // </div>
                                    )}
                                    <div className="min-w-0">
                                        <span className="text-sm font-bold font-space-grotesk text-white block truncate group-hover:text-cyan-300 transition-colors">
                                            {t(`object.${parentPlanet.id}.name`)}
                                        </span>
                                        <span className="text-[11px] text-tertiary font-mono">
                                            {lengthFormat(parentPlanet.radius * 2)} · {timeFormat(parentPlanet.rotate_duration)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-accent opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                                    {/* <span>Fokus</span> */}
                                    <TbArrowUpRight className="size-5" />
                                </div>
                            </button>
                        </div>
                    </When>

                    {/* Natural Satellites Section */}
                    <When condition={data.type === "planet" && !!(data.satellites && data.satellites.length)}>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/[0.07] border border-white/5 transition-all text-left"
                                onClick={() => handleClickSection("satellite")}
                            >
                                <div className="flex items-center gap-2 text-slate-200">
                                    <IoPlanetOutline className="size-4 text-accent" />
                                    <span className="font-semibold text-xs">{t("ui.natural_satellites")}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 text-cyan-300 border border-accent/25">
                                        {(data as Planet).satellites?.length}
                                    </span>
                                </div>
                                <IoChevronDown className={clsx("size-4 text-tertiary transition-transform duration-200", activeSection === "satellite" && "rotate-180")} />
                            </button>

                            <div className={clsx("flex flex-col gap-2 mt-2", activeSection !== "satellite" && "hidden")}>
                                {(data as Planet).satellites?.map(satellite => (
                                    <button
                                        key={satellite.id}
                                        className="group w-full flex items-center justify-between p-2.5 rounded-xl bg-white/2 hover:bg-cyan-500/10 border border-white/5 hover:border-accent/30 transition-all text-left"
                                        onClick={() => setControl({ focus: satellite.id })}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {satellite.icon && (
                                                <img src={`/icons/${satellite.icon}`} className="size-6 object-contain shrink-0 group-hover:scale-110 transition-transform" alt={satellite.icon} />
                                            )}
                                            <div className="min-w-0">
                                                <span className="text-xs font-bold text-white block truncate group-hover:text-cyan-300 transition-colors">
                                                    {t(`object.${satellite.id}.name`)}
                                                </span>
                                                <span className="text-[10px] text-tertiary font-mono">
                                                    {lengthFormat(satellite.radius * 2)} · {timeFormat(satellite.orbit_duration)} · {lengthFormat(satellite.distance)}
                                                </span>
                                            </div>
                                        </div>
                                        <TbArrowUpRight className="size-4 text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </When>

                    {/* Artificial Satellites / Spacecraft Section */}
                    <When condition={!!(data.artificial_satellites && data.artificial_satellites.filter(craft => craft.orbit_duration).length)}>
                        <div className="mt-3">
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/[0.07] border border-white/5 transition-all text-left"
                                onClick={() => handleClickSection("artificial_satellite")}
                            >
                                <div className="flex items-center gap-2 text-slate-200">
                                    <TbSatellite className="size-4 text-emerald-400" />
                                    <span className="font-semibold text-xs">{t("ui.artificial_satellites")}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-400/15 text-emerald-300 border border-emerald-400/25">
                                        {data.artificial_satellites?.filter(craft => craft.orbit_duration).length}
                                    </span>
                                </div>
                                <IoChevronDown className={clsx("size-4 text-tertiary transition-transform duration-200", activeSection === "artificial_satellite" && "rotate-180")} />
                            </button>

                            <div className={clsx("flex flex-col gap-2 mt-2", activeSection !== "artificial_satellite" && "hidden")}>
                                {data.artificial_satellites?.filter(craft => craft.orbit_duration)?.map(satellite => (
                                    <button
                                        key={satellite.id}
                                        className="group w-full flex items-center justify-between p-2.5 rounded-xl bg-white/2 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-400/30 transition-all text-left"
                                        onClick={() => setControl({ focus: satellite.id })}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {satellite.icon && (
                                                <img src={`/icons/${satellite.icon}`} className="size-6 object-contain shrink-0 group-hover:scale-110 transition-transform" alt={satellite.icon} />
                                            )}
                                            <div className="min-w-0">
                                                <span className="text-xs font-bold text-white block truncate group-hover:text-emerald-300 transition-colors">
                                                    {t(`object.${satellite.id}.name`)}
                                                </span>
                                                <span className="text-[10px] text-tertiary font-mono">
                                                    {lengthFormat(satellite.radius * 2)} · {timeFormat(satellite.orbit_duration)} · {lengthFormat(satellite.distance)}
                                                </span>
                                            </div>
                                        </div>
                                        <TbArrowUpRight className="size-4 text-tertiary group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </When>

                    {/* Landmarks Section */}
                    <When condition={!!(data.landmarks && data.landmarks.length > 0)}>
                        <div className="mt-3">
                            <button
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/[0.07] border border-white/5 transition-all text-left"
                                onClick={() => handleClickSection("landmark")}
                            >
                                <div className="flex items-center gap-2 text-slate-200">
                                    <TbMapPin className="size-4 text-amber-400" />
                                    <span className="font-semibold text-xs">{t("ui.landmarks")}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/15 text-amber-300 border border-amber-400/25">
                                        {data.landmarks?.length}
                                    </span>
                                </div>
                                <IoChevronDown className={clsx("size-4 text-tertiary transition-transform duration-200", activeSection === "landmark" && "rotate-180")} />
                            </button>

                            <div className={clsx("flex flex-col gap-1.5 mt-2", activeSection !== "landmark" && "hidden")}>
                                {data.landmarks?.map(landmark => {
                                    const isSelected = focusLandmark === landmark.id;
                                    return (
                                        <button
                                            key={landmark.id}
                                            className={clsx(
                                                "w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all",
                                                isSelected
                                                    ? "bg-amber-500/20 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                                    : "bg-white/2 border-white/5 hover:border-amber-400/30 hover:bg-white/5 text-secondary"
                                            )}
                                            onClick={() => setControl({ focusLandmark: isSelected ? "" : landmark.id })}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <TbMapPin className={clsx("size-3.5 shrink-0", isSelected ? "text-amber-400" : "text-tertiary")} />
                                                <span className="text-xs font-semibold truncate">{t(`landmark.${landmark.id}.name`)}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-tertiary shrink-0 ml-2">
                                                {landmark.latitude > 0 ? `${landmark.latitude}°N` : `${Math.abs(landmark.latitude)}°S`},{" "}
                                                {landmark.longitude > 0 ? `${landmark.longitude}°E` : `${Math.abs(landmark.longitude)}°W`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </When>
                </When>

                {/* Landmark Focused / Detail Inspector */}
                <When condition={focusLandmark}>
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <button
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-amber-400/50 transition-colors"
                            onClick={() => setControl({ focusLandmark: "" })}
                            title={t("ui.back_to_object", "Kembali ke objek")}
                        >
                            <BiArrowBack className="size-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                                {t("ui.focused_landmark", "Landmark Terfokus")}
                            </span>
                            <h1 className="text-base sm:text-lg font-bold font-space-grotesk text-primary wrap-break-word leading-tight">
                                {t(`landmark.${focusLandmark}.name`)}
                            </h1>
                        </div>
                    </div>

                    <div className="mt-3.5 p-3 rounded-xl bg-white/3 border border-white/5 text-secondary text-xs leading-relaxed">
                        {t(`landmark.${focusLandmark}.description`)}
                    </div>

                    <div className="mt-4">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                            onClick={() => setControl({ focusLandmark: "" })}
                        >
                            <BiArrowBack className="size-3.5" />
                            <span>{t("ui.back_to_summary", { object: objectName, defaultValue: `Kembali ke ringkasan ${objectName}` })}</span>
                        </button>
                    </div>

                    {/* Landmarks List under Focused View */}
                    <When condition={!!(data.landmarks && data.landmarks.length > 0)}>
                        <div className="mt-4 pt-3.5 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2 px-0.5">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary font-semibold">
                                    {t("ui.landmarks")} ({data.landmarks?.length})
                                </span>
                            </div>

                            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {data.landmarks?.map(landmark => {
                                    const isSelected = focusLandmark === landmark.id;
                                    return (
                                        <button
                                            key={landmark.id}
                                            className={clsx(
                                                "w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                                                isSelected
                                                    ? "bg-amber-500/20 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)] font-semibold"
                                                    : "bg-white/2 border-white/5 hover:border-amber-400/30 hover:bg-white/5 text-secondary"
                                            )}
                                            onClick={() => setControl({ focusLandmark: isSelected ? "" : landmark.id })}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <TbMapPin className={clsx("size-3.5 shrink-0", isSelected ? "text-amber-400" : "text-tertiary")} />
                                                <span className="text-xs truncate">{t(`landmark.${landmark.id}.name`)}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-tertiary shrink-0 ml-2">
                                                {landmark.latitude > 0 ? `${landmark.latitude}°N` : `${Math.abs(landmark.latitude)}°S`},{" "}
                                                {landmark.longitude > 0 ? `${landmark.longitude}°E` : `${Math.abs(landmark.longitude)}°W`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </When>
                </When>
            </div>
        </div>
    );
};

export default PanelDetail;