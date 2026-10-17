import { Planet, Star } from "@components/object"
import { kepler_32 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Kepler-32",
    description: "Kepler-32 Planetary System"
})

const Kepler32 = () => {
    const { planets } = kepler_32

    return (
        <Star id="kepler-32">
            {planets.map(planet => {
                return (
                    <Planet
                        key={planet.id}
                        data={planet}
                    />
                )
            })}
        </Star>
    )
}

export default Kepler32
