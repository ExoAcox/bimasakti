import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const LiveviewBanner = () => {
    const { t } = useTranslation();

    return (
        <section className="my-20 md:my-28 px-4 sm:px-6">
            <div className="relative rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/20 p-4 sm:p-8 md:p-12 xl:p-16 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                {/* Background Ambient Lighting */}
                <div className="absolute top-0 right-1/4 size-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 size-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 max-w-2xl mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-space-grotesk text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wider mb-3">
                        <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2 bg-rose-500"></span>
                        </span>
                        <span>{t("ui.surface_liveview")}</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black font-space-grotesk text-white mb-3">
                        {t("ui.liveview_title")}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        {t("ui.liveview_desc")}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mars Card */}
                    <div

                        className="group relative rounded-2xl bg-slate-950/70 border border-white/10 hover:border-rose-500/50 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img className="size-11" alt="mars" src="/icons/mars.png" />
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="text-xl font-bold font-space-grotesk text-white group-hover:text-rose-300 transition-colors">
                                        {t("ui.mars_surface_title")}
                                    </h4>
                                    <span className="text-xs text-slate-400">
                                        {t("ui.mars_surface_subtitle")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                            {t("ui.mars_surface_desc")}
                        </p>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-end">

                            <Link to="/liveview/mars" className="inline-flex items-center gap-2 text-xs mr-1 font-space-grotesk font-bold uppercase hover:text-rose-300 hover:translate-x-2 transition-transform">
                                <span>{t("ui.visit")} {t("ui.mars_liveview")}</span>
                                <FaArrowRight className="size-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Moon Card */}
                    <div
                        className="group grayscale relative rounded-2xl bg-slate-950/70 border border-white/10 hover:border-accent/50 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img className="size-11" alt="moon" src="/icons/moon.png" />
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="text-xl font-bold font-space-grotesk text-white group-hover:text-cyan-300 transition-colors">
                                        {t("ui.moon_surface_title")}
                                    </h4>
                                    <span className="text-xs text-slate-400">
                                        {t("ui.moon_surface_subtitle")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                            {t("ui.moon_surface_desc")}
                        </p>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-end">

                            <span className="inline-flex items-center gap-2 text-xs font-space-grotesk font-bold uppercase text-cyan-300 transition-transform">
                                <span>{t("ui.coming_soon")}</span>
                                {/* <FaArrowRight className="size-3" /> */}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveviewBanner;
