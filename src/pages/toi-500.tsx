import { Planet, Star } from "@components/object"
import { toi_500 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "TOI-500",
    description: "TOI-500 Planetary System"
})

const Toi500 = () => {
    const { planets } = toi_500

    return (
        <Star id="toi-500">
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

export default Toi500
