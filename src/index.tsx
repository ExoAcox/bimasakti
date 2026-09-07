/* eslint-disable react-hooks/set-state-in-effect */
import { Bounds, OrbitControls, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState, useEffect, Suspense } from "react"
import { track } from '@vercel/analytics';

import Scene from "@components/Scene"
import { useControlStore } from "@state"
import { Header, DetailPanel, Sidebar, NavigationPanel } from "@components/panel"
import { SkyBox } from "@components/object"
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import Loader from "@components/Loader"
import { When } from "react-if";
import { getUniverseById } from "@function";

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
            <Sidebar />
            <DetailPanel />
        </>
    )
}

const UniversePage = () => {
    const controlRef = useRef(null!)

    const { universe: currentUniverse, focus, setControl } = useControlStore()

    useEffect(() => {
        if (focus) track('focus', { object: focus, universe: currentUniverse })
    }, [focus, currentUniverse])

    const universe = getUniverseById(currentUniverse)
    const isMilkyWay = currentUniverse === "milky_way"

    return <div className="w-dvw h-dvh">
        <Canvas
            camera={{ near: 0.000001, far: 10000000 }}
            onPointerMissed={() => setControl({ showSetting: false })}>
            <Suspense fallback={<Loader />}>
                <ambientLight intensity={0.5} />
                <OrbitControls
                    makeDefault
                    enableDamping
                    ref={controlRef}
                    minDistance={universe?.minDistance}
                    maxDistance={universe?.maxDistance}
                    zoomSpeed={3} />

                <color attach="background" args={['black']} />

                <When condition={!isMilkyWay}>
                    <SkyBox />
                </When>

                <Bounds>
                    <Scene controlRef={controlRef}>
                        {universe?.component}
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
            <NavigationPanel controlRef={controlRef} />
        </Canvas>

        <Header />


        <When condition={!isMilkyWay}>
            <UserInterface />
        </When>
    </div>
}

export default UniversePage