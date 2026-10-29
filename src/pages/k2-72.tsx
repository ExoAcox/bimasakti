import { Planet, Star } from "@components/object"
import { k2_72 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "K2-72",
    description: "K2-72 Planetary System"
})

const K272 = () => {
    const { planets } = k2_72

    return (
        <Star id="k2-72">
            {planets.map(planet => (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            ))}
        </Star>
    )
}

export default K272
