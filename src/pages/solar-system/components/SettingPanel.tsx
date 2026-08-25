import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"

import { IoIosSettings } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { ControlContext } from "../context";
import { SCALE, TIME_SCALE } from "../constant";

interface Props {
    isOpen: boolean
    close: () => void
}

const SettingModal = ({ isOpen, close }: Props) => {

    const { sizeScale, distanceScale, speedScale, showOrbitLine, focusIndex, setControl } = useContext(ControlContext)
    const { t, i18n } = useTranslation()

    const setOrbitLine = () => {
        setControl({ showOrbitLine: !showOrbitLine })
    }

    const isModified = () => {
        console.log(sizeScale, distanceScale, speedScale, SCALE, TIME_SCALE, showOrbitLine)
        if (sizeScale !== SCALE) return true
        if (distanceScale !== SCALE) return true
        if (speedScale !== TIME_SCALE) return true
        if (!showOrbitLine) return true

        return false
    }

    const reset = () => {
        setControl({
            focusIndex: 0,
            sizeScale: SCALE,
            distanceScale: SCALE,
            speedScale: TIME_SCALE,
            showOrbitLine: true
        })
    }

    const handleControl = (data: object) => {
        setControl({ ...data, focusIndex: focusIndex + 1 })
    }

    if (!isOpen) return null
    return <div className="w-sm fixed left-1/2 top-1/4 -translate-x-1/2 p-4 bg-black/50 backdrop-blur-sm text-white rounded-md z-100">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-white/25">
            <h5 className="text-lg font-bold mr-auto">{t("ui.setting")}</h5>
            {isModified() ? <VscDebugRestart onClick={reset} className="cursor-pointer size-5" /> : null}
            <MdClose onClick={close} className="cursor-pointer size-6" />
        </div>
        <div className="text-gray-300 flex flex-col gap-4">
            <button className="flex items-center justify-between w-full text-left" onClick={setOrbitLine}>
                <label className="cursor-pointer">{t("ui.show_orbit_line")}</label>
                {showOrbitLine ? <ImCheckboxChecked className="cursor-pointer" /> : <ImCheckboxUnchecked className="cursor-pointer" />}
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
           focus:outline-none focus:ring-2 focus:ring-indigo-500
           [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:rounded-lg
           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
           [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
           focus:outline-none focus:ring-2 focus:ring-indigo-500
           [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:rounded-lg
           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
           [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
           focus:outline-none focus:ring-2 focus:ring-indigo-500
           [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:rounded-lg
           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
           [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
                />
            </div>
            <div className="border-t border-white/20 pt-3">
                <div className="flex items-center justify-between w-full">
                    <label>{t("ui.language")}</label>
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="bg-black/60 text-white rounded-md px-3 py-1 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                    >
                        <option value="en" className="bg-neutral-900">English</option>
                        <option value="id" className="bg-neutral-900">Indonesia</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
}
const SettingPanel = () => {
    const [isOpen, setOpen] = useState(false)
    const { t } = useTranslation()

    return <>
        <button onClick={() => setOpen(!isOpen)} className="flex items-center gap-2 fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-md z-50 py-2 px-4">
            <IoIosSettings />
            {t("ui.setting")}
        </button>

        <SettingModal isOpen={isOpen} close={() => setOpen(false)} />
    </>
}

export default SettingPanel