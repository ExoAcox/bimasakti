import { useCelestial } from "@function"
import { MathUtils } from "three"


interface Props {
    radius: number
    color: string
    tilt?: number
}

const Pulsar = ({ radius, color, tilt = 0.5 }: Props) => {

    const universe = useCelestial().getUniverse()
    const lightHeight = universe.maxDistance * 2
    // const lightPosition = lightHeight / 2 + radius
    const lightWidth = radius * 0.05

    return (
        <group rotation={[MathUtils.degToRad(tilt), 0, MathUtils.degToRad(tilt)]}>
            {/* <mesh position={[0, lightPosition, 0]}>
                <cylinderGeometry args={[lightWidth, lightWidth, lightHeight]} />
                <meshStandardMaterial color={color} transparent opacity={0.5} emissive={color} emissiveIntensity={10} />
            </mesh> */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[lightWidth, lightWidth, lightHeight]} />
                <meshStandardMaterial color={color} transparent opacity={0.5} emissive={color} emissiveIntensity={10} />
            </mesh>
        </group>
    )
}

export default Pulsar