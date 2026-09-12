import { getUniverseById, useCelestial } from "@function"
import { defaultControl, useControlStore, useGalaxyStore } from "@state"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"



const NavigationPanel = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { focus, reset } = useGalaxyStore()
    const universe = useCelestial().getUniverse()
    const id = universe.id === "milky_way" ? focus : universe.id

    const data = getUniverseById(id!)
    const { setControl } = useControlStore()

    const backText = () => {
        if (universe.id === "milky_way") {
            return `Enter ${t(`object.${data?.id}.name`)}`
        } else {
            return `Back to Milky Way`
        }
    }

    const handleClick = () => {
        if (universe.id === "milky_way") {
            navigate(`/${focus}`)
        } else {
            reset()
            navigate(`/milky_way`)
        }

        setControl(defaultControl)
    }

    useEffect(() => {
        const navigationPanel = document.getElementById("navigation-panel")
        if (!navigationPanel) return

        console.log(focus)

        navigationPanel.style.visibility = focus ? "visible" : "hidden"
    }, [id, focus])

    if (!data) return null

    return <div id="navigation-panel" className="invisible fixed left-1/2 -translate-x-1/2 bottom-4 flex flex-col text-sm text-secondary bg-background min-w-sm max-w-2xl rounded-md pb-6 pt-4 px-7 z-50 backdrop-blur-sm">
        <div>
            <div className="flex items-center gap-2 justify-between text-primary">
                <h1 className="text-xl font-bold">{t(`object.${data?.id}.name`)}</h1>
                {/* {data.icon ? <img src={`/icons/${data.icon}`} className="size-10" /> : ""} */}
            </div>
            <p className="mt-4 leading-relaxed border-t border-divider pt-4">
                {t(`object.${data?.id}.description`)}
            </p>
            <button className="w-full font-semibold bg-accent text-white p-3 rounded-lg mt-4" onClick={handleClick}>
                {backText()}
            </button>
        </div>
    </div>
}

export default NavigationPanel