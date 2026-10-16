/* eslint-disable react-hooks/set-state-in-effect */

import clsx from "clsx"
import { useEffect, useState } from "react"
import { useGalaxyStore } from "@state"
import { useTranslation } from "react-i18next"
import { TbChevronLeft } from "react-icons/tb"
import { GiGalaxy } from "react-icons/gi"
import { IoPlanetOutline, IoArrowBack } from "react-icons/io5"
import { universe_ids } from "@constants"
import { useNavigate } from "react-router"
import { useMobile } from "@function"

const Sidebar = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const isMobile = useMobile()

    const [isOpen, setOpen] = useState(true)
    const { focus, setFocus } = useGalaxyStore()

    const handleClick = (id: string) => {
        setFocus(id)
    }

    const handleBack = () => {
        navigate("/")
    }

    useEffect(() => {
        if (isMobile) {
            setOpen(false)
        }
    }, [focus, isMobile])

    const data = universe_ids.filter(id => id !== "milky_way")

    return (
        <div className={clsx("fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300 max-w-dvw", !isOpen && "-translate-x-full")}>
            <button
                className="absolute top-4 -right-8 w-8 h-12 flex items-center justify-center bg-panel-bg backdrop-blur-2xl rounded-r-xl border border-l-0 border-panel-border cursor-pointer hover:bg-card-hover hover:border-accent/40 hover:text-highlight transition-all text-secondary group"
                onClick={() => setOpen(!isOpen)}
                title={isOpen ? t("ui.close_sidebar", "Tutup sidebar") : t("ui.open_sidebar", "Buka sidebar")}
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
                        <GiGalaxy className="size-4 text-accent" />
                        {t("object.milky_way.name", "Bima Sakti")}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium">
                        {data.length} {t("ui.systems", "Sistem")}
                    </span>
                </div>

                {/* Star Systems List */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {data.map(universe => {
                        const isFocus = focus === universe
                        return (
                            <button
                                key={universe}
                                className={clsx(
                                    "w-full py-2 px-2.5 flex items-center gap-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer group",
                                    isFocus
                                        ? "bg-cyan-500/15 border-accent/40 text-white font-semibold"
                                        : "bg-white/2 hover:bg-white/6 border-white/5 hover:border-white/10 text-secondary hover:text-white"
                                )}
                                onClick={() => handleClick(universe)}
                            >
                                <div
                                    className={clsx(
                                        "size-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
                                        isFocus
                                            ? "bg-cyan-500/20 border-accent/40 text-cyan-300"
                                            : "bg-white/5 border-white/10 text-tertiary group-hover:text-slate-200 group-hover:border-white/20"
                                    )}
                                >
                                    <IoPlanetOutline className="size-3.5" />
                                </div>
                                <span className="truncate flex-1">{t(`object.${universe}.name`)}</span>
                                {isFocus && <span className="size-1.5 rounded-full bg-accent animate-pulse ml-auto shrink-0" />}
                            </button>
                        )
                    })}
                </div>

                {/* Footer Back Button */}
                <div className="pt-3 mt-2 border-t border-panel-border">
                    <button
                        onClick={handleBack}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card-bg hover:bg-accent/10 border border-panel-border hover:border-accent/40 text-secondary hover:text-highlight text-xs font-semibold transition-all group cursor-pointer"
                    >
                        <IoArrowBack className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span>{t("ui.back_to_home", "Kembali ke Beranda")}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar