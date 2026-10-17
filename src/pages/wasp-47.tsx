import { Planet, Star } from "@components/object"
import { wasp_47 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "WASP-47",
    description: "WASP-47 Planetary System"
})

const Wasp47 = () => {
    const { planets } = wasp_47

    return (
        <Star id="wasp-47">
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

export default Wasp47
