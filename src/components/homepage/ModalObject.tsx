import { useEffect } from "react";
import type { CelestialObject } from "@types";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import { FaArrowRight, FaCompass, FaEye } from "react-icons/fa";
import { Link } from "react-router";
import { useCelestial } from "@function";

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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-lg rounded-3xl bg-slate-950/90 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(6,182,212,0.25)] flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 size-9 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Close details"
                >
                    <MdClose className="size-5" />
                </button>

                {/* Header Information */}
                <div className="flex items-start gap-4 pr-10">
                    <div className="size-16 sm:size-18 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center p-2.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0">
                        <img
                            src={`/icons/${data.icon || "earth.png"}`}
                            alt={data.id}
                            className="size-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-2xl sm:text-3xl font-bold font-space-grotesk text-white">
                                {t(`object.${data.id}.name`)}
                            </h3>
                            <span className="text-[10px] font-space-grotesk font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                {"class" in data && data.class
                                    ? t(`class.${data.class}`)
                                    : t(`ui.${data.type}`)}
                            </span>
                        </div>
                        {data.parent && (
                            <span className="text-xs text-slate-400">
                                {t("ui.parent_body")}:{" "}
                                <span className="font-semibold text-slate-200">
                                    {t(`object.${data.parent}.name`, { defaultValue: data.parent })}
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Description Body */}
                <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {t(`object.${data.id}.description`)}
                    </p>
                </div>

                {/* Telemetry Quick Specs */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                    {data.radius !== undefined && data.radius > 0 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-slate-400 text-[11px]">{t("ui.radius_km")}</span>
                            <span className="font-mono font-bold text-white text-sm">
                                {Number(data.radius).toLocaleString()} km
                            </span>
                        </div>
                    )}
                    {data.distance !== undefined && data.distance > 0 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-slate-400 text-[11px]">{t("ui.distance_km")}</span>
                            <span className="font-mono font-bold text-white text-sm">
                                {Number(data.distance).toLocaleString()} km
                            </span>
                        </div>
                    )}
                    {data.orbit_duration !== undefined && data.orbit_duration > 0 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-slate-400 text-[11px]">{t("ui.orbit_period_days")}</span>
                            <span className="font-mono font-bold text-white text-sm">
                                {data.orbit_duration} {t("ui.days")}
                            </span>
                        </div>
                    )}
                    {data.rotate_duration !== undefined && data.rotate_duration !== 0 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-slate-400 text-[11px]">{t("ui.rotation_period_days")}</span>
                            <span className="font-mono font-bold text-white text-sm">
                                {data.rotate_duration} {t("ui.days")}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Link
                        to={`/${targetUniverse}?focus=${data.id}`}
                        onClick={onClose}
                        className="w-full flex-1 group flex items-center justify-center gap-2.5 py-3 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider bg-linear-to-r from-accent to-sky-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all"
                    >
                        <FaCompass className="size-3.5" />
                        <span>{t("ui.explore_in_3d")}</span>
                        <FaArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {data.liveview && (
                        <Link
                            to={`/liveview/${data.id}`}
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center gap-2 transition-all"
                        >
                            <FaEye className="size-3.5" />
                            <span>{t("ui.surface_liveview")}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalObject;