import { Planet, Star } from "@components/object"
import { lich } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Lich",
    description: "Lich"
})

const Lich = () => {
    const { planets } = lich

    return (
        <Star id="lich">
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

export default Lich
