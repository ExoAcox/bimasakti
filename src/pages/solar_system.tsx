import { ArtificialSatellite, Planet, Satellite, Star, Comet, Belt } from "@components/object"
import { solar_system } from "@constants"

const SolarSystem = () => {
    const { planets, comets, belts } = solar_system


    return <Star id="sun">
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
                    {planet.artificial_satellites?.map(satellite => (
                        <ArtificialSatellite
                            key={satellite.id}
                            data={satellite}
                        />
                    ))}
                </Planet>
            )
        })}

        {comets.map(comet => (
            <Comet
                key={comet.id}
                data={comet}
            />
        ))}

        {belts.map(belt => (
            <Belt
                key={belt.id}
                data={belt}
            />
        ))}
    </Star>
}

export default SolarSystem