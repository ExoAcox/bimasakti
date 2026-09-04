import { useContext } from "react"
import { ControlContext } from "@context"
import { useCelestial, lengthFormat, timeFormat } from "@function"
import type { Planet } from "@types"

import { useTranslation } from "react-i18next";
import { When } from "react-if";





const PanelDetail = () => {

    const { focus, setControl } = useContext(ControlContext)
    const celestial = useCelestial()
    const data = celestial.getObjectById(focus)

    const { t } = useTranslation();

    if (!data) return null
    const parentPlanet = (data.parent ? celestial.getObjectById(data.parent) : {}) as Planet

    return <div className="flex flex-col fixed top-4 right-4 bottom-4 text-sm text-secondary bg-background min-w-sm max-w-sm rounded-md pb-6 pt-4 px-7 z-50 backdrop-blur-sm max-h-dvh h-fit">
        <div>
            <div className="flex items-center gap-2 justify-between text-primary">
                <h1 className="text-xl font-bold">{t(`object.${data?.id}.name`)}</h1>
                {data.icon ? <img src={`/solar-system/icons/${data.icon}`} className="size-10" /> : ""}
            </div>
            <p className="mt-4 leading-relaxed border-t border-divider pt-4">
                {t(`object.${data?.id}.description`)}
            </p>
            <div className="mt-4 text-sm text-secondary leading-relaxed border-t border-divider pt-4">
                <div className="flex justify-between items-center">
                    <span>{t("ui.diameter")}</span>
                    <span>{lengthFormat(data.radius * 2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>{t("ui.rotation_period")}</span>
                    <span>{timeFormat(data.rotate_duration)}</span>
                </div>
                <When condition={data.type !== "star"}>
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
                </div>
            </When>
            <When condition={data.type === "planet" && data.satellites && data.satellites.length}>
                <div className="mt-4 mb-2 leading-relaxed border-t border-divider pt-4">
                    <label className="font-bold text-blue-300">{t("ui.natural_satellites")}</label>
                </div>
            </When>
        </div>

        <div className="flex-1 overflow-auto">
            <When condition={["satellite", "artificial_satellite"].includes(data.type)}>
                <div>
                    <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: parentPlanet.id })}>
                        <img src={`/solar-system/icons/${parentPlanet.icon}`} className="size-6" alt={parentPlanet.icon} />
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
                <div className="flex flex-col gap-4">
                    {(data as Planet).artificial_satellites?.map(satellite => {
                        return <div>
                            <button className="flex gap-2 items-center mb-2" onClick={() => setControl({ focus: satellite.id })}>
                                <img src={`/solar-system/icons/${satellite.icon}`} className="size-6" alt={satellite.icon} />
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
            </When>
        </div>

    </div>
}


export default PanelDetail