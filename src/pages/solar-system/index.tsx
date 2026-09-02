import { Bounds, OrbitControls, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState } from "react"

import Scene from "./components/Scene"
import { ControlContext, type Control } from "./context"
import { SCALE, TIME_SCALE } from "./constants"
import { Header, DetailPanel, Sidebar } from "./components/panel"
import { SolarSystem, AlphaCentauri } from "./universe"


const Universe = () => {
    const controlRef = useRef(null!)

    const [control, setControl] = useState({
        universe: "alpha-centauri",
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

    const universes = {
        "solar-system": {
            component: <SolarSystem />,
            maxDistance: 20000,
            stars: {
                radius: 20000 * 1.5,
                count: 20000 / 2,
                factor: 600
            }
        },
        "alpha-centauri": {
            component: <AlphaCentauri controlRef={controlRef} />,
            maxDistance: 4000000,
            stars: {
                radius: 20000 * 1.5,
                count: 20000 / 2,
                factor: 600
            }
        }
    }

    const universe = universes[control.universe]


    return <div className="w-dvw h-dvh">
        <ControlContext value={{ ...control, setControl: handleControl }}>
            <Canvas camera={{ near: 0.000001, far: universe.maxDistance * 2 }} onPointerMissed={() => setControl({ ...control, showSetting: false })}>
                <ambientLight intensity={0.5} />
                <OrbitControls makeDefault enableDamping ref={controlRef} maxDistance={universe.maxDistance} zoomSpeed={3} />

                <color attach="background" args={['black']} />
                <Stars radius={universe.stars.radius} count={universe.stars.count} factor={universe.stars.factor} />

                <Bounds>
                    <Scene controlRef={controlRef}>
                        {universe.component}
                    </Scene>
                </Bounds>
            </Canvas>

            <Header />
            <Sidebar />
            <DetailPanel />
        </ControlContext>
    </div>
}

export default Universe