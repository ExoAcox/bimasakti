import { Planet, Satellite, Star } from "@components/object"
import { cervantes } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Cervantes",
    description: "Cervantes (Mu Arae) Planetary System"
})

const Cervantes = () => {
    const { planets } = cervantes

    return (
        <Star id="cervantes">
            {planets.map(planet => {
                return (
                    <Planet
                        key={planet.id}
                        data={planet}
                    >
                        {planet.satellites?.map(satellite => (
                            <Satellite
                                key={satellite.id}
                                data={satellite}
                            />
                        ))}
                    </Planet>
                )
            })}
        </Star>
    )
}

export default Cervantes
