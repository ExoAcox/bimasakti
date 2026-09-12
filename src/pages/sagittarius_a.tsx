import { Blackhole } from "@components/object"
import { seo } from "@function"
import { useBounds } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useControlStore } from "@state"
import { useEffect } from "react"
import { Box3 } from "three"

export const meta = () => seo({
    title: "Sagittarius A*",
    description: "Sagittarius A*"
})

const SagittariusA = () => {

    const { setControl } = useControlStore()
    const { scene } = useThree()
    const bound = useBounds()

    useEffect(() => {
        const object = scene.getObjectByName("sagittarius_a")
        if (!object) return

        const marginBox = new Box3()
        marginBox.setFromObject(object)
        marginBox.expandByScalar(20)
        bound.refresh(marginBox).fit()

        setControl({ focus: "sagittarius_a" })
    }, [bound, scene, setControl])

    return (
        <Blackhole id="sagittarius_a">
            {/* {stars.map((star) => (
                <Star key={star.id} id={star.id} />
            ))} */}
        </Blackhole>
    )
}

export default SagittariusA