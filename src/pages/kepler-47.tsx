import { Planet, Star } from "@components/object"
import { kepler_47 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Kepler-47",
    description: "Kepler-47 Binary Star & Circumbinary Planetary System"
})

const Kepler47 = () => {
    const { planets } = kepler_47

    return (
        <Star id="kepler-47_a">
            <Star id="kepler-47_b_star" />
            {planets.map(planet => (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            ))}
        </Star>
    )
}

export default Kepler47
