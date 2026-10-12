
import clsx from "clsx"
import { useState } from "react"
import { useGalaxyStore } from "@state"

import { useTranslation } from "react-i18next"

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { universe_ids } from "@constants"



const Sidebar = () => {
    const { t } = useTranslation()


    const [isOpen, setOpen] = useState(true)
    const { focus, setFocus } = useGalaxyStore()

    const handleClick = (id: string) => {
        setFocus(id)
    }

    const buttonClass = (id: string) => clsx("w-full py-2 px-3 flex items-center", (focus === id) && "bg-blue-400/80 text-white")

    const data = universe_ids.filter(id => id !== "milky_way")


    return (
        <div className={clsx("fixed top-0 left-0 bottom-0 z-50 transition-transform duration-300", !isOpen && "-translate-x-full")}>
            <button
                className="absolute top-3 -right-10 bg-background/90 p-2 rounded-r-xl border border-l-0 border-white/10 shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors opacity-90"
                onClick={() => setOpen(!isOpen)}
            >
                {isOpen ? <TbLayoutSidebarLeftCollapse className="size-6" /> : <TbLayoutSidebarLeftExpand className="size-6" />}
            </button>
            <div className="bg-background min-w-44 h-full flex flex-col px-3 py-4 text-white backdrop-blur-sm border-r border-white/10">
                {/* <div className="relative px-2 mb-4 flex items-center gap-2">
                    <MdSearch className="shrink-0" />
                    <input
                        value={search}
                        onChange={handleChange}
                        placeholder="Search object ..."
                        className="placeholder:text-sm text-sm pr-3" />
                    <When condition={search}>
                        <MdClose onClick={handleReset} className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer hover:text-red-400 shrink-0" />
                    </When>
                </div> */}
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    {data.map(universe => {
                        return <button key={universe} className={clsx(buttonClass(universe), "text-sm gap-3")} onClick={() => handleClick(universe)}>
                            <span className="text-left">{t(`object.${universe}.name`)}</span>
                        </button>
                    })}
                </div>
            </div>
        </div>
    )
}


export default Sidebar