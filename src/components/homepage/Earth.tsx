import { Atmosphere, Aurora, NightMaterial, PlanetCloud } from "@components/object"
import { planets } from "@constants/solar-system/planet"
import { useDetectGPU } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type { Planet } from "@types"
import { useRef } from "react"
import { MathUtils, Vector3, type Mesh } from "three"




const data = planets.find(planet => planet.id === "earth")! as Planet


const Earth = () => {
    const earthRef = useRef<Mesh>(null!)

    const axis = MathUtils.degToRad(data.axis)
    const isMobile = useDetectGPU().isMobile

    useFrame((_, delta) => {
        if (!earthRef.current) return

        earthRef.current.rotation.y += delta * 0.06
    })

    return <>
        <ambientLight />
        <directionalLight position={[3, 3, 3]} />
        <group rotation={[0, 0, axis]} scale={3} ref={earthRef}>
            <mesh castShadow receiveShadow >
                <sphereGeometry args={[1, 128, 64]} />
                <NightMaterial
                    textures={[
                        `/textures/${isMobile ? "earth" : "earth_hd"}.ktx2`,
                        `/textures/${isMobile ? "earth_night" : "earth_night_hd"}.ktx2`,
                    ]}
                    lightPosition={new Vector3(-30, -30, 100)}
                />
            </mesh>

            <PlanetCloud
                data={data}
                forceFocus
            />

            <Atmosphere data={data} forceFocus />
            <Aurora data={data} forceFocus />
        </group>
    </>
}

export default Earth