import { useMemo, useRef } from "react"
import { Planet, Star } from "@components/object"
import { alpha_centauri } from "@constants"
import { useControlStore } from "@state"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useBounds } from "@react-three/drei"
import { seo, useCelestial } from "@function"
import type { Star as StarType } from "@types"


export const meta = () => seo({
    title: "Alpha Centauri",
    description: "Alpha Centauri"
})

const AlphaCentauri = () => {
    const { focus, distanceScale, setControl } = useControlStore()
    const { stars, planets } = alpha_centauri

    const centerRef = useRef(null!)
    const alphaLabelRef = useRef<HTMLButtonElement>(null!)
    const alphaALabelRef = useRef<HTMLButtonElement>(null!)
    const alphaBLabelRef = useRef<HTMLButtonElement>(null!)
    // const targetPos = useRef(new Vector3())

    const { scene } = useThree()
    const bound = useBounds()
    const celestial = useCelestial()
    const { sizeScale } = useControlStore()

    const handleClick = () => {
        setControl({ focus: "" })
        bound.refresh(centerRef.current).fit()
    }

    const occlude = useMemo(() => {
        if (!focus) return undefined

        const object = scene.getObjectByName(focus)
        if (!object) return undefined

        return [{ current: object }]
    }, [focus, scene])

    useFrame(({ camera }) => {
        if (centerRef.current) {
            const distance = celestial.getCameraDistance(camera, centerRef.current)

            const object = scene.getObjectByName(focus)
            let distanceObject = 0
            let scale = 300

            if (object) {
                distanceObject = celestial.getCameraDistance(camera, object)
                scale = Math.max(300, object.userData.radius) / sizeScale * 50
            }

            if (distance > 100000 || distanceObject < scale) {
                if (alphaALabelRef.current) alphaALabelRef.current.style.visibility = "hidden"
                if (alphaBLabelRef.current) alphaBLabelRef.current.style.visibility = "hidden"
                if (alphaLabelRef.current) alphaLabelRef.current.style.visibility = "visible"
            } else {
                if (alphaALabelRef.current) alphaALabelRef.current.style.visibility = "visible"
                if (alphaBLabelRef.current) alphaBLabelRef.current.style.visibility = "visible"
                if (alphaLabelRef.current) alphaLabelRef.current.style.visibility = "hidden"
            }
        }
    })

    return <group>
        <group ref={centerRef}>
            <Html occlude={occlude} zIndexRange={[2, 0]}>
                <button ref={alphaLabelRef} className="hover:text-accent absolute -translate-x-1/2 -translate-y-full -mt-1 py-1 px-2 whitespace-nowrap rounded-lg text-sm font-semibold text-secondary" onClick={handleClick}>Alpha Centauri</button>
            </Html>

            {stars.filter(star => star.id.includes("alpha_centauri")).map(star => {
                const offset = () => {
                    if (star.id === "alpha_centauri_a") {
                        return star.distance / 2 * 1 * -1 / distanceScale
                    }
                    if (star.id === "alpha_centauri_b") {
                        return star.distance / 2 * 1 / distanceScale
                    }
                    return 0
                }

                const labelRef = star.id === "alpha_centauri_a" ? alphaALabelRef : alphaBLabelRef


                return <group position={[offset() ?? 0, 0, 0]}>
                    <Star
                        key={star.id}
                        id={star.id}
                        labelRef={labelRef}
                    >
                        {planets.filter((planet) => planet.parent === star.id).map(planet => (
                            <Planet
                                key={planet.id}
                                data={planet}
                            />
                        ))}
                    </Star>
                </group>
            })}
        </group>

        <Star
            id="proxima_centauri"
        >
            {planets.filter((planet) => planet.parent === "proxima_centauri").map(planet => (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            ))}
        </Star>
    </group>
}

export default AlphaCentauri