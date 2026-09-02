import { Instance, Instances } from "@react-three/drei"
import { useContext, useMemo, useRef } from "react"
import type { Mesh } from "three"
import { randomNumber } from "../../function"
import type { Belt as BeltType } from "../../constants"
import { ControlContext } from "../../context"
import OrbitLine from "./OrbitLine"


interface BeltProps {
    data: BeltType
    count: number
}

interface BeltInstanceProps {
    position: [number, number, number]
    scale: number
    rotation: [number, number, number]
    speed: number
}

const BeltInstance = ({ position, scale, rotation, speed }: BeltInstanceProps) => {
    const instanceRef = useRef<Mesh>(null!);

    // useFrame((_, delta) => {
    //     if (instanceRef.current) {
    //         instanceRef.current.rotation.y += speed * delta;
    //         instanceRef.current.rotation.x += (speed / 2) * delta;
    //     }
    // });

    return (
        <Instance
            ref={instanceRef}
            position={position}
            scale={scale}
            rotation={rotation}
            castShadow
            receiveShadow
        />
    )
}

const BeltInstances = ({ data, count }: BeltProps) => {

    const { sizeScale, distanceScale } = useContext(ControlContext)

    const height = data.height / distanceScale
    const innerRadius = data.inner_radius / distanceScale
    const outerRadius = data.outer_radius / distanceScale
    const minSize = data.min_size / sizeScale
    const maxSize = data.max_size / sizeScale

    const chunks = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const angle = randomNumber() * Math.PI * 2;
            const r = innerRadius + randomNumber() * (outerRadius - innerRadius);

            temp.push({
                position: [
                    Math.cos(angle) * r,
                    (randomNumber() - 0.5) * height, // Belt height thickness
                    Math.sin(angle) * r
                ],
                scale: minSize + randomNumber() * (maxSize - minSize),
                rotation: [randomNumber() * Math.PI, randomNumber() * Math.PI, 0],
                speed: 0.1 + randomNumber() * 0.3
            });
        }
        return temp;
    }, [count, height, innerRadius, outerRadius, minSize, maxSize]);

    return <Instances limit={count}>
        <dodecahedronGeometry />
        <meshStandardMaterial />
        {chunks.map((chunk, i) => (
            <BeltInstance key={i} position={chunk.position} scale={chunk.scale} rotation={chunk.rotation} speed={chunk.speed} />
        ))}
    </Instances>
}

const Belt = ({ data, count }: BeltProps) => {
    const { distanceScale } = useContext(ControlContext)

    const loop = Math.round(count / 1000)
    const innerRadius = data.inner_radius / distanceScale

    return <>
        <OrbitLine radius={innerRadius} color={"white"} />
        {Array.from({ length: loop }, () => {
            return <BeltInstances data={data} count={1000} />
        })}
    </>
}

export default Belt