import { useContext } from "react"
import { useTranslation } from "react-i18next"

import { IoIosSettings } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { ControlContext } from "../context";
import { SCALE, TIME_SCALE } from "../constant";
import clsx from "clsx";

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

    const { sizeScale, distanceScale, speedScale, showOrbitLine, ignoreAxis, pauseOrbitWhenFocus, focusIndex, setControl } = useContext(ControlContext)
    const { t, i18n } = useTranslation()



    const isModified = () => {
        console.log(sizeScale, distanceScale, speedScale, SCALE, TIME_SCALE, showOrbitLine)
        if (sizeScale !== SCALE) return true
        if (distanceScale !== SCALE) return true
        if (speedScale !== TIME_SCALE) return true
        if (!showOrbitLine) return true
        if (ignoreAxis) return true
        if (!pauseOrbitWhenFocus) return true

        return false
    }

    const reset = () => {
        setControl({
            focusIndex: 0,
            sizeScale: SCALE,
            distanceScale: SCALE,
            speedScale: TIME_SCALE,
            showOrbitLine: true,
            ignoreAxis: false,
        })
    }

    const setOrbitLine = () => {
        setControl({ showOrbitLine: !showOrbitLine })
    }

    const setIgnoreAxis = () => {
        setControl({ ignoreAxis: !ignoreAxis, focusIndex: focusIndex + 1 })
    }

    const setPauseOrbitWhenFocus = () => {
        setControl({ pauseOrbitWhenFocus: !pauseOrbitWhenFocus })
    }

    const handleControl = (data: object) => {
        setControl({ ...data, focusIndex: focusIndex + 1 })
    }

    if (!isOpen) return null
    return <div className="w-sm fixed left-1/2 top-1/4 -translate-x-1/2 p-4 bg-background backdrop-blur-sm text-primary rounded-md z-100">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-divider">
            <h5 className="text-lg font-bold mr-auto">{t("ui.setting")}</h5>
            {isModified() ? <VscDebugRestart onClick={reset} className="cursor-pointer size-5" /> : null}
            <MdClose onClick={close} className="cursor-pointer size-6" />
        </div>
        <div className="text-secondary flex flex-col gap-4">
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
                    onChange={(e) => setControl({ speedScale: Number(e.target.value) })}
                    className="slider"
                />
            </div>
            <div className="flex items-center justify-between w-full">
                <label>{t("ui.language")}</label>
                <div className="flex gap-4">
                    {languages.map(language => {
                        return <img src={`/solar-system/icons/${language.icon}`} alt={language.label} className={clsx("py-0.5 px-1 cursor-pointer border rounded-sm", i18n.language === language.id ? "border-accent" : "border-transparent")} onClick={() => i18n.changeLanguage(language.id)} />
                    })}
                </div>
            </div>
        </div>
    </div>
}
const SettingPanel = () => {
    const { showSetting, setControl } = useContext(ControlContext)
    const { t } = useTranslation()

    return <>
        <button onClick={() => setControl({ showSetting: !showSetting })} className="flex items-center gap-2 fixed bottom-4 left-4 bg-background backdrop-blur-sm text-primary rounded-md z-50 py-2 px-4">
            <IoIosSettings />
            {t("ui.setting")}
        </button>

        <SettingModal isOpen={showSetting} close={() => setControl({ showSetting: false })} />
    </>
}

export default SettingPanel