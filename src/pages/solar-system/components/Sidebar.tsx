
import clsx from "clsx"
import { planets, sun } from "../constant"
import { useContext } from "react"
import { ControlContext } from "../context"

import type { Planet as PlanetType } from "../constant"
import { getObjectById } from "../function"


interface Props {
    setControl: (values: object) => void
}

const Sidebar = ({ setControl }: Props) => {

    const { focus } = useContext(ControlContext)

    console.log(focus)

    return <div className="fixed top-4 left-4 bg-white rounded p-2 z-50">
        <div className="flex flex-col gap-0">

            {[sun, ...planets].map((planet: PlanetType) => {



                const isFocus = focus === planet.id
                const satellite = getObjectById(focus)
                const isParentFocus = planet.id === satellite?.parent

                const isSatelliteVisible = (isFocus || isParentFocus) && planet.satellites?.length


                const buttonClass = (id: string) => clsx("w-full py-1 px-2 rounded-lg", (focus === id) && "bg-blue-400 text-white")


                return <div className={clsx("p-2", isSatelliteVisible && "bg-gray-200 rounded-md my-2")}>
                    <button key={planet.id} className={buttonClass(planet.id)} onClick={() => setControl({ focus: planet.id })}>{planet.name}</button>
                    {isSatelliteVisible ?
                        <div className="flex flex-col gap-4 mt-2">
                            {
                                planet.satellites?.map((satellite) => {
                                    return <button className={buttonClass(satellite.id)} key={satellite.id} onClick={() => setControl({ focus: satellite.id })}>{satellite.name}</button>
                                })
                            }
                        </div> : null}
                </div>
            })}
        </div>
    </div>
}


export default Sidebar