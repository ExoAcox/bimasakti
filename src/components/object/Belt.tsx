import { useMemo } from "react"
import { randomNumber } from "@function"
import type { Belt as BeltType } from "@types"
import { useControlStore } from "@state"


interface BeltProps {
    data: BeltType
}


const Belt = ({ data }: BeltProps) => {
    const { sizeScale, distanceScale } = useControlStore()

    const count = data.count
    const height = data.height / distanceScale
    const innerRadius = data.inner_radius / distanceScale
    const outerRadius = data.outer_radius / distanceScale
    const minSize = data.min_size / sizeScale
    const maxSize = data.max_size / sizeScale

    const [position, size] = useMemo(() => {
        const tempPosition = [];
        const tempSize = []


        for (let i = 0; i < count; i++) {
            const angle = randomNumber() * Math.PI * 2;
            const r = innerRadius + randomNumber() * (outerRadius - innerRadius);

            tempPosition.push([
                Math.cos(angle) * r,
                (randomNumber() - 0.5) * height, // Belt height thickness
                Math.sin(angle) * r
            ])

            tempSize.push((minSize + randomNumber() * (maxSize - minSize)))
        }

        const positions = new Float32Array(tempPosition.flat())
        const sizes = new Float32Array(tempSize)

        return [positions, sizes];
    }, [count, height, innerRadius, maxSize, minSize, outerRadius]);

    return <group>
        {/* <OrbitLine radius={innerRadius} color={"white"} /> */}
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[position, 3]} // Angka 3 artinya kelompokkan tiap 3 angka (X, Y, Z)
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[size, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                color={"white"}
                opacity={0.25}
                transparent
                sizeAttenuation={true}
                onBeforeCompile={(shader) => {
                    shader.vertexShader = shader.vertexShader.replace(
                        'void main() {',
                        'attribute float aSize;\nvoid main() {'
                    ).replace(
                        'gl_PointSize = size;',
                        'gl_PointSize = aSize;'
                    );
                }}
            />
        </points>
    </group>
}

export default Belt