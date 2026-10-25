import { getUniverseById, useCelestial } from "@function"
import { defaultSetting, useSettingStore, useGalaxyStore } from "@state"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { IoArrowForward, IoArrowBack, IoPlanetOutline } from "react-icons/io5"
import { MdClose } from "react-icons/md"
import { When } from "react-if"

const NavigationPanel = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { focus, reset } = useGalaxyStore()
    const universe = useCelestial().getUniverse()
    const id = universe.id === "milky_way" ? focus : universe.id

    const data = getUniverseById(id!)
    const { setSetting } = useSettingStore()

    const isGalaxy = universe.id === "milky_way"

    const backText = () => {
        if (isGalaxy) {
            return t("ui.enter_system", { name: t(`object.${data?.id}.name`) })
        } else {
            return t("ui.back_to_milky_way", "Kembali ke Bima Sakti")
        }
    }

    const handleClick = () => {
        if (isGalaxy) {
            navigate(`/${focus}`)
        } else {
            reset()
            navigate(`/milky_way`)
        }

        setSetting(defaultSetting)
    }

    useEffect(() => {
        const navigationPanel = document.getElementById("navigation-panel")
        if (!navigationPanel) return

        navigationPanel.style.visibility = focus ? "visible" : "hidden"
    }, [id, focus])

    if (!data) return null

    return (
        <div
            id="navigation-panel"
            className="invisible fixed left-1/2 -translate-x-1/2 bottom-5 w-[calc(100vw-2rem)] md:w-auto md:min-w-lg md:max-w-xl flex flex-col text-sm bg-panel-bg backdrop-blur-2xl border border-panel-border rounded-2xl p-5 z-50 text-primary"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col flex-wrap gap-4 gap-y-1 min-w-0">
                        {/* <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border font-medium text-accent bg-accent/10 border-accent/20">
                                <IoPlanetOutline className="size-3" />
                                {t("ui.system", "Sistem Bintang")}
                            </span>
                        </div> */}
                        <h1 className="text-lg sm:text-xl font-bold font-space-grotesk tracking-tight text-primary truncate">
                            {t(`object.${data?.id}.name`)}
                        </h1>

                        <When condition={data.distanceFromEarth}>
                            <span className="text-cyan-300/90 font-mono text-[10px]">{data.distanceFromEarth} light years from earth</span>
                        </When>
                    </div>

                    {isGalaxy && (
                        <button
                            onClick={reset}
                            className="p-1.5 rounded-xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 text-secondary hover:text-primary transition-all cursor-pointer shrink-0"
                            title={t("ui.close", "Tutup")}
                        >
                            <MdClose className="size-4" />
                        </button>
                    )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-secondary leading-relaxed border-t border-panel-border pt-3">
                    {t(`object.${data?.id}.description`)}
                </p>

                {/* Action CTA Button */}
                <button
                    className="w-full flex items-center justify-center gap-2 font-semibold font-space-grotesk text-xs sm:text-sm bg-accent/20 hover:bg-accent/30 border border-accent/40 hover:border-accent/70 text-highlight py-2.5 px-4 rounded-xl active:scale-[0.98] transition cursor-pointer group mt-1"
                    onClick={handleClick}
                >
                    {isGalaxy ? (
                        <>
                            <span>{backText()}</span>
                            <IoArrowForward className="size-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    ) : (
                        <>
                            <IoArrowBack className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span>{backText()}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default NavigationPanel