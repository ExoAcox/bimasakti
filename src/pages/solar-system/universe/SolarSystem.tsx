import { Planet, Satellite, Star } from "../components/object"
import { dwarfPlanets, planets } from "../constants"





const SolarSystem = () => {
    return <Star id="sun">
        {planets.map(planet => (
            <Planet
                key={planet.id}
                id={planet.id}
            >
                {[...planet.satellites, ...(planet?.artificial_satellites || [])].map(satellite => (
                    <Satellite
                        key={satellite.id}
                        id={satellite.id}
                    />
                ))}
            </Planet>
        ))}

        {dwarfPlanets.map(planet => (
            <Planet
                key={planet.id}
                id={planet.id}
            />
        ))}
    </Star>
}

export default SolarSystem