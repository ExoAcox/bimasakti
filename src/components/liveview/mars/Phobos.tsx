interface Props {
    position?: [number, number, number]
    scale?: number
}

const PHOBOS_DEFAULT_POSITION: [number, number, number] = [-90, 90, 30]

const Phobos = ({
    position = PHOBOS_DEFAULT_POSITION,
    scale = 0.5,
}: Props) => {


    return (<mesh scale={[scale, scale, scale]} position={position}>
        <sphereGeometry />
        <meshStandardMaterial
            color="white"
            // emissive="red"
            emissiveIntensity={0.55}
            fog={false}
        />
    </mesh>
    )
}

export default Phobos
