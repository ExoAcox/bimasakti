import { FaArrowRight } from "react-icons/fa";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";

//  <div className="absolute -top-24 -left-24 size-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
//                 <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

const Description = () => {
    const { t } = useTranslation();

    return (
        <section id="overview" className="relative z-10 mb-16 mt-4">
            {/* Main Narrative Glass Card
            <div className="relative rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
 */}

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-space-grotesk font-semibold text-white leading-snug mb-10">
                    <Trans
                        i18nKey="ui.home_description"
                        components={{
                            highlight: (
                                <span className="font-extrabold bg-linear-to-b from-primary to-highlight bg-clip-text text-transparent" />
                            ),
                        }}
                    >
                        The Indonesian name for the{" "}
                        <span className="font-extrabold bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
                            Milky Way
                        </span>
                        , our home galaxy, a vast universe of stars, planets, and endless possibilities waiting to be explored.
                    </Trans>
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        to="/milky_way"
                        className="w-full max-w-96 sm:w-96 md:w-auto group flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-space-grotesk font-bold text-sm tracking-wide bg-white text-slate-950 hover:bg-cyan-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                    >
                        <span>{t("ui.explore_milky_way")}</span>
                        <FaArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/solar_system"
                        className="w-full max-w-96 sm:w-96 md:w-auto group flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-space-grotesk font-bold text-sm tracking-wide bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 hover:border-accent/60 transition-all"
                    >
                        <span>{t("ui.explore_solar_system")}</span>
                        <FaArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>


            {/* </div> */}
        </section>
    );
};

export default Description;