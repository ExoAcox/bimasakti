import { useEffect } from "react";
import type { CelestialObject, Planet, Star } from "@types";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import { FaArrowRight, FaCompass, FaEye } from "react-icons/fa";
import {
    TbRotateClockwise,
    TbRotate360,
    TbRulerMeasure,
    TbArrowsHorizontal,
    TbPlanet,
    TbMoonStars,
} from "react-icons/tb";
import { Link } from "react-router";
import { auLengthFormat, lengthFormat, timeFormat, useCelestial } from "@function";
import clsx from "clsx";
import ModalObjectViewer from "./ModalObjectViewer";

interface Props {
    data: CelestialObject;
    onClose: () => void;
}

const ModalObject = ({ data, onClose }: Props) => {
    const { t } = useTranslation();
    const celestial = useCelestial();

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const targetUniverse = celestial.getUniverseByObjectId(data.id);
    const distance = (data as Star).barycenterDistance ?? 0 + data.distance

    const childCount =
        "childCount" in data && data.childCount
            ? data.childCount
            : "satellites" in data && Array.isArray((data as Planet).satellites)
                ? (data as Planet).satellites!.length
                : "planets" in data && Array.isArray((data as Star).planets)
                    ? (data as Star).planets!.length
                    : undefined;


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-fit max-w-[90dvw] max-h-[70dvh] overflow-y-auto rounded-3xl bg-background border border-panel-border p-5 sm:p-7 flex gap-6 shadow-panel scrollbar-thin"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 size-9 rounded-full bg-card-bg border border-panel-border hover:border-tertiary/50 text-secondary hover:text-primary hover:bg-card-hover flex items-center justify-center transition-all cursor-pointer"
                    aria-label={t("ui.close")}
                >
                    <MdClose className="size-5" />
                </button>

                {/* 3D Interactive Preview */}
                <ModalObjectViewer data={data} />

                {/* Header Information */}
                <div className="flex flex-col gap-4 max-w-100">
                    <div className="flex items-center gap-4 pr-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-space-grotesk font-semibold w-fit uppercase tracking-wider px-2.5 py-1 rounded-full bg-card-bg text-highlight border border-panel-border">
                                {"class" in data && data.class
                                    ? t(`class.${data.class}`, { defaultValue: String(data.class) })
                                    : t(`ui.${data.type}`, { defaultValue: data.type })}
                            </span>
                            <h3 className="text-2xl font-bold font-space-grotesk text-primary">
                                {t(`object.${data.id}.name`)}
                            </h3>
                            {data.parent && (
                                <span className="text-xs text-tertiary">
                                    {t("ui.parent_body")}:{" "}
                                    <span className="font-semibold text-secondary">
                                        {t(`object.${data.parent}.name`, { defaultValue: data.parent })}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description Body */}
                    <div className="overflow-y-auto pr-2 scrollbar-thin max-h-36">
                        <p className="text-sm text-secondary leading-relaxed">
                            {t(`object.${data.id}.description`)}
                        </p>
                    </div>

                    {/* Telemetry Matrix Grid */}
                    <div id="detail-telemetry-section" className="pt-2">
                        <div className="flex flex-wrap gap-2">
                            {Boolean(data.rotate_duration) && (
                                <div
                                    className={clsx(
                                        data.orbit_duration ? "min-w-[45%]" : "min-w-[70%]",
                                        "flex-1 p-2.5 rounded-xl bg-card-bg hover:bg-card-hover border border-panel-border-subtle transition-colors"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5 text-yellow mb-1">
                                        <TbRotateClockwise className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">
                                            {t("ui.rotation_period")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-primary tracking-tight">
                                        {timeFormat(data.rotate_duration)}
                                    </div>
                                </div>
                            )}

                            {Boolean(data.orbit_duration) && (
                                <div
                                    className={clsx(
                                        data.rotate_duration ? "min-w-[45%]" : "min-w-[70%]",
                                        "flex-1 p-2.5 rounded-xl bg-card-bg hover:bg-card-hover border border-panel-border-subtle transition-colors"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5 text-blue mb-1">
                                        <TbRotate360 className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">
                                            {t("ui.orbital_period")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-primary tracking-tight">
                                        {data.orbit_duration && data.rotate_duration === data.orbit_duration
                                            ? "Tidally Locked"
                                            : timeFormat(data.orbit_duration)}
                                    </div>
                                </div>
                            )}

                            {Boolean(data.radius) && (
                                <div className="flex-1 min-w-[35%] p-2.5 rounded-xl bg-card-bg hover:bg-card-hover border border-panel-border-subtle transition-colors">
                                    <div className="flex flex-1 items-center gap-1.5 text-accent mb-1">
                                        <TbRulerMeasure className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary">
                                            {t("ui.diameter")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-primary tracking-tight">
                                        {lengthFormat(data.radius * 2)}
                                    </div>
                                </div>
                            )}

                            {Boolean(childCount) && (
                                <div className="flex-1 p-2.5 rounded-xl bg-card-bg hover:bg-card-hover border border-panel-border-subtle transition-colors">
                                    <div className="flex items-center gap-1.5 text-red mb-1">
                                        {data.type === "star" ? (
                                            <TbPlanet className="size-3.5" />
                                        ) : (
                                            <TbMoonStars className="size-3.5" />
                                        )}
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary truncate">
                                            {data.type === "star" ? t("ui.planets", "Planets") : t("ui.moons", "Moons")}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-primary tracking-tight">
                                        {childCount}
                                    </div>
                                </div>
                            )}

                            {Boolean(data.distance) && (
                                <div className="flex-1 p-2.5 min-w-[60%] col-span-2 rounded-xl bg-card-bg hover:bg-card-hover border border-panel-border-subtle transition-colors">
                                    <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                                        <TbArrowsHorizontal className="size-3.5" />
                                        <span className="text-[10px] uppercase font-semibold tracking-wider text-tertiary truncate">
                                            {t("ui.distance_from", { object: data.parent ? t(`object.${data.parent}.name`) : t("ui.barycenter") })}
                                        </span>
                                    </div>
                                    <div className="font-space-grotesk text-xs sm:text-sm font-bold text-primary tracking-tight">
                                        {lengthFormat(distance)}
                                        {auLengthFormat(distance) ? (
                                            <>
                                                <span className="mx-2.5">·</span>
                                                {auLengthFormat(distance)}
                                            </>
                                        ) : ""}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <Link
                            to={`/${targetUniverse}?focus=${data.id}`}
                            onClick={onClose}
                            className="w-full flex-1 group flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider bg-accent hover:bg-highlight text-slate-950 shadow-glow transition-all"
                        >
                            <FaCompass className="size-3.5" />
                            <span>{t("ui.explore_in_3d")}</span>
                            <FaArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {data.liveview && (
                            <Link
                                to={`/liveview/${data.id}`}
                                onClick={onClose}
                                className="w-full sm:w-auto px-5 py-3 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider bg-red/15 hover:bg-red/25 text-red border border-red/40 flex items-center justify-center gap-2 transition-all"
                            >
                                <FaEye className="size-3.5" />
                                <span>{t("ui.surface_liveview")}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalObject;