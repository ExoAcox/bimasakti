

const Moons = () => {

    const phobosPosition: [number, number, number] = [-90, 90, 30]
    const deimosPosition: [number, number, number] = [-50, 120, -50]

    const phobosScale = 0.5
    const deimosScale = 0.2

    return (<>
        <mesh scale={phobosScale} position={phobosPosition}>
            <sphereGeometry />
            <meshStandardMaterial
                color="white"
                // emissive="white"
                // emissiveIntensity={1}
                fog={false}
            />
        </mesh>
        <mesh scale={deimosScale} position={deimosPosition}>
            <sphereGeometry />
            <meshStandardMaterial
                color="white"
                // emissive="red"
                // emissiveIntensity={1}
                fog={false}
            />
        </mesh>
    </>
    )
}

export default Moons
