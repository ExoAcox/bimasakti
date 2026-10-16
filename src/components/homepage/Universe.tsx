import { universes } from "@constants";
import type { Universe as UniverseType } from "@types";
import clsx from "clsx";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FaArrowRight, FaCompass } from "react-icons/fa";

interface Props {
    id: string;
    className?: string;
    imgClassName?: string;
    badge?: string;
    specs?: string;
}

const systemMeta: Record<string, { badge: string; category: string; specs: string }> = {
    milky_way: {
        badge: "Home Galaxy",
        category: "Barred Spiral",
        specs: "100,000 ly diameter",
    },
    solar_system: {
        badge: "Home System",
        category: "Planetary System",
        specs: "8 Planets • 1 Star",
    },
    alpha_centauri: {
        badge: "Nearest System",
        category: "Triple Star System",
        specs: "4.37 ly from Earth",
    },
    "trappist-1": {
        badge: "Exoplanet System",
        category: "Ultra-cool Red Dwarf",
        specs: "7 Earth-sized Worlds",
    },
    "toi-700": {
        badge: "Habitable Zone",
        category: "M-Dwarf System",
        specs: "4 Exoplanets • 101.4 ly",
    },
    copernicus: {
        badge: "Binary System",
        category: "55 Cancri System",
        specs: "5 Exoplanets • 41 ly",
    },
    lich: {
        badge: "Pulsar System",
        category: "PSR B1257+12",
        specs: "Pulsar Planets • 2,300 ly",
    },
};

const Card = ({ id, className, imgClassName }: Props) => {
    const { t } = useTranslation();
    const data = universes.find((universe) => universe.id === id) as UniverseType;
    const meta = systemMeta[id];

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
                <h4 className="text-lg sm:text-xl font-bold font-space-grotesk text-white group-hover:text-cyan-300 transition-colors">
                    {t(`object.${id}.title`)}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {t(`object.${id}.description`)}
                </p>

                {/* CTA Action */}
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                        {data?.assetCount ? `${data.assetCount} 3D Assets` : "Simulated"}
                    </span>
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
    return (
        <section id="systems" className="my-20 md:my-28 px-4 sm:px-6">
            <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-space-grotesk text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest mb-3">
                    <FaCompass className="size-3" />
                    <span>Cosmic Destinations</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-space-grotesk text-white mb-4 tracking-tight">
                    <Trans
                        i18nKey="ui.universe_section_title"
                        components={{ br: <br className="hidden sm:inline" /> }}
                    >
                        Explore the Members of <br className="hidden sm:inline" /> Milky Way Family
                    </Trans>
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    Dive into our galactic neighborhood, from our familiar Solar System to exotic triple star systems, habitable zone exoplanets, and dead pulsar worlds.
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
            </div>
        </section>)
}

export default Universe