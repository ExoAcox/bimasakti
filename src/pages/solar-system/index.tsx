import { Bounds, OrbitControls, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useState } from "react"

import Sidebar from "./components/Sidebar"
import Scene from "./components/Scene"
import { ControlContext, type Control } from "./context"
import { planets } from "./constant"
import Planet from "./components/Planet"
import Sun from "./components/Sun"
import Satellite from "./components/Satellite"

const SolarSystem = () => {
    const [control, setControl] = useState({
        focus: "",
        speed: 1
    })

    const handleControl = (value: Control) => {
        setControl({
            ...control,
            ...value
        })
    }

    return <div className="w-dvw h-dvh">
        <ControlContext value={{ ...control, setControl: handleControl }}>
            <Canvas camera={{ near: 0.000001, far: 10000 }} >
                <ambientLight intensity={0.5} />
                <OrbitControls makeDefault />

                <color attach="background" args={['black']} />
                <Stars radius={200} count={20000} factor={5} />

                <Bounds>
                    <Scene>
                        <Sun>
                            {planets.map(planet => (
                                <Planet
                                    key={planet.id}
                                    id={planet.id}
                                >
                                    {planet.satellites.map(satellite => (
                                        <Satellite
                                            key={satellite.id}
                                            id={satellite.id}
                                            isSatellite
                                        />
                                    ))}
                                </Planet>
                            ))}
                        </Sun>
                    </Scene>
                </Bounds>
            </Canvas>
        </ControlContext>

        <Sidebar setControl={handleControl} />

    </div>
}

export default SolarSystem