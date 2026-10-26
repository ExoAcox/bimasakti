import { Blackhole, Star } from "@components/object"
import { sagittarius_a } from "@constants"
import { seo } from "@function"

export const meta = () => seo({
    title: "Sagittarius A*",
    description: "Sagittarius A*"
})

const SagittariusA = () => {
    const { stars } = sagittarius_a

    return (
        <Blackhole id="sagittarius_a">
            {stars.map((star) => (
                <Star
                    key={star.id}
                    id={star.id}
                />
            ))}
        </Blackhole>
    )
}

export default SagittariusA