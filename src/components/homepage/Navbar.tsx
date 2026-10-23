import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import clsx from "clsx";
import { universes } from "@constants";

const languages = [
    { label: "English", id: "en", icon: "flag-english.png" },
    { label: "Indonesia", id: "id", icon: "flag-indonesia.png" },
    { label: "German", id: "de", icon: "flag-germany.png" },
];

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const currentLang = languages.find((lang) => lang.id === i18n.language) || languages[0];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const changeLang = (id: string) => {
        i18n.changeLanguage(id);
        setIsLangOpen(false);
    };

    return (
        <header
            className={clsx(
                "fixed group top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "backdrop-blur-xl bg-slate-950/75 border-b border-cyan-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "bg-transparent border-b border-transparent shadow-none"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="group-hover:rotate-360 transition-transform duration-1000">
                        <img src="/icons/logo.webp" className="size-10" />
                    </div>
                    <div className="flex flex-col group/title">
                        <span className="font-space-grotesk font-black text-xl tracking-wider text-white group-hover/title:text-cyan-300 transition-colors">
                            BIMASAKTI
                        </span>
                        <span className="text-[10px] tracking-wider text-slate-400 font-medium -mt-1">
                            {t("ui.universe_simulation")}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1 md:gap-2">
                    <Link
                        to="/milky_way"
                        className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {t("object.milky_way.title")}
                    </Link>
                    <Link
                        to="/solar_system"
                        className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {t("object.solar_system.title")}
                    </Link>

                    <div className="relative group/star">
                        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 group-hover/star:text-white transition-all">
                            {t("ui.star_system")}
                        </button>
                        <div className="absolute top-full left-0 mt-1  py-2 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/star:opacity-100 group-hover/star:visible transition-all duration-200">
                            {
                                universes.filter(universe => universe.id !== "milky_way").map(universe => {
                                    return (
                                        <Link
                                            to={`/${universe.id}`}
                                            className="flex items-center whitespace-nowrap justify-between px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-accent/20 transition-colors"
                                        >
                                            {t(`object.${universe.id}.name`)}
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className="relative group/live">
                        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 group-hover/live:text-white transition-all">
                            {t("ui.surface_liveview")}
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-full py-2 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover/live:opacity-100 group-hover/live:visible transition-all duration-200">
                            <Link
                                to="/liveview/mars"
                                className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-accent/20 transition-colors"
                            >
                                {t("ui.mars_liveview")}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Right Actions: Language Switcher + CTA */}
                <div className="flex items-center gap-3">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all"
                            title={t("ui.language")}
                        >
                            <img
                                src={`/icons/${currentLang.icon}`}
                                alt={currentLang.label}
                                className="size-4 object-contain rounded-xs"
                            />
                            <span className="uppercase">{currentLang.id}</span>
                            <IoGlobeOutline className="size-3.5 text-slate-400" />
                        </button>

                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 w-36 py-1.5 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => changeLang(lang.id)}
                                        className={clsx(
                                            "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-cyan-950/40 transition-colors",
                                            i18n.language === lang.id
                                                ? "text-accent font-bold bg-cyan-950/20"
                                                : "text-slate-300 hover:text-white"
                                        )}
                                    >
                                        <img
                                            src={`/icons/${lang.icon}`}
                                            alt={lang.label}
                                            className="size-4 object-contain rounded-xs"
                                        />
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Explore CTA */}
                    <Link
                        to="/milky_way"
                        className="hidden group/explore sm:flex items-center gap-2 px-5 py-2 rounded-xl font-space-grotesk font-bold text-xs uppercase tracking-wider bg-linear-to-r from-cyan-500 to-sky-400 hover:from-accent hover:to-sky-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <span>{t("ui.explore_now")}</span>
                        <FaArrowRight className="size-3 group-hover/explore:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
