import { Html, Stars } from "@react-three/drei"
import { universes } from "@constants"
import { useTranslation } from "react-i18next"
import { seo } from "@function"
import { useGalaxyStore } from "@state"
import { Galaxy } from "@components/object"
import { useEffect } from "react"
import { IoPlanetOutline } from "react-icons/io5"
import { FaRegStar } from "react-icons/fa";
import { PlanetClass } from "@types"

export const meta = () => seo({
    title: "Milky Way",
    description: "Milky Way"
})


const MilkyWay = () => {
    const { focus, setFocus } = useGalaxyStore()
    const { t } = useTranslation()

    const handleClick = (id: string) => {
        setFocus(id)
    }

    useEffect(() => {
        setFocus("")
    }, [setFocus])

    return (
        <>
            <Stars />
            <Galaxy>
                {
                    universes.map((universe) => {
                        if (universe.id === "milky_way") return null

                        if (focus !== universe.id) return

                        const starCount = universe.stars?.length || 0
                        const planetCount = universe.stars?.reduce(
                            (acc, s) => acc + (s.planets?.filter(p => p.class !== PlanetClass.Dwarf).length || 0),
                            0
                        ) || 0

                        return (
                            <group position={universe.position} key={universe.id}>
                                <Html
                                    position={[0, 0, 0]}
                                    zIndexRange={[10, 0]}
                                    style={{ pointerEvents: "auto" }}
                                    className="pointer-events-auto select-none"
                                >
                                    <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full pointer-events-auto select-none">
                                        {/* Floating Holographic HUD Badge */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClick(universe.id)
                                            }}
                                            className="group/badge flex items-center gap-2.5 px-3 py-2 rounded-xl bg-background backdrop-blur-xl border border-accent/40 shadow-glow hover:border-highlight hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-left whitespace-nowrap"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className="font-space-grotesk font-bold text-xs tracking-wide text-primary group-hover/badge:text-highlight transition-colors">
                                                    {t(`object.${universe.id}.name`)}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-highlight/85">
                                                    <span className="flex items-center gap-1">
                                                        <FaRegStar className="size-3 -mt-0.75 shrink-0" />
                                                        <span>{starCount} {starCount === 1 ? t("ui.star", "Bintang") : t("ui.stars", "Bintang")}</span>
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <IoPlanetOutline className="size-3 shrink-0" />
                                                        <span>{planetCount} {planetCount === 1 ? t("ui.planet", "Planet") : t("ui.planets", "Planet")}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Vertical Laser Stem Line */}
                                        <div className="w-px h-8 bg-linear-to-t from-accent via-accent/60 to-accent/20 shadow-glow" />
                                    </div>
                                </Html>
                                <points name={universe.id}>
                                    <bufferGeometry>
                                        <bufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0]), 3]} />
                                    </bufferGeometry>
                                    <pointsMaterial size={0.00001} color="white" />
                                </points>
                            </group>
                        )
                    })
                }
            </Galaxy>
        </>
    )
}

export default MilkyWay