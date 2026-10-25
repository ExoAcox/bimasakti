import { useCelestial } from "@function"
import { MathUtils } from "three"


interface Props {
    radius: number
    color: string
    tilt?: number
    rotation?: number
}

const Pulsar = ({ radius, color, tilt = 5, rotation = 0 }: Props) => {

    const universe = useCelestial().getUniverse()
    const lightHeight = universe.maxDistance * 2
    const lightPosition = lightHeight / 2 + radius
    const lightWidth = radius * 0.05

    return (
        <group rotation={[MathUtils.degToRad(tilt), MathUtils.degToRad(rotation), MathUtils.degToRad(tilt)]}>
            {/* <mesh position={[0, lightPosition, 0]}>
                <cylinderGeometry args={[lightWidth, lightWidth, lightHeight]} />
                <meshStandardMaterial color={color} transparent opacity={0.5} emissive={color} emissiveIntensity={10} />
            </mesh> */}
            <mesh position={[0, lightPosition, 0]}>
                <cylinderGeometry args={[lightWidth, lightWidth, lightHeight]} />
                <meshStandardMaterial
                    color={color}
                    transparent opacity={0.5}
                    emissive={color}
                    emissiveIntensity={10}
                    polygonOffset={true}
                    polygonOffsetFactor={-1}
                    polygonOffsetUnits={-1}
                />
            </mesh>
            <mesh position={[0, -lightPosition, 0]}>
                <cylinderGeometry args={[lightWidth, lightWidth, lightHeight]} />
                <meshStandardMaterial
                    color={color}
                    transparent opacity={0.5}
                    emissive={color}
                    emissiveIntensity={10}
                    polygonOffset={true}
                    polygonOffsetFactor={-1}
                    polygonOffsetUnits={-1}
                />
            </mesh>
        </group>
    )
}

export default Pulsar