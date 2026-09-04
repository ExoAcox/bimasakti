import { useContext } from "react"
import { ControlContext, defaultValue } from "@context"

const title = (universe: string) => {
    switch (universe) {
        case "solar-system":
            return "Solar System"
        case "alpha-centauri":
            return "Alpha Centauri System"
        default:
            return ""
    }
}


const Header = () => {
    const { universe, setControl } = useContext(ControlContext)

    const handleClick = () => {
        const value = defaultValue
        value.universe = universe === "solar-system" ? "alpha-centauri" : "solar-system"

        setControl(value)
    }


    return <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-background text-secondary rounded-b px-4 py-2 text-sm font-semibold" onClick={handleClick}>{title(universe)}</button>
    </div>
}

export default Header