/* eslint-disable react-hooks/set-state-in-effect */
import clsx from "clsx";
import { useControlStore } from "@state"
import { useCelestial, lengthFormat, timeFormat, useVariant } from "@function"
import type { Belt, CelestialObject, Planet } from "@types"

import { useTranslation } from "react-i18next";
import { When } from "react-if";
import { useEffect, useMemo, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarRightExpand } from "react-icons/tb";
import { BiArrowBack } from "react-icons/bi";

const PanelDetail = () => {
    const [isPanelOpen, setPanelOpen] = useState(true)
    const [activeSection, setActiveSection] = useState("")

    const { focus, focusLandmark, variant, setControl } = useControlStore()

    const celestial = useCelestial()
    const rawData = celestial.getObjectById(focus) as Planet
    const data = useVariant(rawData)

    const { t } = useTranslation();

    useEffect(() => {
        setActiveSection("")
    }, [focus])

    if (!data) return null

    const parentPlanet = (data.parent ? celestial.getObjectById(data.parent) : {}) as Planet

    const handleClick = () => {
        setPanelOpen(!isPanelOpen)
    }

    const handleClickSection = (value: string) => {
        if (activeSection === value) {
            setActiveSection("")
        } else {
            setActiveSection(value)
        }
    }

    const objectName = variant ? t(`object.${data?.id}.${variant}.name`, t(`object.${data?.id}.name`)) : t(`object.${data?.id}.name`)
    const objectDescription = variant ? t(`object.${data?.id}.${variant}.description`, t(`object.${data?.id}.description`)) : t(`object.${data?.id}.description`)

    return (
        <div className={clsx("fixed top-4 right-4 z-50 transition-transform duration-300", !isPanelOpen && "translate-x-[calc(100%)]")}>
            <button
                className="absolute top-3 -left-10 bg-background/90 p-2 rounded-l-xl border border-r-0 border-white/10 shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors opacity-90"
                onClick={handleClick}
            >
                {isPanelOpen ? <TbLayoutSidebarRightCollapse className="size-6" /> : <TbLayoutSidebarRightExpand className="size-6" />}
            </button>

            <div className="bg-background min-w-sm max-w-sm rounded-xl pb-5 pt-4 px-6 backdrop-blur-sm max-h-[calc(100vh-2rem)] h-fit overflow-y-auto text-sm border border-white/10">
                <When condition={!focusLandmark}>
                    <div className="flex items-center gap-2 justify-between text-white">
                        <h1 className="text-xl font-bold">{objectName}</h1>
                        {data.icon ? <img src={`/icons/${data.icon}`} className="size-10" /> : ""}
                    </div>
                    <p className="mt-4 leading-relaxed border-t border-divider pt-4">
                        {objectDescription}
                    </p>
                    <div className="mt-4 text-sm  leading-relaxed border-t border-divider pt-4">
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

                    {/* Parent Section */}
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

                    {/* Satellites Section */}
                    <When condition={data.type === "planet" && data.satellites && data.satellites.length}>
                        <div className="mt-4 leading-relaxed border-t border-divider pt-4 overflow-auto">
                            <button className="flex items-center gap-2 font-bold text-blue-300" onClick={() => handleClickSection("satellite")}>
                                <span>{t("ui.natural_satellites")} ({(data as Planet).satellites?.length})</span>
                                {activeSection === "satellite" ? <IoChevronUp /> : <IoChevronDown />}
                            </button>
                            <div className={clsx("flex flex-col gap-4 mt-3", activeSection !== "satellite" && "hidden")}>
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

                    {/* Artificial Satellites Section */}
                    <When condition={data.type === "planet" && data.artificial_satellites && data.artificial_satellites.length}>
                        <div className="mt-4 leading-relaxed border-t border-divider pt-4 overflow-auto">
                            <button className="flex items-center gap-2 font-bold text-blue-300" onClick={() => handleClickSection("artificial_satellite")}>
                                <span>{t("ui.artificial_satellites")} ({(data as Planet).artificial_satellites?.filter(craft => craft.orbit_duration).length})</span>
                                {activeSection === "artificial_satellite" ? <IoChevronUp /> : <IoChevronDown />}
                            </button>
                            <div className={clsx("flex flex-col gap-4 mt-3", activeSection !== "artificial_satellite" && "hidden")}>
                                {(data as Planet).artificial_satellites?.filter(craft => craft.orbit_duration)?.map(satellite => {
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
                </When>

                {/* Landmark Detail */}
                <When condition={focusLandmark}>
                    <div className="flex items-center gap-4 text-white">
                        <button className="text-white" onClick={() => setControl({ focusLandmark: "" })}><BiArrowBack className="size-4" /></button>
                        <h1 className="text-xl font-bold">{t(`landmark.${focusLandmark}.name`)}</h1>
                    </div>
                    <p className="mt-4 leading-relaxed border-t border-divider pt-4">
                        {t(`landmark.${focusLandmark}.description`)}
                    </p>
                </When>

                {/* Landmarks Section */}
                <When condition={!!(data.landmarks && data.landmarks.length > 0)}>
                    <div className="mt-4 leading-relaxed border-t border-divider pt-4">
                        <button className="flex items-center gap-2 font-bold text-blue-300" onClick={() => handleClickSection("landmark")}>
                            <span className="flex items-center gap-1.5">{t("ui.landmarks")} ({data.landmarks?.length})</span>
                            {activeSection === "landmark" ? <IoChevronUp /> : <IoChevronDown />}
                        </button>
                        <div className={clsx("flex flex-col gap-2 mt-3 pr-1", activeSection !== "landmark" && "hidden")}>
                            {data.landmarks?.map(landmark => {
                                const isSelected = focusLandmark === landmark.id
                                return (
                                    <div key={landmark.id} className={clsx("p-2.5 rounded-lg border transition-all", isSelected ? "bg-amber-500/15 border-amber-400 text-white" : "bg-white/5 border-white/10 hover:border-amber-400/40")}>
                                        <button
                                            className="w-full flex items-center justify-between text-left font-semibold  hover:text-amber-200 cursor-pointer"
                                            onClick={() => setControl({ focusLandmark: isSelected ? "" : landmark.id })}
                                        >
                                            <span className="truncate pr-1">{t(`landmark.${landmark.id}.name`)}</span>
                                            <span className="text-[10px] font-mono shrink-0">
                                                {landmark.latitude > 0 ? `${landmark.latitude}°N` : `${Math.abs(landmark.latitude)}°S`},{" "}
                                                {landmark.longitude > 0 ? `${landmark.longitude}°E` : `${Math.abs(landmark.longitude)}°W`}
                                            </span>
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </When>
            </div>
        </div>
    )
}


export default PanelDetail