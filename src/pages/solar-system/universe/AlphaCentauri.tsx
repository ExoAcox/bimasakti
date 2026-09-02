import { useContext, useEffect, useMemo, useRef } from "react"
import { Planet, Satellite, Star, Object } from "../components/object"
import { stars_ac, planets_ac } from "../constants"
import { ControlContext } from "../context"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { Html, useBounds } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { When } from "react-if"
import { Vector3 } from "three"


interface Props {
    controlRef: React.RefObject<OrbitControlsImpl>
}

const AlphaCentauri = ({ controlRef }: Props) => {
    const { focus, distanceScale, setControl } = useContext(ControlContext)

    const centerRef = useRef(null!)
    const proximaLabelRef = useRef(null!)
    const alphaALabelRef = useRef(null!)
    const alphaBLabelRef = useRef(null!)
    const targetPos = useRef(new Vector3())

    const { scene } = useThree()
    const bound = useBounds()

    const handleClick = () => {
        setControl({ focus: "" })
        bound.refresh(centerRef.current).fit()
    }

    const occlude = useMemo(() => {
        const object = scene.getObjectByName(focus || "sun")
        if (!object) return undefined

        return [{ current: object }]
    }, [focus, scene])



    // useFrame(() => {
    //     if (centerRef.current && controlRef.current) {
    //         // Ambil posisi objek di World Space
    //         centerRef.current.getWorldPosition(targetPos.current)

    //         const distance = controlRef.current.target.distanceTo(targetPos.current)
    //         console.log(distance)
    //     }
    // })

    useFrame((state) => {
        if (centerRef.current) {
            centerRef.current.getWorldPosition(targetPos.current)
            const distance = state.camera.position.distanceTo(targetPos.current)
            console.log("Jarak Kamera:", distance)
            // Atau cara praktis langsung dari OrbitControls:
            // const distance = controlRef.current.getDistance()
            if (distance > 100000) {
                alphaALabelRef.current.style.display = "none"
                alphaBLabelRef.current.style.display = "none"
                proximaLabelRef.current.style.display = "block"
            } else {
                alphaALabelRef.current.style.display = "block"
                alphaBLabelRef.current.style.display = "block"
                proximaLabelRef.current.style.display = "none"
            }
        }
    })


    return <group>


        <group ref={centerRef}>
            <Html occlude={occlude} zIndexRange={[2, 0]}>
                <button ref={proximaLabelRef} className="hover:text-accent absolute -translate-x-1/2 -translate-y-full -mt-1 py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold text-secondary" onClick={handleClick}>Alpha Centauri</button>
            </Html>

            {stars_ac.filter(star => star.id.includes("alpha_centauri")).map(star => {
                const offset = () => {
                    if (star.id === "alpha_centauri_a") {
                        return star.distance / 2 * 1 * -1 / distanceScale
                    }
                    if (star.id === "alpha_centauri_b") {
                        return star.distance / 2 * 1 / distanceScale
                    }
                }

                const labelRef = star.id === "alpha_centauri_a" ? alphaALabelRef : alphaBLabelRef


                return <group position={[offset(), 0, 0]}>
                    <Star
                        key={star.id}
                        id={star.id}
                        labelRef={labelRef}
                    >
                        {planets_ac.filter((planet) => planet.parent === star.id).map(planet => (
                            <Planet
                                key={planet.id}
                                id={planet.id}
                            >
                                {[...planet.satellites, ...(planet?.artificial_satellites || [])].map(satellite => (
                                    <Satellite
                                        key={satellite.id}
                                        id={satellite.id}
                                    />
                                ))}
                            </Planet>
                        ))}
                    </Star>
                </group>
            })}
        </group>

        <Star
            id="proxima_centauri"
        >
            {planets_ac.filter((planet) => planet.parent === "proxima_centauri").map(planet => (
                <Planet
                    key={planet.id}
                    id={planet.id}
                >
                    {[...planet.satellites, ...(planet?.artificial_satellites || [])].map(satellite => (
                        <Satellite
                            key={satellite.id}
                            id={satellite.id}
                        />
                    ))}
                </Planet>
            ))}
        </Star>
    </group>
}

export default AlphaCentauri