/* eslint-disable react-hooks/set-state-in-effect */

import clsx from "clsx";
import { useEffect, useState, type ChangeEvent } from "react";
import { useControlStore } from "@state";

import {
    PlanetClass,
    type Asteroid,
    type Belt,
    type CelestialObject,
    type Comet,
    type Planet,
    type Satellite,
    type SpaceCraft,
    type Star
} from "@types";
import { useCelestial, useMobile } from "@function";
import { useTranslation } from "react-i18next";

import { IoChevronDown, IoArrowBack } from "react-icons/io5";
import { TbChevronLeft, TbSearchOff } from "react-icons/tb";
import { MdClose, MdSearch } from "react-icons/md";
import { GiGalaxy } from "react-icons/gi";
import { When } from "react-if";
import { useNavigate } from "react-router";
import { PiEmpty } from "react-icons/pi";

interface SectionProps {
    children: string;
    data: (CelestialObject | Belt)[];
    initialOpen?: boolean;
}

const SearchResultSection = ({ data }: { data: (CelestialObject | Belt)[] }) => {
    const { focus, focusIndex, setControl } = useControlStore();
    const { t } = useTranslation();

    const handleClick = (id: string) => {
        if (focus === id) {
            setControl({ focusIndex: focusIndex + 1 });
        } else {
            setControl({ focus: id });
        }
    };

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-9 px-4 rounded-2xl bg-card-bg/40 border border-panel-border/60 text-center my-2">
                <div className="size-11 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center text-tertiary">
                    <PiEmpty className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold font-space-grotesk text-secondary">
                        {t("ui.object_not_found")}
                    </span>
                    <span className="text-[11px] text-tertiary">
                        {t("ui.try_another_keyword")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 overflow-y-auto pr-1">
            {data.map(object => {
                const isFocus = focus === object.id;
                return (
                    <button
                        key={object.id}
                        className={clsx(
                            "w-full py-2 px-2.5 flex items-center gap-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                            isFocus
                                ? "bg-cyan-500/15 border-accent/40 text-white font-semibold"
                                : "bg-white/2 hover:bg-white/6 border-white/5 hover:border-white/10 text-secondary hover:text-white"
                        )}
                        onClick={() => handleClick(object.id)}
                    >
                        {/* <div className="size-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-0.5 shrink-0"> */}
                        <img alt={object.icon} src={`/icons/${object.icon}`} className="size-5 object-contain" />
                        {/* </div> */}
                        <span className="truncate">{t(`object.${object.id}.nickname`)}</span>
                        {isFocus && <span className="size-1.5 rounded-full bg-accent animate-pulse ml-auto shrink-0" />}
                    </button>
                );
            })}
        </div>
    );
};

const Section = ({ children, data, initialOpen }: SectionProps) => {
    const [isOpen, setOpen] = useState(initialOpen);
    const { t } = useTranslation();

    const { focus, focusIndex, setControl } = useControlStore();
    const celestial = useCelestial();
    const universe = celestial.getUniverse();

    const handleClick = (id: string) => {
        if (focus === id) {
            setControl({ focusIndex: focusIndex + 1 });
        } else {
            setControl({ focus: id });
        }
    };

    if (!data?.length) return null;

    return (
        <div className="flex flex-col gap-1">
            <button
                className="w-full flex items-center justify-between py-1 px-2 rounded-lg text-tertiary hover:text-slate-200 hover:bg-white/3 transition-all text-left group cursor-pointer"
                onClick={() => setOpen(!isOpen)}
            >
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-tertiary group-hover:text-cyan-300 transition-colors">
                    {children}
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-white/5 border border-white/10 text-tertiary group-hover:border-accent/30 group-hover:text-cyan-300 transition-colors">
                        {data.length}
                    </span>
                    <IoChevronDown className={clsx("size-3.5 text-tertiary transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
            </button>

            <div className={clsx("flex flex-col gap-1", !isOpen && "hidden")}>
                {data.map((object) => {
                    const isFocus = focus === object.id;
                    const satellite = celestial.getObjectById(focus) as CelestialObject;
                    const isParentFocus = object.id === satellite?.parent && object.id !== universe.defaultFocus && satellite?.type !== "spacecraft-flyby";
                    const isMoonProbeFocus = object.id === "earth" && focus === "lro";

                    const moonArtificialSatellites = () => {
                        if (object.id !== "earth") return [];
                        const earth = object as Planet;
                        return earth.satellites?.[0]?.artificial_satellites ?? [];
                    };

                    const artificialSatellites = (object as Planet).artificial_satellites;
                    const satellites = [...(object as Planet).satellites ?? [], ...artificialSatellites ?? [], ...moonArtificialSatellites()];
                    const isSatelliteVisible = (isFocus || isParentFocus || isMoonProbeFocus) && satellites.length > 0;

                    return (
                        <div key={object.id} className="flex flex-col gap-1">
                            <button
                                className={clsx(
                                    "w-full py-1.5 px-2 flex items-center gap-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer",
                                    isFocus
                                        ? "bg-cyan-500/15 border-accent/40 text-white font-semibold"
                                        : "bg-white/2 hover:bg-white/6 border-white/5 hover:border-white/10 text-secondary hover:text-white"
                                )}
                                onClick={() => handleClick(object.id)}
                            >
                                {/* <div className="size-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center p-0.5 shrink-0"> */}
                                <img alt={object.icon} src={`/icons/${object.icon}`} className="size-5 object-contain" />
                                {/* </div> */}
                                <span className="truncate">{t(`object.${object.id}.nickname`)}</span>
                                {isFocus && <span className="size-1.5 rounded-full bg-accent animate-pulse ml-auto mr-1 shrink-0" />}
                            </button>

                            {isSatelliteVisible && (
                                <div className="pl-3 ml-3 border-l border-white/10 flex flex-col gap-1 my-0.5">
                                    {satellites.map((sat) => {
                                        const isSatFocus = focus === sat.id;
                                        return (
                                            <button
                                                key={sat.id}
                                                className={clsx(
                                                    "w-full py-1 px-2 flex items-center gap-2 rounded-lg border text-left transition-all text-xs cursor-pointer",
                                                    isSatFocus
                                                        ? "bg-cyan-500/20 border-accent/50 text-white font-semibold"
                                                        : "bg-transparent hover:bg-white/5 border-transparent text-tertiary hover:text-slate-200"
                                                )}
                                                onClick={() => handleClick(sat.id)}
                                            >
                                                <img alt={sat.icon} src={`/icons/${sat.icon}`} className="size-3.5 object-contain shrink-0" />
                                                <span className="truncate">{t(`object.${sat.id}.nickname`)}</span>
                                                {isSatFocus && <span className="size-1 rounded-full bg-accent ml-auto mr-0.5 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Sidebar = () => {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(true);
    const [search, setSearch] = useState("");

    const isTablet = useMobile(1080);
    const { focus, setControl } = useControlStore();
    const navigate = useNavigate();

    const celestial = useCelestial();
    const universe = celestial.getUniverse();
    const stars = celestial.getObjectsByType("star") as Star[];
    const comets = celestial.getObjectsByType("comet") as Comet[];
    const asteroids = celestial.getObjectsByType("asteroid") as Asteroid[];
    const belts = celestial.getObjectsByType("belt") as Belt[];
    const allPlanets = celestial.getObjectsByType("planet") as Planet[];
    const planets = allPlanets.filter(planet => planet.class !== PlanetClass.Dwarf);
    const dwarfPlanets = allPlanets.filter(planet => planet.class === PlanetClass.Dwarf);
    const satellites = celestial.getObjectsByType("satellite") as Satellite[];
    const spacecraftFlyby = celestial.getObjectsByType("spacecraft-flyby") as SpaceCraft[];
    const spacecraftOrbiter = celestial.getObjectsByType("spacecraft-orbiter") as SpaceCraft[];
    const spacecraft = [...spacecraftFlyby, ...spacecraftOrbiter];

    const handleClick = () => {
        setOpen(!isOpen);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleReset = () => {
        setSearch("");
    };

    const handleBack = () => {
        navigate("/milky_way");
    };

    useEffect(() => {
        if (isTablet) {
            setOpen(false);
        }
    }, [focus, isTablet]);

    const allObjects = [...stars, ...comets, ...asteroids, ...belts, ...allPlanets, ...satellites, ...spacecraft];

    const filteredObjects = allObjects.filter((object) => {
        const name = t(`object.${object.id}.nickname`).toLowerCase();
        const searchLower = search.toLowerCase();
        return name.includes(searchLower);
    });

    return (
        <div className={clsx("fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 max-w-dvw", !isOpen && "-translate-x-full")}>
            <button
                className="absolute top-4 -right-8 w-8 h-12 flex items-center justify-center bg-panel-bg backdrop-blur-2xl rounded-r-xl border border-l-0 border-panel-border cursor-pointer hover:bg-card-hover hover:border-accent/40 hover:text-highlight transition-all text-secondary group"
                onClick={handleClick}
                title={isOpen ? t("ui.close_sidebar") : t("ui.open_sidebar")}
            >
                <TbChevronLeft
                    className={clsx(
                        "size-4.5 transition-transform duration-300",
                        !isOpen ? "rotate-180" : "group-hover:-translate-x-0.5"
                    )}
                />
            </button>

            <div className="w-64 h-full flex flex-col p-4 text-primary bg-panel-bg backdrop-blur-2xl border-r border-panel-border relative">

                {/* System Title */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="font-space-grotesk font-bold text-sm text-primary uppercase flex items-center gap-2">
                        <GiGalaxy />
                        {t(`object.${universe?.id}.name`, universe?.id)}
                    </span>
                </div>

                {/* Search Input Box */}
                <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-card-bg border border-panel-border focus-within:border-accent/50 focus-within:bg-card-hover focus-within:ring-1 focus-within:ring-accent/30 transition-all mb-3.5">
                    <MdSearch className="size-4 text-accent shrink-0" />
                    <input
                        value={search}
                        onChange={handleChange}
                        onFocus={() => setControl({ focusInput: true })}
                        onBlur={() => setControl({ focusInput: false })}
                        placeholder={t("ui.search_object", "Cari objek...")}
                        className="w-full bg-transparent text-xs text-primary placeholder:text-tertiary focus:outline-none font-sans"
                    />
                    <When condition={search}>
                        <button onClick={handleReset} className="text-tertiary hover:text-red transition-colors cursor-pointer shrink-0">
                            <MdClose className="size-3.5" />
                        </button>
                    </When>
                </div>

                {/* Main Content: Search results or category sections */}
                <When condition={search}>
                    <SearchResultSection data={filteredObjects} />
                </When>

                <When condition={!search}>
                    <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <Section data={stars} initialOpen>{t("ui.stars")}</Section>
                        <Section data={planets} initialOpen>{t("ui.planets")}</Section>
                        <Section data={dwarfPlanets}>{t("ui.dwarf_planets")}</Section>
                        <Section data={satellites}>{t("ui.satellites")}</Section>
                        <Section data={spacecraft}>{t("ui.spacecraft")}</Section>
                        <Section data={asteroids}>{t("ui.asteroids")}</Section>
                        <Section data={comets}>{t("ui.comets")}</Section>
                        <Section data={belts}>{t("ui.others")}</Section>
                    </div>
                </When>

                {/* Footer Back Button */}
                <div className="pt-3 mt-2 border-t border-panel-border">
                    <button
                        onClick={handleBack}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card-bg hover:bg-accent/10 border border-panel-border hover:border-accent/40 text-secondary hover:text-highlight text-xs font-semibold transition-all group cursor-pointer"
                    >
                        <IoArrowBack className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span>{t("ui.back_to_milky_way", "Kembali ke Bima Sakti")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;