import { Planet, Satellite, Star, Comet, Belt, SpaceCraft } from "@components/object"
import { solar_system } from "@constants"
import { seo } from "@function"
import { When } from "react-if"


export const meta = () => seo({
    title: "Solar System",
    description: "Solar System"
})

const SolarSystem = () => {
    const { planets, comets, belts, space_craft } = solar_system


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
                    {planet.artificial_satellites?.map(craft => (
                        <SpaceCraft
                            key={craft.id}
                            data={craft}
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