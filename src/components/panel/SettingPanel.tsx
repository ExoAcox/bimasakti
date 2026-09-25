import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"

import { IoIosSettings } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { FaSpaceAwesome } from "react-icons/fa6";
import { useSettingStore, useControlStore, useShipStore, defaultSetting } from "@state";
import { SCALE, TIME_SCALE } from "@constants";
import clsx from "clsx";
import { TbEye } from "react-icons/tb";

interface Props {
    isOpen: boolean
    close: () => void
}

const languages = [
    { label: "English", id: "en", icon: "flag-english.png" },
    { label: "Indonesia", id: "id", icon: "flag-indonesia.png" },
    { label: "German", id: "de", icon: "flag-germany.png" },
]

const SettingModal = ({ isOpen, close }: Props) => {

    const { sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus, setSetting } = useSettingStore()
    const { focusIndex, setControl } = useControlStore()
    const { t, i18n } = useTranslation()



    const isModified = () => {
        if (sizeScale !== SCALE) return true
        if (distanceScale !== SCALE) return true
        if (speedScale !== TIME_SCALE) return true
        if (!showOrbitLine) return true
        if (ignoreAxis) return true
        if (!pauseOrbitWhenFocus) return true

        return false
    }

    const reset = () => {
        setSetting(defaultSetting)
    }

    const setOrbitLine = () => {
        setSetting({ showOrbitLine: !showOrbitLine })
    }

    const setIgnoreAxis = () => {
        setSetting({ ignoreAxis: !ignoreAxis })
        setControl({ focusIndex: focusIndex + 1 })
    }

    const setPauseOrbitWhenFocus = () => {
        setSetting({ pauseOrbitWhenFocus: !pauseOrbitWhenFocus })
    }

    const handleControl = (data: object) => {
        setSetting(data)
        setControl({ focusIndex: focusIndex + 1 })
    }

    if (!isOpen) return null
    return createPortal(
        <div className="w-sm fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 p-4 bg-background backdrop-blur-sm text-white rounded-md z-100">
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-divider">
                <h5 className="text-lg font-bold mr-auto">{t("ui.setting")}</h5>
                {isModified() ? <VscDebugRestart onClick={reset} className="cursor-pointer size-5" /> : null}
                <MdClose onClick={close} className="cursor-pointer size-6" />
            </div>
            <div className=" flex flex-col gap-4">
                <button className="flex items-center justify-between w-full text-left" onClick={setOrbitLine}>
                    <label className="cursor-pointer">{t("ui.show_orbit_line")}</label>
                    {showOrbitLine ? <ImCheckboxChecked className="cursor-pointer" /> : <ImCheckboxUnchecked className="cursor-pointer" />}
                </button>
                <button className="flex items-center justify-between w-full text-left" onClick={setIgnoreAxis}>
                    <label className="cursor-pointer">{t("ui.ignore_axis")}</label>
                    {ignoreAxis ? <ImCheckboxChecked className="cursor-pointer" /> : <ImCheckboxUnchecked className="cursor-pointer" />}
                </button>
                <button className="flex items-center justify-between w-full text-left" onClick={setPauseOrbitWhenFocus}>
                    <label className="cursor-pointer">{t("ui.pause_orbit_when_focus")}</label>
                    {pauseOrbitWhenFocus ? <ImCheckboxChecked className="cursor-pointer" /> : <ImCheckboxUnchecked className="cursor-pointer" />}
                </button>
                <div>
                    <div className="flex items-center justify-between w-full mb-1">
                        <label>{t("ui.size_scale")}</label>
                        <span>1:{sizeScale.toLocaleString()} km</span>
                    </div>
                    <input
                        id="size-scale-range"
                        type="range"
                        step={10000}
                        min={SCALE / 10}
                        max={SCALE}
                        value={sizeScale}
                        onChange={(e) => handleControl({ sizeScale: Number(e.target.value) })}
                        className="slider"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between w-full mb-1">
                        <label>{t("ui.distance_scale")}</label>
                        <span>1:{distanceScale.toLocaleString()} km</span>
                    </div>
                    <input
                        id="distance-scale-range"
                        type="range"
                        step={10000}
                        min={SCALE}
                        max={SCALE * 50}
                        value={distanceScale}
                        onChange={(e) => handleControl({ distanceScale: Number(e.target.value) })}
                        className="slider"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between w-full mb-1">
                        <label>{t("ui.speed_scale")}</label>
                        <span>{t("ui.speed_scale_value", { days: Math.ceil(speedScale / 60 * 10) / 10 })}</span>
                    </div>
                    <input
                        id="speed-scale-range"
                        type="range"
                        step={10}
                        min={TIME_SCALE}
                        max={TIME_SCALE * 100}
                        value={speedScale}
                        onChange={(e) => setSetting({ speedScale: Number(e.target.value) })}
                        className="slider"
                    />
                </div>
                <div className="flex items-center justify-between w-full">
                    <label>{t("ui.language")}</label>
                    <div className="flex gap-4">
                        {languages.map(language => {
                            return <img src={`/icons/${language.icon}`} alt={language.label} className={clsx("py-0.5 px-1 cursor-pointer border rounded-sm", i18n.language === language.id ? "border-primary" : "border-transparent")} onClick={() => i18n.changeLanguage(language.id)} />
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
const SettingPanel = () => {
    const { mode, setSetting } = useSettingStore()
    const { setControl } = useControlStore()
    const { cockpit, setShip } = useShipStore()
    const { t } = useTranslation()

    const handleSpaceship = () => {
        setSetting({ mode: "spaceship" })

        if (mode === "normal") {
            setControl({ rotateSpeed: 0.1 })
            setSetting({ mode: "spaceship" })
        } else {
            setControl({ rotateSpeed: 1 })
            setSetting({ mode: "normal" })
        }

    }

    return <div className="fixed bottom-12 right-6 flex flex-col items-center gap-3 z-40 bg-background backdrop-blur-md p-2 px-3 rounded-full border border-white/15 shadow-2xl shadow-cyan-950/40 hover:border-cyan-500/30 transition-all duration-300">
        {/* <button onClick={() => setSetting({ showSetting: !showSetting })} className="flex items-center gap-3 fixed bottom-4 left-4 rounded-md z-50 py-2 px-3">
            <IoIosSettings />
            {t("ui.setting")}
        </button> */}

        <div className={"panel-section flex-col gap-2"}>
            {mode === "spaceship" && (
                <button
                    onClick={() => setShip({ cockpit: !cockpit })}
                    className={clsx("panel-button", cockpit && "bg-cyan-500/30 text-cyan-300 border-cyan-500/60")}
                >
                    <TbEye />
                    <span className="panel-tooltip">{cockpit ? "3rd Person View (C)" : "Cockpit View (C)"}</span>
                </button>
            )}
            <button
                onClick={handleSpaceship}
                className={clsx("panel-button", mode === "spaceship" && "bg-cyan-500/20 text-cyan-300 border-cyan-500/40")}
            >
                <FaSpaceAwesome />
                <span className="panel-tooltip">Spaceship Mode</span>
            </button>

        </div>

        {/* <SettingModal isOpen={showSetting} close={() => setSetting({ showSetting: false })} /> */}
    </div>
}

export default SettingPanel