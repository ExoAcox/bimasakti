import { useControlStore } from "@state"
import { useCelestial, lengthFormat, timeFormat } from "@function"
import type { Belt, CelestialObject, Planet } from "@types"

import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import clsx from "clsx";




const PanelDetail = () => {
    const [isSatelliteOpen, setSatelliteOpen] = useState(true)
    const { focus, setControl } = useControlStore()
    const celestial = useCelestial()
    const data = celestial.getObjectById(focus) as CelestialObject

    const { t } = useTranslation();

    if (!data) return null
    const parentPlanet = (data.parent ? celestial.getObjectById(data.parent) : {}) as Planet

    return <div className="flex flex-col fixed top-4 right-4 bottom-4 text-sm text-secondary bg-background min-w-sm max-w-sm rounded-md pb-6 pt-4 px-7 z-50 backdrop-blur-sm max-h-dvh h-fit">
        <div>
            <div className="flex items-center gap-2 justify-between text-primary">
                <h1 className="text-xl font-bold">{t(`object.${data?.id}.name`)}</h1>
                {data.icon ? <img src={`/icons/${data.icon}`} className="size-10" /> : ""}
            </div>
            <p className="mt-4 leading-relaxed border-t border-divider pt-4">
                {t(`object.${data?.id}.description`)}
            </p>
            <div className="mt-4 text-sm text-secondary leading-relaxed border-t border-divider pt-4">
                <When condition={data.radius}>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.diameter")}</span>
                        <span>{lengthFormat(data.radius * 2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.rotation_period")}</span>
                        <span>{timeFormat(data.rotate_duration)}</span>
                    </div>
                </When>

                <When condition={(data as unknown as Belt).type === "belt"}>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.object_count")}</span>
                        <span>± {(data as unknown as Belt).count?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.inner_radius")}</span>
                        <span>{lengthFormat((data as unknown as Belt).inner_radius)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.outer_radius")}</span>
                        <span>{lengthFormat((data as unknown as Belt).outer_radius)}</span>
                    </div>
                </When>


                <When condition={data.parent}>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.orbital_period")}</span>
                        <span>{timeFormat((data as Planet).orbit_duration)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.distance_from")} {data.parent ? t(`object.${data.parent}.name`) : t("object.sun.name")}</span>
                        <span>{lengthFormat((data as Planet).distance)}</span>
                    </div>
                </When>
            </div>
            <When condition={["satellite", "artificial_satellite"].includes(data.type)}>
                <div className="mt-4 mb-2 leading-relaxed border-t border-divider pt-4">
                    <label className="font-bold text-blue-300">{t("ui.parent_planet")}</label>
                    <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: parentPlanet.id })}>
                        <img src={`/icons/${parentPlanet.icon}`} className="size-6" alt={parentPlanet.icon} />
                        <span className="text-lg font-bold">{t(`object.${parentPlanet.id}.name`)}</span>
                    </button>

                    <div className="flex justify-between items-center">
                        <span>{t("ui.diameter")}</span>
                        <span>{lengthFormat(parentPlanet.radius * 2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.rotation_period")}</span>
                        <span>{timeFormat(parentPlanet.rotate_duration)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.orbital_period")}</span>
                        <span>{timeFormat(parentPlanet.orbit_duration)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t("ui.distance_from")} {t("object.sun.name")}</span>
                        <span>{lengthFormat(parentPlanet.distance)}</span>
                    </div>
                </div>
            </When>
            <When condition={data.type === "planet" && data.satellites && data.satellites.length}>
                <div className="mt-4 leading-relaxed border-t border-divider pt-4 overflow-auto">
                    <button className="flex items-center gap-2 font-bold text-blue-300" onClick={() => setSatelliteOpen(!isSatelliteOpen)}>
                        <span>{t("ui.natural_satellites")}</span>
                        {isSatelliteOpen ? <IoChevronDown /> : <IoChevronUp />}
                    </button>
                    <div className={clsx("flex flex-col gap-4 mt-3", !isSatelliteOpen && "hidden")}>
                        {(data as Planet).satellites?.map(satellite => {
                            return <div>
                                <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: satellite.id })}>
                                    <img src={`/icons/${satellite.icon}`} className="size-6" alt={satellite.icon} />
                                    <span className="text-lg font-bold">{t(`object.${satellite.id}.name`)}</span>
                                </button>

                                <div className="flex justify-between items-center">
                                    <span>{t("ui.diameter")}</span>
                                    <span>{lengthFormat(satellite.radius * 2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t("ui.rotation_period")}</span>
                                    <span>{timeFormat(satellite.rotate_duration)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t("ui.orbital_period")}</span>
                                    <span>{timeFormat(satellite.orbit_duration)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t("ui.distance_from")} {t(`object.${data.id}.name`)}</span>
                                    <span>{lengthFormat(satellite.distance)}</span>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </When>
        </div>
    </div>
}


export default PanelDetail