import { Planet, Star } from "@components/object"
import { toi_700 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "TOI-700",
    description: "TOI-700 Planetary System"
})

const Toi700 = () => {
    const { planets } = toi_700

    return (
        <Star id="toi-700">
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

export default Toi700
