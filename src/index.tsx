/* eslint-disable react-hooks/set-state-in-effect */
import { Bounds, OrbitControls, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState, useEffect, Suspense } from "react"

import Scene from "@components/Scene"
import { ControlContext, type Control } from "@context"
import { SCALE, TIME_SCALE } from "@constants"
import { Header, DetailPanel, Sidebar } from "@components/panel"
import { SolarSystem, AlphaCentauri } from "@universe"
import { SkyBox } from "@components/object"
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import Loader from "@components/Loader"

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
        component: <AlphaCentauri />,
        maxDistance: 4000000,
        stars: {
            radius: 20000 * 1.5,
            count: 20000 / 2,
            factor: 600
        }
    }
}

const UserInterface = () => {
    const { active, progress } = useProgress()
    const [isLoaded, setLoaded] = useState(false)

    useEffect(() => {
        if (active) {
            setLoaded(false)
        } else if (progress === 100) {
            const timer = setTimeout(() => setLoaded(true), 200)
            return () => clearTimeout(timer)
        }
    }, [active, progress])

    if (!isLoaded) return null

    return (
        <>
            <Header />
            <Sidebar />
            <DetailPanel />
        </>
    )
}

const Universe = () => {
    const controlRef = useRef(null!)

    const [control, setControl] = useState({
        universe: "solar-system",
        focus: "",
        focusIndex: 0,
        showDetail: false,
        showSetting: false,
        sizeScale: SCALE,
        distanceScale: SCALE,
        speedScale: TIME_SCALE,
        showOrbitLine: true,
        ignoreAxis: false,
        pauseOrbitWhenFocus: true
    })

    const handleControl = (value: Partial<Control>) => {
        setControl({
            ...control,
            ...value
        })
    }

    const universe = universes[control.universe]

    return <div className="w-dvw h-dvh">
        <ControlContext value={{ ...control, setControl: handleControl }}>
            <Canvas camera={{ near: 0.000001, far: 10000000 }} onPointerMissed={() => setControl({ ...control, showSetting: false })}>
                <Suspense fallback={<Loader />}>
                    <ambientLight intensity={0.5} />
                    <OrbitControls makeDefault enableDamping ref={controlRef} maxDistance={universe.maxDistance} zoomSpeed={3} />

                    <color attach="background" args={['black']} />
                    <SkyBox />

                    <Bounds>
                        <Scene controlRef={controlRef}>
                            {universe.component}
                        </Scene>
                    </Bounds>

                    <EffectComposer>
                        <Bloom
                            intensity={2}
                            luminanceThreshold={1.0}
                            luminanceSmoothing={0.9}
                            mipmapBlur
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            <UserInterface />
        </ControlContext>
    </div>
}

export default Universe