import { Instance, Instances } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useContext, useMemo, useRef } from "react"
import type { Mesh } from "three"
import { randomNumber } from "../../function"
import type { Belt } from "../../constant"
import { ControlContext } from "../../context"
import OrbitLine from "./OrbitLine"


interface Props {
    data: Belt
    count: number
}

interface AsteroidChunkProps {
    position: [number, number, number]
    scale: number
    rotation: [number, number, number]
    speed: number
}

const AsteroidChunk = ({ position, scale, rotation, speed }: AsteroidChunkProps) => {
    const instanceRef = useRef<Mesh>(null!);

    useFrame((_, delta) => {
        if (instanceRef.current) {
            instanceRef.current.rotation.y += speed * delta;
            instanceRef.current.rotation.x += (speed / 2) * delta;
        }
    });

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

const Asteroid = ({ data, count }: Props) => {

    const { sizeScale, distanceScale } = useContext(ControlContext)

    const height = data.height / distanceScale
    const innerRadius = data.inner_radius / distanceScale
    const outerRadius = data.outer_radius / distanceScale
    const minSize = data.min_size / sizeScale
    const maxSize = data.max_size / sizeScale

    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const angle = randomNumber() * Math.PI * 2;
            const r = innerRadius + (randomNumber() - 0.5) * (outerRadius - innerRadius);

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

    return <>
        <OrbitLine radius={innerRadius} color={"white"} />
        <Instances limit={count}>
            <dodecahedronGeometry />
            <meshStandardMaterial />
            {asteroids.map((asteroid, i) => (
                <AsteroidChunk key={i} position={asteroid.position} scale={asteroid.scale} rotation={asteroid.rotation} speed={asteroid.speed} />
            ))}
        </Instances>
    </>
}

export default Asteroid