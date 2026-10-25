import { Planet, Star } from "@components/object"
import { teegarden } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Teegarden",
    description: "Teegarden's Star Planetary System"
})

const Teegarden = () => {
    const { planets } = teegarden

    return (
        <Star id="teegarden">
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

export default Teegarden
