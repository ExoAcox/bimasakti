import { Planet, Star } from "@components/object"
import { corot_7 } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "CoRoT-7",
    description: "CoRoT-7 Planetary System"
})

const Corot7 = () => {
    const { planets } = corot_7

    return (
        <Star id="corot-7">
            {planets.map(planet => (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            ))}
        </Star>
    )
}

export default Corot7
