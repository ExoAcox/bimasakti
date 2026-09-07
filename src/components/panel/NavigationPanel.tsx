import { getUniverseById } from "@function"
import { useControlStore, useGalaxyStore } from "@state"
import { useTranslation } from "react-i18next"



const NavigationPanel = () => {
    const { t } = useTranslation()
    const { focus, setFocus } = useGalaxyStore()
    const { universe, setControl } = useControlStore()

    const id = universe === "milky_way" ? focus : universe
    const data = getUniverseById(id)

    const backText = () => {
        if (universe === "milky_way") {
            return `Enter ${t(`object.${data?.id}.name`)}`
        } else {
            return `Back to Milky Way`
        }
    }

    const handleClick = () => {
        if (universe === "milky_way") {
            setControl({ universe: data?.id })
        } else {
            setFocus("")
            setControl({ universe: "milky_way" })
        }
    }

    // useFrame(() => {
    //     if (controlRef.current && universe !== "milky_way") {
    //         const isMaxZoomOut = controlRef.current.getDistance() >= controlRef.current.maxDistance - 10;
    //         panelRef.current.parentElement.parentElement.style.visibility = isMaxZoomOut ? "visible" : "hidden"
    //     }
    // });

    if (!data) return null

    return <div id="navigation-panel" className="fixed left-1/2 -translate-x-1/2 bottom-4 flex flex-col text-sm text-secondary bg-background min-w-sm max-w-2xl rounded-md pb-6 pt-4 px-7 z-50 backdrop-blur-sm">
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
            {/* <div className="mt-4 leading-relaxed border-t border-divider pt-4">
                <div className="flex justify-between items-center">
                    <span>{t("ui.diameter")}</span>
                    <span>{lengthFormat(data.radius * 2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>{t("ui.rotation_period")}</span>
                    <span>{timeFormat(data.rotate_duration)}</span>
                </div>
            </div> */}
        </div>
    </div>
}

export default NavigationPanel