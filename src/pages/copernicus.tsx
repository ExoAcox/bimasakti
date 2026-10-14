import { Planet, Star } from "@components/object"
import { copernicus } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Copernicus",
    description: "Copernicus Planetary System"
})

const Copernicus = () => {
    const { stars, planets } = copernicus

    return (
        <>
            {stars.map(star => (
                <Star key={star.id} id={star.id}>
                    {planets.filter(planet => planet.parent === star.id).map(planet => (
                        <Planet
                            key={planet.id}
                            data={planet}
                        />
                    ))}
                </Star>
            ))}
        </>
    )
}

export default Copernicus
