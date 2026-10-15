import { Atmosphere, Phobos, Sun, Terrain } from "@components/liveview/mars"
import LiveviewCanvas from "@components/LiveviewCanvas"
import LiveviewScene from "@components/LiveviewScene"
import { SkyBox } from "@components/object"
import { seo } from "@function"
import { Canvas } from "@react-three/fiber"
import clsx from "clsx"
import { Suspense, useState } from "react"
import { TbMovie, TbMoonStars, TbSun, TbSunset2 } from "react-icons/tb"
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
const SUN_POSITION: [number, number, number] = [-100, 80, 0]
const SUNSET_SUN_POSITION: [number, number, number] = [-150, 20, 0]
const SCENES = [
    { id: "day", label: "Day", icon: TbSun },
    { id: "evening", label: "Evening", icon: TbSunset2 },
    { id: "sunset", label: "Sunset", icon: TbSunset2 },
    { id: "night", label: "Night", icon: TbMoonStars },
] as const

const Mars = () => {
    const [activeScene, setActiveScene] = useState<string>("day")
    const isNight = activeScene === "night"
    const isSunset = activeScene === "sunset"

    return (
        <LiveviewCanvas>
            <Canvas
                shadows
                camera={{
                    position: [CAMERA_ORIGIN.x, CAMERA_ORIGIN.y, CAMERA_ORIGIN.z],
                    fov: 65,
                    near: 0.1,
                    far: 10000,
                }}


            >

                <SkyBox size={10000} rotation={[MathUtils.degToRad(25), MathUtils.degToRad(230), 0]} />

                {isNight && (
                    <>

                        <fog attach="fog" args={["#000009", 5, 150]} key="night-fog" />

                        <Suspense fallback={null}>
                            <Phobos />
                        </Suspense>

                        {/* Even & bright night lighting across the entire terrain */}
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
                    </>
                )}

                {isSunset && (
                    <>
                        <Sun position={SUNSET_SUN_POSITION} mode="sunset" />
                        <Atmosphere sunPosition={SUNSET_SUN_POSITION} mode="sunset" />

                        <fog attach="fog" args={["#161b24", 5, 150]} key="sunset-fog" />

                        <Suspense fallback={null}>
                            <Phobos />
                        </Suspense>

                        {/* Sunset Lighting: moody, dim twilight terrain matching Curiosity reference */}
                        {/* <ambientLight intensity={0.16} color="#38302a" />
                        <hemisphereLight
                            args={["#2b3d52", "#180e0a", 0.25]}
                            position={[0, 50, 0]}
                        /> */}

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
                    </>
                )}

                {activeScene === "day" && (
                    <>
                        <Sun position={SUN_POSITION} mode="day" />
                        <Atmosphere sunPosition={SUN_POSITION} mode="day" />

                        <fog attach="fog" args={["#944927", 5, 150]} key="day-fog" />

                        {/* Day Lighting: warm Martian bounce and sunlight */}
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
                    </>
                )}

                <Suspense fallback={null}>
                    <Terrain scale={TERRAIN_SCALE} />
                    <LiveviewScene position={CAMERA_ORIGIN} />
                </Suspense>
            </Canvas>

            <div
                className="fixed left-1/2 -translate-x-1/2 bottom-6 z-40 select-none"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-1.5 p-1.5 cursor-default bg-background backdrop-blur-md border border-white/15 rounded-full shadow-2xl shadow-cyan-950/40 hover:border-white/25 transition-all">
                    <div className="flex items-center gap-1">
                        {SCENES.map((scene) => {
                            const Icon = scene.icon
                            const isSelected = activeScene === scene.id

                            return (
                                <button
                                    key={scene.id}
                                    type="button"
                                    onClick={() => setActiveScene(scene.id)}
                                    className={clsx(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
                                        isSelected
                                            ? "bg-white/15 text-white border border-white/20 shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                                    )}
                                >
                                    <Icon className={clsx("size-4", isSelected ? "text-secondary" : "text-slate-400")} />
                                    <span>{scene.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

        </LiveviewCanvas >
    )
}

export default Mars
