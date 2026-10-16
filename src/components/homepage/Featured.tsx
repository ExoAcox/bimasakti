/* eslint-disable react-hooks/set-state-in-effect */
import { useCelestial } from "@function"
import type { CelestialObject } from "@types"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { When } from "react-if"
import { ModalObject } from "."




const Featured = () => {
    const [data, setData] = useState<CelestialObject[]>([])
    const [focus, setFocus] = useState("")
    const [isMore, setMore] = useState(false)

    const { t } = useTranslation()
    const celestial = useCelestial()

    const handleClick = (id: string) => {
        setFocus(focus === id ? "" : id)
    }

    useEffect(() => {
        if (!data.length) {
            setData(celestial.getFeaturedObjects(1000))
        }
    }, [celestial, data])

    return <>
        <div className="px-6 mb-24 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 font-space-grotesk">{t("ui.featured_objects")}</h3>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
                {data.filter((_, index) => isMore || index < 20).map(object => {
                    if (!object) return null
                    return <button onClick={() => handleClick(object.id)} key={object.id} className="group relative bg-background border border-sky-100/25 whitespace-nowrap rounded-full px-4 py-2 flex items-center gap-1.5 hover:bg-accent/80 hover:text-slate-950 transition">
                        <img className="size-4" src={`/icons/${object.icon}`} alt={object.id} />
                        <span className="text-sm font-medium">{t(`object.${object.id}.name`)}</span>

                        <div className="hidden group-hover:block absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-3 p-4 rounded-xl bg-black w-max max-w-[90dvw] lg:max-w-80 whitespace-normal border border-sky-100/20 shadow">
                            {/* <span className="font-semibold mb-2 block">{t(`object.${object.id}.name`)}</span> */}
                            <p className="max-w-full whitespace-normal wrap-break-word">{t(`object.${object.id}.description`)}</p>
                        </div>
                    </button>
                })}
                <button onClick={() => setMore(!isMore)} className="bg-sky-100/25 border border-sky-100/25 whitespace-nowrap rounded-full px-4 py-2 flex items-center gap-1.5">
                    <span className="text-sm font-medium">{isMore ? t("ui.show_less") : t("ui.show_more")}</span>
                </button>
            </div>
        </div>
        {/* <When condition={!!object}>
            <ModalObject data={object!} onClose={() => setObject(null)} />
        </When> */}
    </>
}

export default Featured