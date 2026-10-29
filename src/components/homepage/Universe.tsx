import { useState } from "react";
import { universes, universe_ids } from "@constants";
import { PlanetClass, type Universe as UniverseType } from "@types";
import clsx from "clsx";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FaArrowRight, FaRegStar, FaChevronUp } from "react-icons/fa";
import { IoPlanetOutline } from "react-icons/io5";
import { When } from "react-if";

interface Props {
    id: string;
    className?: string;
    imgClassName?: string;
    badge?: string;
    specs?: string;
}


const Card = ({ id, className, imgClassName }: Props) => {
    const { t } = useTranslation();
    const data = universes.find((universe) => universe.id === id) as UniverseType;

    const starCount = data.stars.length
    const planetCount = data.stars.reduce((acc, star) => acc + star.planets.filter(planet => planet.class !== PlanetClass.Dwarf).length, 0)

    return (
        <div
            className={clsx(
                "group relative rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 hover:border-accent/50 hover:shadow-[0_10px_35px_rgba(6,182,212,0.2)] p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden",
                className
            )}
        >
            {/* Top Image Container */}
            <div className="relative rounded-xl h-full overflow-hidden mb-4 bg-slate-900 border border-white/5">
                <img
                    alt={id}
                    src={`/images/${data.image}`}
                    loading="lazy"
                    className={clsx(
                        "object-cover w-full group-hover:scale-105 transition-transform duration-500",
                        imgClassName
                    )}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

                {/* System Category Badge */}
                {/* {meta && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-space-grotesk font-bold tracking-wider uppercase bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
                            {meta.badge}
                        </span>
                    </div>
                )} */}

                <When condition={data.distanceFromEarth}>
                    <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[11px] font-medium text-slate-300">
                        <span className="truncate"></span>
                        <span className="text-cyan-300/90 font-mono text-[10px]">{data.distanceFromEarth} light years from earth</span>
                    </div>
                </When>
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-2">
                <h4 className="text-lg sm:text-xl font-bold font-space-grotesk text-primary group-hover:text-highlight transition-colors">
                    {t(`object.${id}.title`)}
                </h4>
                <p className="text-xs sm:text-sm text-tertiary line-clamp-3 leading-relaxed mb-4">
                    {t(`object.${id}.description`)}
                </p>

                {/* CTA Action */}
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-tertiary">
                        <span className="flex items-center gap-1">
                            <FaRegStar className="size-3 -mt-0.75 shrink-0" />
                            <When condition={id === "milky_way"}>
                                <span>{universes.filter(universe => universe.id !== "milky_way").length} {t("ui.systems")}</span>
                            </When>
                            <When condition={id !== "milky_way"}>
                                <span>{starCount} {starCount === 1 ? t("ui.star") : t("ui.stars")}</span>
                            </When>
                        </span>
                        <When condition={id === "sagittarius_a"}>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <IoPlanetOutline className="size-3 shrink-0" />
                                <span>1 {t("ui.blackhole", "Black Hole")}</span>
                            </span>
                        </When>
                        <When condition={id !== "milky_way" && id !== "sagittarius_a"}>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <IoPlanetOutline className="size-3 shrink-0" />
                                <span>{planetCount} {planetCount === 1 ? t("ui.planet") : t("ui.planets")}</span>
                            </span>
                        </When>
                    </div>
                    <Link
                        to={`/${id}`}
                        className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-space-grotesk font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 hover:border-accent transition-all duration-200"
                    >
                        <span>{t("ui.enter")}</span>
                        <FaArrowRight className="size-2.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const FEATURED_SYSTEMS = ["milky_way", "solar_system", "alpha_centauri", "sagittarius_a"];
const REMAINING_SYSTEMS = universe_ids.filter((id) => !FEATURED_SYSTEMS.includes(id));

const Universe = ({ standalone }: { standalone?: boolean }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section id="systems">
            <div className="mb-10 sm:mb-14 max-w-3xl flex flex-col items-center mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold font-space-grotesk leading-tight text-white mb-4 tracking-tight max-w-xs sm:max-w-md lg:max-w-xl">
                    <Trans
                        i18nKey="ui.universe_section_title"
                        components={{ br: <br className="hidden sm:inline" /> }}
                    >
                        Explore the Members of <br className="hidden sm:inline" /> Milky Way Family
                    </Trans>
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-center">
                    {t("ui.universe_section_desc")}
                </p>
                <div className="h-px w-24 bg-linear-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                <Card id="milky_way" className="lg:col-span-4 lg:row-span-2" imgClassName="h-[240px] lg:h-full" />
                <Card id="solar_system" className="lg:col-span-8" imgClassName="h-[240px] lg:h-[320px]" />
                <Card id="alpha_centauri" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="sagittarius_a" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />

                <When condition={isExpanded || standalone}>
                    {REMAINING_SYSTEMS.map((id) => (
                        <Card
                            key={id}
                            id={id}
                            className="lg:col-span-4"
                            imgClassName="h-[240px] lg:h-full"
                        />
                    ))}
                </When>
            </div>

            <When condition={!standalone}>
                <When condition={!isExpanded}>
                    <div className="mt-4 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 hover:border-accent/40 p-5 sm:p-6 transition-all duration-300 shadow-panel group relative overflow-hidden">
                        {/* Ambient Glow */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/15 transition-colors" />

                        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                            {/* Left Info: Radar Badge, Title, Desc */}
                            <div className="flex flex-col gap-2 max-w-xl">
                                <h4 className="text-xl sm:text-2xl font-bold font-space-grotesk text-primary group-hover:text-highlight transition-colors">
                                    {t("ui.systems_waiting_title", { count: REMAINING_SYSTEMS.length })}
                                </h4>

                                <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
                                    {t("ui.systems_waiting_desc")}
                                </p>
                            </div>

                            {/* Right: Stacked Thumbnails & Unfold Button */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full xl:w-auto justify-between xl:justify-end">
                                {/* Overlapping Thumbnails */}
                                <div className="flex items-center -space-x-3 py-1">
                                    {REMAINING_SYSTEMS.slice(0, 5).map((cardId) => {
                                        const u = universes.find((item) => item.id === cardId);
                                        if (!u) return null;
                                        return (
                                            <img
                                                key={cardId}
                                                src={`/images/${u.image}`}
                                                alt={cardId}
                                                className="size-11 sm:size-12 rounded-full object-cover shadow-md ring-white/10 hover:border-accent/40 transition-all hover:scale-110 hover:z-20"
                                                title={t(`object.${cardId}.title`)}
                                            />
                                        );
                                    })}
                                    <div className="size-11 sm:size-12 rounded-full bg-slate-900  flex items-center justify-center text-xs font-mono font-bold text-highlight shadow-md z-1">
                                        +{REMAINING_SYSTEMS.length - 5}
                                    </div>
                                </div>

                                <Link
                                    to={`/universe`}
                                    className="w-full sm:w-auto group/button inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 hover:border-accent transition-all cursor-pointer shrink-0"
                                >
                                    <span>{t("ui.unfold_catalog")}</span>
                                    <FaArrowRight className="size-3 group-hover/button:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </When>

                <When condition={isExpanded}>
                    <div className="mt-4 md:mt-8 flex justify-center">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-card-bg hover:bg-card-hover border border-panel-border  text-xs font-space-grotesk font-bold uppercase tracking-wider text-secondary hover:text-primary transition-all duration-300 shadow-panel cursor-pointer"
                        >
                            <span>{t("ui.show_less")}</span>
                            <FaChevronUp className="size-3 text-highlight group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </When>
            </When>
        </section>
    );
};

export default Universe