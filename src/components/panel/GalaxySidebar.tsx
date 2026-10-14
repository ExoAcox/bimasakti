/* eslint-disable react-hooks/set-state-in-effect */

import clsx from "clsx"
import { useEffect, useState } from "react"
import { useGalaxyStore } from "@state"

import { useTranslation } from "react-i18next"

import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { universe_ids } from "@constants"
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useMobile } from "@function";



const Sidebar = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const isMobile = useMobile()


    const [isOpen, setOpen] = useState(true)
    const { focus, setFocus } = useGalaxyStore()

    const handleClick = (id: string) => {
        setFocus(id)
    }

    const handleBack = () => {
        navigate("/")
    }

    useEffect(() => {
        if (isMobile) {
            setOpen(false)
        }
    }, [focus, isMobile])


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
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    {data.map(universe => {
                        return <button key={universe} className={clsx(buttonClass(universe), "text-sm gap-3")} onClick={() => handleClick(universe)}>
                            <span className="text-left">{t(`object.${universe}.name`)}</span>
                        </button>
                    })}
                </div>

                <button onClick={handleBack} className="flex items-center gap-3 text-sm px-3 pb-1 pt-3 hover:translate-x-2 transition">
                    <IoArrowBack />
                    Back to Home
                </button>
            </div>
        </div>
    )
}


export default Sidebar