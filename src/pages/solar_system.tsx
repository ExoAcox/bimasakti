import { Planet, Satellite, Star, Comet, Belt } from "@components/object"
import { solar_system } from "@constants"
import { seo } from "@function"
import { useControlStore } from "@state"
import { When } from "react-if"


export const meta = () => seo({
    title: "Solar System",
    description: "Solar System"
})

const SolarSystem = () => {
    const { planets, comets, belts } = solar_system
    const { focus, variant } = useControlStore()

    const isRedGiant = focus === "sun" && variant === "red_giant"

    return <Star id="sun">
        {planets
            .filter((_, index) => {
                if (isRedGiant && index < 3) return false
                return true
            })
            .map((planet) => {
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

        <When condition={!isRedGiant}>
            {comets.map(comet => (
                <Comet
                    key={comet.id}
                    data={comet}
                />
            ))}
        </When>

        {belts.map(belt => (
            <Belt
                key={belt.id}
                data={belt}
            />
        ))}
    </Star>
}

export default SolarSystem