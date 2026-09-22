
import clsx from "clsx"
import { useState } from "react"
import { useControlStore } from "@state"

import { PlanetClass, SpaceCraftClass, type Belt, type CelestialObject, type Comet, type Planet, type SpaceCraft, type Star } from "@types"
import { useCelestial } from "@function"
import { useTranslation } from "react-i18next"

import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";


interface SectionProps {
    children: string
    data: (CelestialObject | Belt)[]
    initialOpen?: boolean
}

const Section = ({ children, data, initialOpen }: SectionProps) => {
    const [isOpen, setOpen] = useState(initialOpen)
    const { t } = useTranslation()

    const { focus, focusIndex, setControl } = useControlStore()
    const celestial = useCelestial()

    const handleClick = (id: string) => {
        if (focus === id) {
            setControl({ focusIndex: focusIndex + 1 })
        } else {
            setControl({ focus: id })
        }

    }

    if (!data?.length) return null

    return <div>
        <button className="flex items-center" onClick={() => setOpen(!isOpen)}>
            <span className="text-xs uppercase px-2 block">{children}</span>
            {isOpen ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        <div className={clsx("flex flex-col mt-1", !isOpen && "hidden")}>
            {data.map((planet) => {
                const isFocus = focus === planet.id
                const satellite = celestial.getObjectById(focus) as Planet
                const isParentFocus = planet.id === satellite?.parent && satellite?.orbit_duration

                const artificialSatellites = (planet as Planet).artificial_satellites?.filter(craft => craft.class !== SpaceCraftClass.FlyBy)
                const satellites = [...(planet as Planet).satellites ?? [], ...artificialSatellites ?? []]
                const isSatelliteVisible = (isFocus || isParentFocus) && satellites.length


                const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-white")


                return <div className="text-sm">
                    <button key={planet.id} className={clsx(buttonClass(planet.id), "gap-3")} onClick={() => handleClick(planet.id)}>
                        <img alt={planet.icon} src={`/icons/${planet.icon}`} className="size-4" />
                        <span className="text-left">{t(`object.${planet.id}.nickname`)}</span>
                    </button>
                    {isSatelliteVisible ?
                        <div className="flex flex-col py-1">
                            {
                                satellites.map((satellite) => {
                                    return <button className={clsx(buttonClass(satellite.id), "pl-6 gap-2")} key={satellite.id} onClick={() => handleClick(satellite.id)}>
                                        <img alt={satellite.icon} src={`/icons/${satellite.icon}`} className="size-4" />
                                        <span className="text-left">{t(`object.${satellite.id}.nickname`)}</span>
                                    </button>
                                })
                            }
                        </div> : null}
                </div>
            })}
        </div>
    </div>
}


const Sidebar = () => {
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(true)

    const celestial = useCelestial()
    const stars = celestial.getObjectsByType("star") as Star[]
    const comets = celestial.getObjectsByType("comet") as Comet[]
    const belts = celestial.getObjectsByType("belt") as Belt[]
    const allPlanets = celestial.getObjectsByType("planet") as Planet[]
    const planets = allPlanets.filter(planet => planet.class !== PlanetClass.Dwarf)
    const dwarfPlanets = allPlanets.filter(planet => planet.class === PlanetClass.Dwarf)
    const spaceCraft = celestial.getObjectsByType("space_craft") as SpaceCraft[]

    const handleClick = () => {
        setOpen(!isOpen)
    }


    return (
        <div className={clsx("fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300", !isOpen && "-translate-x-full")}>
            <button
                className="absolute top-3 -right-10 bg-background/90 p-2 rounded-r-xl border border-l-0 border-white/10 shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors opacity-90"
                onClick={handleClick}
            >
                {isOpen ? <TbLayoutSidebarLeftCollapse className="size-6" /> : <TbLayoutSidebarLeftExpand className="size-6" />}
            </button>
            <div className="bg-background min-w-44 h-full flex flex-col px-3 py-4 text-white backdrop-blur-sm border-r border-white/10">
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                    <Section data={stars} initialOpen>{t("ui.stars")}</Section>
                    <Section data={planets} initialOpen>{t("ui.planets")}</Section>
                    <Section data={dwarfPlanets}>{t("ui.dwarf_planets")}</Section>
                    <Section data={spaceCraft}>{t("ui.space_craft")}</Section>
                    <Section data={comets}>{t("ui.comets")}</Section>
                    <Section data={belts}>{t("ui.others")}</Section>
                </div>
            </div>
        </div>
    )
}


export default Sidebar