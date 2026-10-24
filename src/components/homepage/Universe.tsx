import { universes } from "@constants";
import { PlanetClass, type Universe as UniverseType } from "@types";
import clsx from "clsx";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FaArrowRight, FaCompass, FaRegStar } from "react-icons/fa";
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

                {/* Quick Specs Pill */}
                {/* {meta && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-slate-300">
                        <span className="truncate">{meta.category}</span>
                        <span className="text-cyan-300/90 font-mono text-[10px]">{meta.specs}</span>
                    </div>
                )} */}
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
                        <When condition={id !== "milky_way"}>
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

const Universe = () => {
    const { t } = useTranslation();

    return (
        <section id="systems">
            <div className="mb-10 sm:mb-14 max-w-3xl flex flex-col items-center mx-auto">
                {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-space-grotesk text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest mb-3">
                    <FaCompass className="size-3" />
                    <span>{t("ui.cosmic_destinations")}</span>
                </div> */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 ">
                <Card id="milky_way" className="lg:col-span-4 lg:row-span-2" imgClassName="h-[240px] lg:h-full" />
                <Card id="solar_system" className="lg:col-span-8" imgClassName="h-[240px] lg:h-[320px]" />
                <Card id="alpha_centauri" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="trappist-1" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="toi-700" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="copernicus" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="lich" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="kepler-32" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="wasp-47" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="rho_coronae_borealis" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="nu_scorpii" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="hd_110067" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
                <Card id="cervantes" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
            </div>
        </section>)
}

export default Universe