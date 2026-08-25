import { useContext, useState } from "react"

import { IoIosSettings } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { ControlContext } from "../context";
import { SCALE } from "../constant";

interface Props {
    isOpen: boolean
    close: () => void
}

const SettingModal = ({ isOpen, close }: Props) => {

    const { sizeScale, distanceScale, speedScale, showOrbitLine, setControl } = useContext(ControlContext)

    const setOrbitLine = () => {
        setControl({ showOrbitLine: !showOrbitLine })
    }

    if (!isOpen) return null
    return <div className="w-sm fixed left-1/2 top-1/4 -translate-x-1/2 p-4 bg-black/50 backdrop-blur-sm text-white rounded-md z-100">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/25">
            <h5 className="text-lg font-bold">Setting</h5>
            <MdClose onClick={close} className="cursor-pointer size-6" />
        </div>
        <div className="text-gray-300 flex flex-col gap-2">
            <button className="flex items-center justify-between w-full" onClick={setOrbitLine}>
                <label>Show Orbit Line</label>
                {showOrbitLine ? <ImCheckboxChecked className="cursor-pointer" /> : <ImCheckboxUnchecked className="cursor-pointer" />}
            </button>
            <div>
                <div className="flex items-center justify-between w-full">
                    <label>Size Scale</label>
                    <span>1:{sizeScale.toLocaleString()} km</span>
                </div>
                <input
                    id="price-range"
                    type="range"
                    step={10000}
                    min={SCALE / 10}
                    max={SCALE}
                    value={sizeScale}
                    onChange={(e) => setControl({ sizeScale: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
           focus:outline-none focus:ring-2 focus:ring-indigo-500
           [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:rounded-lg
           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
           [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
                />
            </div>
            <div>
                <div className="flex items-center justify-between w-full">
                    <label>Distance from Sun Scale</label>
                    <span>1:{distanceScale.toLocaleString()} km</span>
                </div>
                <input
                    id="price-range"
                    type="range"
                    step={10000}
                    min={SCALE}
                    max={SCALE * 50}
                    value={distanceScale}
                    onChange={(e) => setControl({ distanceScale: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
           focus:outline-none focus:ring-2 focus:ring-indigo-500
           [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:rounded-lg
           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
           [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
                />
            </div>
            <div className="flex items-center justify-between w-full">
                <label>Speed Scale</label>
                <span>{60 / speedScale} seconds:1 day</span>
            </div>
        </div>
    </div>
}
const SettingPanel = () => {
    const [isOpen, setOpen] = useState(false)

    return <>
        <button onClick={() => setOpen(!isOpen)} className="flex items-center gap-2 fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-md z-50 py-2 px-4">
            <IoIosSettings />
            Setting
        </button>

        <SettingModal isOpen={isOpen} close={() => setOpen(false)} />
    </>
}

export default SettingPanel