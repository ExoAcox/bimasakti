import { useCelestial } from "@function"
import { useProgress } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom/client"
import { FaRegFile } from "react-icons/fa"

export const Loader = () => {
    const { gl } = useThree()
    const [progressState, setProgressState] = useState(() => useProgress.getState())

    useEffect(() => {
        return useProgress.subscribe((state) => {
            requestAnimationFrame(() => {
                setProgressState(state)
            })
        })
    }, [])

    const { item, loaded, total } = progressState
    const universe = useCelestial().getUniverse()

    const itemName = useMemo(() => {
        if (!item) return "Loading solar system assets..."
        const parts = item.split("/")
        const file = parts[parts.length - 1]
        return file.split("?")[0] || item
    }, [item])

    const knownTotalAssets = universe?.assetCount || 0
    const displayTotal = Math.max(total, knownTotalAssets)
    const formattedProgress = displayTotal > 0 ? Math.min(Math.round((loaded / displayTotal) * 100), 99) : 0

    const [container] = useState(() => {
        if (typeof document === "undefined") return null
        const div = document.createElement("div")
        div.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;"
        return div
    })

    const rootRef = useRef<ReactDOM.Root | null>(null)

    const content = useMemo(
        () => (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden">
                <div className="relative z-10 flex flex-col items-center max-w-md w-[90vw] p-8 rounded-3xl bg-slate-900/80 border border-panel-border backdrop-blur-xl shadow-2xl">
                    {/* Percentage Display */}
                    <div className="mb-2 flex items-baseline gap-1 font-space-grotesk">
                        <span className="text-7xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                            {formattedProgress}
                        </span>
                        <span className="text-3xl font-bold">%</span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden relative bg-white/10 my-3">
                        <div
                            className="h-full rounded-full transition-all duration-300 ease-out bg-accent shadow-glow"
                            style={{ width: `${formattedProgress}%` }}
                        />
                    </div>

                    {/* Footer Info / Asset Details */}
                    <div className="w-full flex items-center gap-2 text-xs text-tertiary mt-3 px-1">
                        <FaRegFile className="shrink-0 translate-y-px" />
                        <span className="truncate max-w-55 text-secondary mr-auto" title={item}>
                            {itemName}
                        </span>
                        <span className="text-highlight font-semibold shrink-0 ml-2">
                            {loaded} / {displayTotal}
                        </span>
                    </div>
                </div>
            </div>
        ),
        [displayTotal, formattedProgress, item, itemName, loaded],
    )

    useLayoutEffect(() => {
        if (!container) return

        const target = gl.domElement.parentElement || document.body
        target.appendChild(container)
        const root = ReactDOM.createRoot(container)
        rootRef.current = root
        root.render(content)

        return () => {
            setTimeout(() => {
                root.unmount()
                if (container.parentNode) {
                    container.parentNode.removeChild(container)
                }
            }, 0)
        }
    }, [container, content, formattedProgress, gl])

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.render(content)
        }
    }, [content])

    return null
}

export default Loader
