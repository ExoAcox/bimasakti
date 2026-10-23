/* eslint-disable react-hooks/set-state-in-effect */
import { useCelestial } from "@function";
import type { CelestialObject } from "@types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSearch } from "react-icons/md";
import { FaCompass, FaChevronDown, FaChevronUp } from "react-icons/fa";
import clsx from "clsx";
import ModalObject from "./ModalObject";

type Category = "all" | "star" | "planet" | "satellite" | "spacecraft" | "other";

const Featured = () => {
    const [allData, setAllData] = useState<CelestialObject[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const { t } = useTranslation();
    const celestial = useCelestial();

    useEffect(() => {
        if (!allData.length) {
            setAllData(celestial.getFeaturedObjects(1000));
        }
    }, [celestial, allData.length]);

    // Categories definition
    const categories: { id: Category; labelKey: string }[] = [
        { id: "all", labelKey: "ui.all" },
        { id: "star", labelKey: "ui.stars" },
        { id: "planet", labelKey: "ui.planets" },
        { id: "satellite", labelKey: "ui.satellites" },
        { id: "spacecraft", labelKey: "ui.spacecraft" },
    ];

    // Filter by Category and Search Query
    const filteredData = useMemo(() => {
        return allData.filter((item) => {
            if (!item) return false;

            // Category filter
            if (activeCategory === "star" && item.type !== "star") return false;
            if (activeCategory === "planet" && item.type !== "planet") return false;
            if (activeCategory === "satellite" && item.type !== "satellite") return false;
            if (
                activeCategory === "spacecraft" &&
                !["spacecraft-orbiter", "spacecraft-flyby"].includes(item.type)
            ) {
                return false;
            }

            // Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const name = t(`object.${item.id}.name`, { defaultValue: item.id }).toLowerCase();
                const desc = t(`object.${item.id}.description`, { defaultValue: "" }).toLowerCase();
                return name.includes(query) || desc.includes(query) || item.id.includes(query);
            }

            return true;
        });
    }, [allData, activeCategory, searchQuery, t]);

    const displayedData = isExpanded ? filteredData : filteredData.slice(0, 24);

    return (
        <section id="featured" className="my-20 md:my-28 px-4 sm:px-6">
            <div className="relative rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-space-grotesk text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest mb-3">
                            <FaCompass className="size-3" />
                            <span>{t("ui.celestial_catalog")}</span>
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-black font-space-grotesk text-white">
                            {t("ui.featured_objects")}
                        </h3>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("ui.search_celestial")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                </div>

                {/* Filter Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3  mt-6 mb-4 sm:mt-8 sm:mb-6 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-space-grotesk font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                                activeCategory === cat.id
                                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                            )}
                        >
                            {t(cat.labelKey)}
                        </button>
                    ))}
                    <span className="ml-auto text-xs font-mono text-slate-500 hidden sm:inline">
                        {filteredData.length} {t("ui.objects")}
                    </span>
                </div>

                {/* Chips Grid */}
                <div className="flex flex-wrap items-center gap-3">
                    {displayedData.map((object) => {
                        return (
                            <button
                                key={object.id}
                                onClick={() => setSelectedObject(object)}
                                className="group relative bg-white/5 hover:bg-cyan-950/40 border border-white/10 hover:border-accent/60 rounded-full pl-2.5 pr-4 py-2 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-left"
                            >
                                {/* <div className="size-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center p-0.5 group-hover:border-accent transition-colors"> */}
                                <img
                                    className="size-5 object-contain"
                                    src={`/icons/${object.icon || "earth.png"}`}
                                    alt={object.id}
                                />
                                {/* </div> */}
                                <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                                    {t(`object.${object.id}.name`)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Show More / Show Less Button */}
                {filteredData.length > 24 && (
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-space-grotesk font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                            <span>{isExpanded ? t("ui.show_less") : t("ui.show_more")}</span>
                            {isExpanded ? <FaChevronUp className="size-3" /> : <FaChevronDown className="size-3" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Object Detail Modal */}
            {selectedObject && (
                <ModalObject
                    data={selectedObject}
                    onClose={() => setSelectedObject(null)}
                />
            )}
        </section>
    );
};

export default Featured;