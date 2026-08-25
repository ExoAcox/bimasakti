import { useContext } from "react"
import { ControlContext } from "../context"
import { getObjectById } from "../function"
import type { Planet } from "../constant"

import { useTranslation } from "react-i18next";





const PanelDetail = () => {

    const { focus, setControl } = useContext(ControlContext)
    const data = getObjectById(focus)

    const parentPlanet = getObjectById(data?.parent) as Planet

    const { t } = useTranslation();


    if (!data) return null
    return <div className="flex flex-col fixed top-4 right-4 bottom-4 text-sm text-gray-300 bg-black/50 min-w-sm max-w-sm rounded-md pb-6 pt-4 px-7 z-50 backdrop-blur-sm max-h-dvh h-fit">
        <div>
            <div className="flex items-center gap-2 justify-between text-white">
                <h1 className="text-xl font-bold">{t(`object.${data?.id}.name`)}</h1>
                {data.icon ? <img src={`/solar-system/icons/${data.icon}`} className="size-10" /> : ""}
            </div>
            <p className="mt-4 leading-relaxed border-t border-white/25 pt-4">
                {t(`object.${data?.id}.description`)}
            </p>
            <div className="mt-4 text-sm text-gray-300 leading-relaxed border-t border-white/25 pt-4">
                <div className="flex justify-between items-center">
                    <span>Radius</span>
                    <span>{data.radius.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Rotation period</span>
                    <span>{data.rotate_duration.toLocaleString()} days</span>
                </div>

                {data.type !== "star" ? <div className="flex justify-between items-center">
                    <span>Orbital period</span>
                    <span>{data.orbit_duration.toLocaleString()} days</span>
                </div> : null}

                {data.type !== "star" ? <div className="flex justify-between items-center">
                    <span>Distance from {data.parent ? t(`object.${data.parent}.name`) : t("object.sun.name")}</span>
                    <span>{data.distance.toLocaleString()} km</span>
                </div> : null}
            </div>
            {
                data.type === "satellite" ? <div className="mt-4 mb-2 leading-relaxed border-t border-white/25 pt-4">
                    <label className="font-bold text-blue-300">Parent Planet</label>
                </div> : null
            }
            {
                data.type === "planet" && data.satellites.length ? <div className="mt-4 mb-2 leading-relaxed border-t border-white/25 pt-4">
                    <label className="font-bold text-blue-300">Natural Satellites</label>
                </div> : null
            }
        </div>

        <div className="flex-1 overflow-auto">
            {
                data.type === "satellite" ? <div>
                    <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: parentPlanet.id })}>
                        <img src={`/solar-system/icons/${parentPlanet.icon}`} className="size-6" alt={parentPlanet.icon} />
                        <span className="text-lg font-bold">{t(`object.${parentPlanet.id}.name`)}</span>
                    </button>

                    <div className="flex justify-between items-center">
                        <span>Radius</span>
                        <span>{parentPlanet.radius.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Rotation period</span>
                        <span>{parentPlanet.rotate_duration.toLocaleString()} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Orbital period</span>
                        <span>{parentPlanet.orbit_duration.toLocaleString()} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Distance from Sun</span>
                        <span>{parentPlanet.distance.toLocaleString()} km</span>
                    </div>
                </div>
                    : null
            }

            {
                data.type === "planet" && data.satellites.length ? <div className="flex flex-col gap-4">
                    {data.satellites.map(satellite => {
                        return <div>
                            <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: satellite.id })}>
                                <img src={`/solar-system/icons/${satellite.icon}`} className="size-6" alt={satellite.icon} />
                                <span className="text-lg font-bold">{t(`object.${satellite.id}.name`)}</span>
                            </button>

                            <div className="flex justify-between items-center">
                                <span>Radius</span>
                                <span>{satellite.radius.toLocaleString()} km</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Rotation period</span>
                                <span>{satellite.rotate_duration.toLocaleString()} days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Orbital period</span>
                                <span>{satellite.orbit_duration.toLocaleString()} days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Distance from {t(`object.${data.id}.name`)}</span>
                                <span>{satellite.distance.toLocaleString()} km</span>
                            </div>
                        </div>
                    })}
                </div>
                    : null
            }
        </div>

    </div>
}


export default PanelDetail