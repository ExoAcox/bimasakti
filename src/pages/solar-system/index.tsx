import { Bounds, OrbitControls, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState } from "react"

import Scene from "./components/Scene"
import { ControlContext, type Control } from "./context"
import { belts, planets, SCALE, TIME_SCALE } from "./constant"
import { Asteroid, Planet, Satellite, Sun } from "./components/object"
import { DetailPanel as PanelDetail, SettingPanel, Sidebar } from "./components/panel"

const SolarSystem = () => {
    const cameraRef = useRef(null!)

    const [control, setControl] = useState({
        focus: "",
        focusIndex: 0,
        showSetting: false,
        sizeScale: SCALE,
        distanceScale: SCALE,
        speedScale: TIME_SCALE,
        showOrbitLine: true,
        ignoreAxis: false,
        pauseOrbitWhenFocus: true
    })

    const handleControl = (value: Control) => {
        setControl({
            ...control,
            ...value
        })
    }

    return <div className="w-dvw h-dvh">
        <ControlContext value={{ ...control, setControl: handleControl }}>
            <Canvas camera={{ near: 0.000001, far: 100000 }} onPointerMissed={() => setControl({ ...control, showSetting: false })}>
                <ambientLight intensity={0.5} />
                <OrbitControls makeDefault enableDamping ref={cameraRef} maxDistance={10000} />

                <color attach="background" args={['black']} />
                <Stars radius={30000} count={10000} factor={600} />

                <Bounds>
                    <Scene cameraRef={cameraRef}>
                        <Sun>
                            {planets.map(planet => (
                                <Planet
                                    key={planet.id}
                                    id={planet.id}
                                >
                                    {[...planet.satellites, ...(planet?.artificial_satellites || [])].map(satellite => (
                                        <Satellite
                                            key={satellite.id}
                                            id={satellite.id}
                                            isSatellite={planet.id}
                                        />
                                    ))}
                                </Planet>
                            ))}

                            {belts.map(belt => {
                                return Array.from({ length: 10 }, () => {
                                    return <Asteroid
                                        key={belt.id}
                                        data={belt}
                                        count={1000}
                                    />
                                })
                            })}
                        </Sun>
                    </Scene>
                </Bounds>
            </Canvas>

            <Sidebar />
            <SettingPanel />
            <PanelDetail />
        </ControlContext>
    </div>
}

export default SolarSystem