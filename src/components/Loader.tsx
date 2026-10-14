import { useCelestial } from "@function"
import { Html, useProgress } from "@react-three/drei"
import { useMemo } from "react"

import { FaRegFile } from "react-icons/fa";

export const Loader = () => {
    const { item, loaded, total } = useProgress()

    const universe = useCelestial().getUniverse()

    const itemName = useMemo(() => {
        if (!item) return "Loading solar system assets..."
        const parts = item.split("/")
        const file = parts[parts.length - 1]
        return file.split("?")[0] || item
    }, [item])

    const knownTotalAssets = universe?.assetCount || 0
    const displayTotal = Math.max(total, knownTotalAssets)
    const formattedProgress = Math.min(Math.round((loaded / displayTotal) * 100), 99)

    return (
        <Html center style={{ width: "100vw", height: "100vh", pointerEvents: "none" }}>
            <div className="fixed inset-0 z-100 flex flex-col items-center justify-center select-none text-white/90 pointer-events-auto overflow-hidden">

                <div className="relative z-10 flex flex-col items-center max-w-md w-[90vw] p-8 rounded-3xl bg-slate-900/50 border border-white/10  backdrop-blur-md">


                    {/* Percentage Display */}
                    <div className="mb-2 flex items-baseline gap-1 font-space-grotesk">
                        <span className="text-7xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                            {formattedProgress}
                        </span>
                        <span className="text-3xl font-bold">%</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1 rounded-full  overflow-hidden relative shadow-inner my-2">
                        <div
                            className="h-full rounded-full transition-all duration-300 ease-out relative"
                            style={{ width: `${formattedProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20" />
                        </div>
                    </div>

                    {/* Footer Info / Asset Details */}
                    <div className="w-full flex items-center gap-2 text-xs text-slate-400 mt-3 px-1">
                        <FaRegFile className="shrink-0 translate-y-px" />
                        <span className="truncate max-w-55 text-slate-300 mr-auto" title={item}>
                            {itemName}
                        </span>
                        <span className="text-cyan-300/80 font-semibold shrink-0 ml-2">
                            {loaded} / {displayTotal}
                        </span>
                    </div>
                </div>
            </div>
        </Html>
    )
}

export default Loader
