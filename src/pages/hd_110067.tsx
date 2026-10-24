import { Planet, Star } from "@components/object"
import { hd_110067 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "HD 110067",
    description: "HD 110067 Planetary System"
})

const HD110067 = () => {
    const { planets } = hd_110067

    return (
        <Star id="hd_110067">
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

export default HD110067
