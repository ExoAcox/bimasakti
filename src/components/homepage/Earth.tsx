import { Atmosphere, Aurora, NightMaterial, PlanetCloud } from "@components/object"
import { planets } from "@constants/solar-system/planet"
import { useFrame } from "@react-three/fiber"
import type { Planet } from "@types"
import { useRef } from "react"
import { MathUtils, Vector3, type Mesh } from "three"




const data = planets.find(planet => planet.id === "earth")! as Planet


const Earth = () => {
    const earthRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const axis = MathUtils.degToRad(data.axis)

    useFrame((state, delta) => {
        if (!earthRef.current) return

        earthRef.current.rotation.y += delta * 0.06
        cloudRef.current.rotation.y += delta * 0.07
    })

    return <>
        <ambientLight />
        <directionalLight position={[3, 3, 3]} />
        <group rotation={[0, 0, axis]} scale={3}>
            <mesh castShadow receiveShadow ref={earthRef}>
                <sphereGeometry args={[1, 128, 64]} />
                <NightMaterial
                    textures={[
                        `/textures/earth.ktx2`,
                        `/textures/earth_night.ktx2`,
                    ]}
                    lightPosition={new Vector3(-30, -30, 100)}
                />
            </mesh>

            <PlanetCloud
                data={data}
                cloudRef={cloudRef}
                scale={1.001}
                forceFocus
            />

            <Atmosphere data={data} forceFocus />
            <Aurora data={data} forceFocus />
        </group>
    </>
}

export default Earth