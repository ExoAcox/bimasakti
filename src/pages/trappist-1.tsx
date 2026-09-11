import { Planet, Star } from "@components/object"
import { trappist_1 } from "@constants"

const Trappist1 = () => {
    const { planets } = trappist_1

    return <Star id="trappist-1">
        {planets.map(planet => {
            return (
                <Planet
                    key={planet.id}
                    data={planet}
                />
            )
        })}
    </Star>
}

export default Trappist1
