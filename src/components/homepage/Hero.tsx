import { useCelestial } from "@function"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

const primaryButton = "bg-primary/90 text-white rounded whitespace-nowrap"
const secondaryButton = "border border-white/90 text-white/90 whitespace-nowrap rounded"

const Hero = () => {

    const { t } = useTranslation()
    const featuredObjects = useCelestial().getFeaturedObjects()

    return <div className="bg-black/10 p-4 rounded max-w-3xl">
        <h1 className="text-white font-bold text-6xl">BIMASAKTI</h1>
        <p className="text-lg mb-6 mt-4">The Indonesian name for the Milky Way — our home galaxy, a vast universe of stars, planets, and endless possibilities waiting to be explored.</p>
        <div className="flex items-center gap-4">
            <button className={clsx(primaryButton, "px-4 py-2")}>
                Explore Solar System
            </button>
            <button className={clsx(secondaryButton, "px-4 py-2")}>
                Explore Milky Way
            </button>
        </div>
        <div className="flex items-center gap-4 mt-4">
            <button className={clsx(secondaryButton, "text-sm px-2 py-1")}>
                Explore Alpha Centauri System
            </button>
            <button className={clsx(secondaryButton, "text-sm px-2 py-1")}>
                Explore TRAPPIST-1 System
            </button>
            <button className={clsx(secondaryButton, "text-sm px-2 py-1")}>
                Explore Lich System
            </button>
        </div>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
            {featuredObjects.map(object => {
                return <button key={object.id} className={clsx(secondaryButton, "text-sm px-2 py-1 flex items-center gap-1.5")}>
                    <img className="size-4" src={`/icons/${object.icon}`} alt={object.id} />
                    <span>Explore {t(`object.${object.id}.name`)}</span>
                </button>
            })}
        </div>
    </div>
}

export default Hero