
import clsx from "clsx"
import { planets, sun } from "../constant"
import { useContext } from "react"
import { ControlContext } from "../context"

import type { Planet as PlanetType } from "../constant"
import { getObjectById } from "../function"
import { useTranslation } from "react-i18next"


interface Props {
    setControl: (values: object) => void
}

const Sidebar = ({ setControl }: Props) => {

    const { focus } = useContext(ControlContext)
    const { t } = useTranslation()

    console.log(focus)

    return <div className="fixed top-4 left-4 bg-black/50 rounded p-2 z-50 text-white backdrop-blur-sm">
        <div className="flex flex-col gap-0">

            {[sun, ...planets].map((planet: PlanetType) => {



                const isFocus = focus === planet.id
                const satellite = getObjectById(focus)
                const isParentFocus = planet.id === satellite?.parent

                const isSatelliteVisible = (isFocus || isParentFocus) && planet.satellites?.length


                const buttonClass = (id: string) => clsx("w-full py-1 px-2 rounded-lg flex items-center", (focus === id) && "bg-blue-400/80 text-white")


                return <div className={clsx("p-1", isSatelliteVisible && "bg-gray-800/40 rounded-md my-2")}>
                    <button key={planet.id} className={clsx(buttonClass(planet.id), "gap-3")} onClick={() => setControl({ focus: planet.id })}>
                        <img alt={planet.icon} src={`/solar-system/icons/${planet.icon}`} className="size-4" />
                        {t(`object.${planet.id}.name`)}
                    </button>
                    {isSatelliteVisible ?
                        <div className="flex flex-col py-1 gap-3 mt-2">
                            {
                                planet.satellites?.map((satellite) => {
                                    return <button className={clsx(buttonClass(satellite.id), "pl-4 pr-4 text-sm gap-2")} key={satellite.id} onClick={() => setControl({ focus: satellite.id })}>
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


export default Sidebar