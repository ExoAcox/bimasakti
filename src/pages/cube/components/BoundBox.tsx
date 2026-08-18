import type { Ref } from "react"
import type { Mesh } from "three"




const BoundBox = ({ count, ref }: { count: number, ref: Ref<Mesh> }) => {
    const size = count * 2 - 1
    return <mesh ref={ref}>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial transparent opacity={0} />
    </mesh>
}

export default BoundBox