import { Planet, Star } from "@components/object"
import { rho_coronae_borealis } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Rho Coronae Borealis",
    description: "Rho Coronae Borealis Planetary System"
})

const RhoCoronaeBorealis = () => {
    const { planets } = rho_coronae_borealis

    return (
        <Star id="rho_coronae_borealis">
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

export default RhoCoronaeBorealis
