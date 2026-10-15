import { Atmosphere, Moons, Sun, Terrain } from "@components/liveview/mars"
import LiveviewCanvas from "@components/LiveviewCanvas"
import LiveviewScene from "@components/LiveviewScene"
import { SkyBox } from "@components/object"
import { seo } from "@function"
import clsx from "clsx"
import { Suspense, useMemo, useState } from "react"
import { TbMoonStars, TbSun, TbSunLow, TbSunset2 } from "react-icons/tb"
import { When } from "react-if"
import { MathUtils, Vector3 } from "three"

export const meta = () =>
    seo({
        title: "Mars",
        description: "Mars Terrain Simulation",
    })

// Ground elevation at center (0, 0) with scale 100 is ~33.08
const TERRAIN_SCALE = 100
const EYE_HEIGHT = 1.8
const CAMERA_ORIGIN = new Vector3(0, 33.08 + EYE_HEIGHT, 0)
const DAY_SUN_POSITION: [number, number, number] = [-20, 130, 0]
const EVENING_SUN_POSITION: [number, number, number] = [-100, 80, 0]
const SUNSET_SUN_POSITION: [number, number, number] = [-150, 20, 0]
const SCENES = [
    { id: "day", label: "Day", icon: TbSun },
    { id: "evening", label: "Evening", icon: TbSunLow },
    { id: "sunset", label: "Sunset", icon: TbSunset2 },
    { id: "night", label: "Night", icon: TbMoonStars },
] as const

const Mars = () => {
    const [scene, setScene] = useState<string>("day")

    const fogConfig = useMemo(() => {
        switch (scene) {
            case "sunset":
                return { color: "#161b24", near: 5, far: 150 }
            case "night":
                return { color: "#000009", near: 5, far: 150 }
            // case "day":
            // case "evening":
            default:
                return { color: "#944927", near: 5, far: 150 }
        }
    }, [scene])

    const userInterface = useMemo(() => {
        return <div
            className="fixed left-1/2 -translate-x-1/2 bottom-6 z-40 select-none"
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-1.5 p-1.5 cursor-default bg-background backdrop-blur-md border border-white/15 rounded-full shadow-2xl shadow-cyan-950/40 hover:border-white/25 transition-all">
                <div className="flex items-center gap-1">
                    {SCENES.map((scene_) => {
                        const Icon = scene_.icon
                        const isSelected = scene === scene_.id

                        return (
                            <button
                                key={scene_.id}
                                type="button"
                                onClick={() => setScene(scene_.id)}
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
                                    isSelected
                                        ? "bg-white/15 text-white border border-white/20 shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                                )}
                            >
                                <Icon className={clsx("size-4", isSelected ? "text-secondary" : "text-slate-400")} />
                                <span>{scene_.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    }, [scene])

    return (
        <LiveviewCanvas
            camera={
                {
                    position: [CAMERA_ORIGIN.x, CAMERA_ORIGIN.y, CAMERA_ORIGIN.z],
                    fov: 65,
                    near: 0.1,
                    far: 10000,
                }
            }
            userInterface={userInterface}
        >
            <SkyBox size={10000} rotation={[MathUtils.degToRad(25), MathUtils.degToRad(230), 0]} />

            {/* Single persistent fog instance to prevent R3F unmount detachment race conditions */}
            <fog attach="fog" args={[fogConfig.color, fogConfig.near, fogConfig.far]} />

            <When condition={scene === "day"}>
                <Sun position={DAY_SUN_POSITION} mode="day" />
                <Atmosphere sunPosition={DAY_SUN_POSITION} mode="day" />

                <ambientLight intensity={0.65} color="#e0885e" />
                <hemisphereLight
                    args={["#d97b48", "#4e2112", 1]}
                    position={[0, 50, 0]}
                />
                <directionalLight
                    position={[0, 150, 0]}
                    intensity={1.8}
                    color="#ffe6d0"
                    castShadow
                />
            </When>

            <When condition={scene === "evening"}>
                <Sun position={EVENING_SUN_POSITION} mode="evening" />
                <Atmosphere sunPosition={EVENING_SUN_POSITION} mode="evening" />

                <ambientLight intensity={0.55} color="#d4794e" />
                <hemisphereLight
                    args={["#c66a3b", "#3e190e", 0.65]}
                    position={[0, 50, 0]}
                />
                <directionalLight
                    position={[-70, 40, -50]}
                    intensity={1}
                    color="#d66838"
                />
            </When>

            <When condition={scene === "sunset"}>
                <Sun position={SUNSET_SUN_POSITION} mode="sunset" />
                <Atmosphere sunPosition={SUNSET_SUN_POSITION} mode="sunset" />

                <Suspense fallback={null}>
                    <Moons />
                </Suspense>

                <ambientLight intensity={0.5} color="#cbd5e1" />
                <hemisphereLight
                    args={["#e2e8f0", "#94a3b8", 0.5]}
                    position={[0, 50, 0]}
                />
                <directionalLight
                    position={[0, 50, 0]}
                    intensity={1.5}
                    color="#8ca4d0"
                />
            </When>

            <When condition={scene === "night"}>
                <Suspense fallback={null}>
                    <Moons />
                </Suspense>

                <ambientLight intensity={0.5} color="#cbd5e1" />
                <hemisphereLight
                    args={["#e2e8f0", "#94a3b8", 0.5]}
                    position={[0, 50, 0]}
                />
                <directionalLight
                    position={[0, 50, 0]}
                    intensity={1}
                    color="#8ca4d0"
                />
            </When>

            <Terrain scale={TERRAIN_SCALE} />
            <LiveviewScene position={CAMERA_ORIGIN} />



        </LiveviewCanvas >
    )
}

export default Mars
