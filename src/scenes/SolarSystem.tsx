import { ArtificialSatellite, Planet, Satellite, Star } from "@components/object"
import { solar_system } from "@constants"

const SolarSystem = () => {
    const { planets, dwarf_planets } = solar_system


    return <Star id="sun">
        {planets.map(planet => {

            return (
                <Planet
                    key={planet.id}
                    id={planet.id}
                >
                    {planet.satellites?.map(satellite => (
                        <Satellite
                            key={satellite.id}
                            id={satellite.id}
                        />
                    ))}
                    {planet.artificial_satellites?.map(satellite => (
                        <ArtificialSatellite
                            key={satellite.id}
                            id={satellite.id}
                        />
                    ))}
                </Planet>
            )
        })}

        {dwarf_planets.map(planet => (
            <Planet
                key={planet.id}
                id={planet.id}
            />
        ))}
    </Star>
}

export default SolarSystem