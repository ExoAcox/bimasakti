
import clsx from "clsx"
import { useContext } from "react"
import { ControlContext } from "@context"

import type { Planet, Star } from "@types"
import { useCelestial } from "@function"
import { useTranslation } from "react-i18next"
import SettingPanel from "@components/panel/SettingPanel"

interface SectionProps {
    children: string
    data: Star[] | Planet[]
}

const Section = ({ children, data }: SectionProps) => {
    const { t } = useTranslation()

    const { focus, focusIndex, setControl } = useContext(ControlContext)
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
            {data.map((planet: Star | Planet) => {
                const isFocus = focus === planet.id
                const satellite = celestial.getObjectById(focus)
                const isParentFocus = planet.id === satellite?.parent

                const isSatelliteVisible = (isFocus || isParentFocus) && (planet as Planet).satellites?.length


                const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-primary")


                return <div className="text-sm">
                    <button key={planet.id} className={clsx(buttonClass(planet.id), "gap-3")} onClick={() => handleClick(planet.id)}>
                        <img alt={planet.icon} src={`/solar-system/icons/${planet.icon}`} className="size-4" />
                        {t(`object.${planet.id}.name`)}
                    </button>
                    {isSatelliteVisible ?
                        <div className="flex flex-col py-1">
                            {
                                (planet as Planet).satellites?.map((satellite) => {
                                    return <button className={clsx(buttonClass(satellite.id), "pl-6 gap-2")} key={satellite.id} onClick={() => handleClick(satellite.id)}>
                                        <img alt={satellite.icon} src={`/solar-system/icons/${satellite.icon}`} className="size-4" />
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
    const planets = celestial.getObjectsByType("planet")
    const dwarfPlanets = celestial.getObjectsByType("dwarf_planet")


    return <div className="fixed top-0 left-0 bottom-0 min-w-40 flex flex-col bg-background px-3 py-4 z-50 text-primary backdrop-blur-sm">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <Section data={stars}>{t("ui.stars")}</Section>
            <Section data={planets}>{t("ui.planets")}</Section>
            <Section data={dwarfPlanets}>{t("ui.dwarf_planets")}</Section>
        </div>
        <SettingPanel />
    </div>
}


export default Sidebar