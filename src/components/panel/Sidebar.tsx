
import clsx from "clsx"
import { useState, type ChangeEvent } from "react"
import { useControlStore } from "@state"

import { PlanetClass, type Asteroid, type Belt, type CelestialObject, type Comet, type Planet, type Satellite, type SpaceCraft, type Star } from "@types"
import { useCelestial } from "@function"
import { useTranslation } from "react-i18next"

import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { MdClose, MdSearch } from "react-icons/md"
import { PiEmpty } from "react-icons/pi";
import { When } from "react-if"


interface SectionProps {
    children: string
    data: (CelestialObject | Belt)[]
    initialOpen?: boolean
}


const SearchResultSection = ({ data }: { data: (CelestialObject | Belt)[] }) => {
    const { focus, focusIndex, setControl } = useControlStore()
    const { t } = useTranslation()

    const handleClick = (id: string) => {
        if (focus === id) {
            setControl({ focusIndex: focusIndex + 1 })
        } else {
            setControl({ focus: id })
        }
    }

    const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-white")

    if (!data.length) {
        return <div className="flex flex-col items-center gap-2 mt-8">
            <PiEmpty className="size-8" />
            <span className="text-sm">{t("ui.object_not_found")}</span>
        </div>
    }

    return <div>
        {data.map(object => {
            return <button key={object.id} className={clsx(buttonClass(object.id), "text-sm gap-3")} onClick={() => handleClick(object.id)}>
                <img alt={object.icon} src={`/icons/${object.icon}`} className="size-4" />
                <span className="text-left">{t(`object.${object.id}.nickname`)}</span>
            </button>
        })}
    </div>
}

const Section = ({ children, data, initialOpen }: SectionProps) => {
    const [isOpen, setOpen] = useState(initialOpen)
    const { t } = useTranslation()

    const { focus, focusIndex, setControl } = useControlStore()
    const celestial = useCelestial()
    const universe = celestial.getUniverse()

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
            {data.map((object) => {
                const isFocus = focus === object.id
                const satellite = celestial.getObjectById(focus) as CelestialObject
                const isParentFocus = object.id === satellite?.parent && object.id !== universe.defaultFocus && satellite?.type !== "spacecraft-flyby"
                const isMoonProbeFocus = object.id === "earth" && focus === "lro"

                const moonArtificialSatellites = () => {
                    if (object.id !== "earth") return []

                    const earth = object as Planet
                    return earth.satellites![0].artificial_satellites ?? []
                }
                const artificialSatellites = (object as Planet).artificial_satellites
                const satellites = [...(object as Planet).satellites ?? [], ...artificialSatellites ?? [], ...moonArtificialSatellites()]
                const isSatelliteVisible = (isFocus || isParentFocus || isMoonProbeFocus) && satellites.length ? true : false


                const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-white")

                return <div className="text-sm">
                    <button key={object.id} className={clsx(buttonClass(object.id), "gap-3")} onClick={() => handleClick(object.id)}>
                        <img alt={object.icon} src={`/icons/${object.icon}`} className="size-4" />
                        <span className="text-left">{t(`object.${object.id}.nickname`)}</span>
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
    const [search, setSearch] = useState("")

    const celestial = useCelestial()
    const stars = celestial.getObjectsByType("star") as Star[]
    const comets = celestial.getObjectsByType("comet") as Comet[]
    const asteroids = celestial.getObjectsByType("asteroid") as Asteroid[]
    const belts = celestial.getObjectsByType("belt") as Belt[]
    const allPlanets = celestial.getObjectsByType("planet") as Planet[]
    const planets = allPlanets.filter(planet => planet.class !== PlanetClass.Dwarf)
    const dwarfPlanets = allPlanets.filter(planet => planet.class === PlanetClass.Dwarf)
    const satellites = celestial.getObjectsByType("satellite") as Satellite[]
    const spacecraftFlyby = celestial.getObjectsByType("spacecraft-flyby") as SpaceCraft[]
    const spacecraftOrbiter = celestial.getObjectsByType("spacecraft-orbiter") as SpaceCraft[]
    const spacecraft = [...spacecraftOrbiter, ...spacecraftFlyby]

    const handleClick = () => {
        setOpen(!isOpen)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleReset = () => {
        setSearch("")
    }

    const allObjects = [...stars, ...comets, ...asteroids, ...belts, ...allPlanets, ...satellites, ...spacecraft]

    const filteredObjects = allObjects.filter((object) => {
        const name = t(`object.${object.id}.nickname`).toLowerCase()
        const searchLower = search.toLowerCase()

        return name.includes(searchLower)
    })

    return (
        <div className={clsx("fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300", !isOpen && "-translate-x-full")}>
            <button
                className="absolute top-3 -right-10 bg-background/90 p-2 rounded-r-xl border border-l-0 border-white/10 shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors opacity-90"
                onClick={handleClick}
            >
                {isOpen ? <TbLayoutSidebarLeftCollapse className="size-6" /> : <TbLayoutSidebarLeftExpand className="size-6" />}
            </button>
            <div className="bg-background min-w-44 h-full flex flex-col px-3 py-4 text-white backdrop-blur-sm border-r border-white/10">
                <div className="px-2 mb-4 flex items-center gap-2">
                    <MdSearch />
                    <input value={search} onChange={handleChange} placeholder="Search object ..." className="placeholder:text-sm text-sm flex-1" />
                    <When condition={search}>
                        <MdClose onClick={handleReset} className="cursor-pointer hover:text-red-400" />
                    </When>
                </div>
                <When condition={search}>
                    <SearchResultSection data={filteredObjects} />
                </When>
                <When condition={!search}>
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                        <Section data={stars} initialOpen>{t("ui.stars")}</Section>
                        <Section data={planets} initialOpen>{t("ui.planets")}</Section>
                        <Section data={dwarfPlanets}>{t("ui.dwarf_planets")}</Section>
                        <Section data={satellites}>{t("ui.satellites")}</Section>
                        <Section data={spacecraft}>{t("ui.spacecraft")}</Section>
                        <Section data={asteroids}>{t("ui.asteroids")}</Section>
                        <Section data={comets}>{t("ui.comets")}</Section>
                        <Section data={belts}>{t("ui.others")}</Section>
                    </div>
                </When>
            </div>
        </div>
    )
}


export default Sidebar