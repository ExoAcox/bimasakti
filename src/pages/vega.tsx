import { Planet, Star } from "@components/object"
import { vega } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Vega",
    description: "Vega Star System"
})

const Vega = () => {
    const { planets } = vega

    return (
        <Star id="vega">
            {planets.map(planet => (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            ))}
        </Star>
    )
}

export default Vega
