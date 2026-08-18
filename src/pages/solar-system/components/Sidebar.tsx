
import { planets, sun } from "../constant"
import type { Control } from "../context";


interface Props {
    setControl: (value: Control) => void
}

const Sidebar = ({ setControl }: Props) => {

    return <div className="fixed top-4 left-4 bg-white rounded p-4">
        <div className="flex flex-col gap-4">
            <button key={sun.id} onClick={() => setControl({ focus: sun.id })}>{sun.name}</button>

            {planets.map(planet => {
                return <button key={planet.id} onClick={() => setControl({ focus: planet.id })}>{planet.name}</button>
            })}

            {planets.flatMap(planet => planet.satellites).map(satellite => {
                return <button key={satellite.id} onClick={() => setControl({ focus: satellite.id })}>{satellite.name}</button>
            })}
        </div>
    </div>
}


export default Sidebar