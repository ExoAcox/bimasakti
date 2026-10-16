
import { universes } from "@constants"
import type { Universe as UniverseType } from "@types"
import clsx from "clsx"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router"

interface Props {
    id: string
    className?: string
    imgClassName?: string
}

const Card = ({ id, className, imgClassName }: Props) => {
    const { t } = useTranslation()

    const data = universes.find(universe => universe.id === id) as UniverseType

    return <div className={clsx("bg-sky-900/20 backdrop-blur-xl group rounded-lg shadow-md p-4 min-h-75 flex flex-col gap-2 border border-gray-800 hover:border-sky-800", className)}>
        <div className="h-full overflow-hidden">
            <img alt={id} src={`/images/${data.image}`} className={clsx("object-cover mb-2 w-full group-hover:scale-105 transition-transform duration-250", imgClassName)} />
        </div>
        <h5 className="text-lg mt-auto font-bold font-space-grotesk">{t(`object.${id}.title`)}</h5>
        <p className="text-sm">{t(`object.${id}.description`)}</p>
        <Link to={`/${id}`} className="w-full sm:max-w-64 text-accent text-center border border-accent mt-2 rounded-lg font-semibold py-1 hover:bg-accent hover:text-slate-950 transition-colors">
            {t("ui.enter")}
        </Link>
    </div>
}



const Universe = () => {
    return <div className="mb-20 md:mb-24">
        <div className="mb-4 md:mb-8 w-fit mx-auto">
            <h3 className="text-2xl md:text-4xl font-bold text-center px-4 font-space-grotesk">
                <Trans
                    i18nKey="ui.universe_section_title"
                    components={{ br: <br className="sm:hidden" /> }}
                >
                    Explore the Members of <br className="sm:hidden" /> Milky Way Family
                </Trans>
            </h3>
            <div className="h-px w-full bg-base/50 sm:bg-base mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 p-4">
            <Card id="milky_way" className="md:col-span-2 lg:col-span-4 lg:row-span-2" imgClassName="h-[240px] lg:h-full" />
            <Card id="solar_system" className="md:col-span-2 lg:col-span-8" imgClassName="h-[240px] lg:h-[320px]" />
            <Card id="alpha_centauri" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
            <Card id="trappist-1" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
            <Card id="toi-700" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
            <Card id="copernicus" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
            <Card id="lich" className="lg:col-span-4" imgClassName="h-[240px] lg:h-full" />
        </div>
    </div>
}

export default Universe