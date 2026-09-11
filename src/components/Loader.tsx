import { Html, useProgress } from "@react-three/drei"
import { useMemo } from "react"

export const Loader = () => {
    const { progress, item, loaded, total } = useProgress()

    // Format current item name from path/url
    const itemName = useMemo(() => {
        if (!item) return "Loading solar system assets..."
        const parts = item.split("/")
        const file = parts[parts.length - 1]
        return file.split("?")[0] || item
    }, [item])

    const formattedProgress = Math.min(100, Math.max(0, Math.round(progress)))

    return (
        <Html center style={{ width: "100vw", height: "100vh", pointerEvents: "none" }}>
            <div className="fixed inset-0 z-100 flex flex-col items-center justify-center select-none font-sans text-white pointer-events-auto overflow-hidden">
                {/* Background ambient glow */}
                {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-black pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" /> */}

                {/* Main Glassmorphism Card */}
                <div className="relative z-10 flex flex-col items-center max-w-md w-[90vw] p-8 rounded-3xl bg-slate-900/60 border border-white/10  backdrop-blur-2xl">

                    {/* Futuristic Badge */}
                    <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>Initializing System</span>
                    </div>

                    {/* Solar Orbit Cosmic Animation */}
                    <div className="relative w-36 h-36 flex items-center justify-center my-2">
                        {/* Sun Glowing Core */}
                        <div className="absolute w-10 h-10 rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.9)] animate-cosmic-pulse" />
                        <div className="absolute w-6 h-6 rounded-full bg-white blur-[2px]" />

                        {/* Outer Orbit Ring 1 */}
                        <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30 border-dashed animate-cosmic-spin">
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                        </div>

                        {/* Outer Orbit Ring 2 */}
                        <div className="absolute w-24 h-24 rounded-full border border-indigo-400/40 animate-cosmic-spin-reverse">
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
                        </div>
                    </div>

                    {/* Percentage Display */}
                    <div className="mt-4 mb-2 flex items-baseline gap-1">
                        <span className="font-mono text-5xl font-extrabold tracking-tight bg-linear-to-r from-white via-cyan-100 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                            {formattedProgress}
                        </span>
                        <span className="text-xl font-bold text-cyan-400/80">%</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-slate-950/80 rounded-full border border-white/10 p-0.5 overflow-hidden relative shadow-inner my-2">
                        <div
                            className="h-full bg-linear-to-r from-blue-600 via-cyan-400 to-amber-300 rounded-full transition-all duration-300 ease-out relative shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                            style={{ width: `${formattedProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-cosmic-shimmer" />
                        </div>
                    </div>

                    {/* Footer Info / Asset Details */}
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono mt-3 px-1">
                        <span className="truncate max-w-55 text-slate-300" title={item}>
                            {itemName}
                        </span>
                        <span className="text-cyan-400/90 font-semibold shrink-0 ml-2">
                            {loaded} / {total}
                        </span>
                    </div>
                </div>
            </div>
        </Html>
    )
}

export default Loader
