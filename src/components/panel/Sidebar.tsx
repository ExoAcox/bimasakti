
import clsx from "clsx"
import { useControlStore } from "@state"

import { PlanetClass, type Comet, type Planet, type Star } from "@types"
import { useCelestial } from "@function"
import { useTranslation } from "react-i18next"
import SettingPanel from "@components/panel/SettingPanel"

interface SectionProps {
    children: string
    data: Star[] | Planet[] | Comet[]
}

const Section = ({ children, data }: SectionProps) => {
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
        <label className="text-xs uppercase px-2 mb-1 block">{children}</label>
        <div className="flex flex-col">
            {data.map((planet: Star | Planet | Comet) => {
                const isFocus = focus === planet.id
                const satellite = celestial.getObjectById(focus)
                const isParentFocus = planet.id === satellite?.parent

                const isSatelliteVisible = (isFocus || isParentFocus) && (planet as Planet).satellites?.length


                const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-primary")


                return <div className="text-sm">
                    <button key={planet.id} className={clsx(buttonClass(planet.id), "gap-3")} onClick={() => handleClick(planet.id)}>
                        <img alt={planet.icon} src={`/icons/${planet.icon}`} className="size-4" />
                        {t(`object.${planet.id}.name`)}
                    </button>
                    {isSatelliteVisible ?
                        <div className="flex flex-col py-1">
                            {
                                (planet as Planet).satellites?.map((satellite) => {
                                    return <button className={clsx(buttonClass(satellite.id), "pl-6 gap-2")} key={satellite.id} onClick={() => handleClick(satellite.id)}>
                                        <img alt={satellite.icon} src={`/icons/${satellite.icon}`} className="size-4" />
                                        {t(`object.${satellite.id}.name`)}
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

    const celestial = useCelestial()
    const stars = celestial.getObjectsByType("star")
    const comets = celestial.getObjectsByType("comet")
    const allPlanets = celestial.getObjectsByType("planet") as Planet[]
    const planets = allPlanets.filter(planet => planet.class !== PlanetClass.Dwarf)
    const dwarfPlanets = allPlanets.filter(planet => planet.class === PlanetClass.Dwarf)


    return <div className="fixed top-0 left-0 bottom-0 min-w-40 flex flex-col bg-background px-3 py-4 z-50 text-primary backdrop-blur-sm">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <Section data={stars as Star[]}>{t("ui.stars")}</Section>
            <Section data={planets as Planet[]}>{t("ui.planets")}</Section>
            <Section data={dwarfPlanets as Planet[]}>{t("ui.dwarf_planets")}</Section>
            <Section data={comets as Comet[]}>{t("ui.comets")}</Section>
        </div>
        <SettingPanel />
    </div>
}


export default Sidebar