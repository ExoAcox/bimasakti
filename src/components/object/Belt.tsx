import { useMemo, useRef } from "react"
import { randomNumber } from "@function"
import type { Belt as BeltType } from "@types"
import { useControlStore } from "@state"
import { PointsMaterial } from "three"


interface BeltProps {
    data: BeltType
}


const Belt = ({ data }: BeltProps) => {
    const { focus, sizeScale, distanceScale } = useControlStore()
    const pointRef = useRef<PointsMaterial>(null!)


    const count = Math.min(data.count, 1000000)
    const height = data.height / distanceScale
    const innerRadius = data.inner_radius / distanceScale
    const outerRadius = data.outer_radius / distanceScale
    const minSize = data.min_size / sizeScale
    const maxSize = data.max_size / sizeScale
    const opacity = focus === data.id ? 0.3 : 0.15

    const isSphere = data.shape === "sphere" || data.id === "oort"

    const [position, size] = useMemo(() => {
        const tempPosition = [];
        const tempSize = []

        for (let i = 0; i < count; i++) {
            if (isSphere) {
                // 3D spherical cloud distribution with organic radial dispersion
                const u = randomNumber();
                const v = randomNumber();
                const theta = u * Math.PI * 2;
                const phi = Math.acos(2 * v - 1);

                // Non-linear radial distribution to prevent uniform hollow shell look
                const rBias = Math.pow(randomNumber(), 1.3);
                const r = innerRadius + rBias * (outerRadius - innerRadius);

                tempPosition.push([
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.cos(phi),
                    r * Math.sin(phi) * Math.sin(theta)
                ]);
            } else {
                // Organic Ring / Disc distribution with non-uniform random dispersion
                const baseAngle = randomNumber() * Math.PI * 2;

                // Combine central density peak (Gaussian-like average) with random scatter
                const rGaussian = (randomNumber() + randomNumber() + randomNumber()) / 3;
                const rUniform = randomNumber();
                const rFactor = randomNumber() > 0.25 ? rGaussian : rUniform;

                const r = innerRadius + rFactor * (outerRadius - innerRadius);

                // Height profile with Gaussian distribution (higher density near ecliptic plane)
                const normalizedR = (r - innerRadius) / (outerRadius - innerRadius);
                const edgeEnvelope = Math.sin(normalizedR * Math.PI);
                const heightFactor = 0.15 + 0.85 * Math.pow(edgeEnvelope, 0.6);

                // Gaussian vertical dispersion (soft edge fading without sharp box boundaries)
                const yDispersal = (randomNumber() + randomNumber() - 1) * 0.5;
                const y = yDispersal * height * heightFactor;

                // Subtle angular perturbation for natural organic scattering
                const scatterAngle = baseAngle + (randomNumber() - 0.5) * 0.05;

                tempPosition.push([
                    Math.cos(scatterAngle) * r,
                    y,
                    Math.sin(scatterAngle) * r
                ]);
            }

            // Power-law size distribution: higher frequency of small dust/rocks, fewer large objects
            const sizeWeight = Math.pow(randomNumber(), 2.2);
            tempSize.push(minSize + sizeWeight * (maxSize - minSize));
        }

        const positions = new Float32Array(tempPosition.flat())
        const sizes = new Float32Array(tempSize)

        return [positions, sizes];
    }, [count, height, innerRadius, isSphere, maxSize, minSize, outerRadius]);

    return <group>
        <mesh
            name={data.id}
            rotation={[-Math.PI / 2, 0, 0]}
            visible={false}
        >
            <ringGeometry args={[innerRadius, outerRadius * 0.9]} />
            <meshBasicMaterial />
        </mesh>

        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[position, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[size, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={pointRef}
                color={"white"}
                opacity={opacity}
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