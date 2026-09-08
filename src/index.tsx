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
import { useParams } from "react-router";
import NotFound from "@components/NotFound";

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
    const { universe } = useParams();


    const { focus, setControl } = useControlStore()

    useEffect(() => {
        if (focus) track('focus', { object: focus, universe })
    }, [focus, universe])

    const data = getUniverseById(universe!)
    const isMilkyWay = data?.id === "milky_way"

    if (!data) return <NotFound />

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
                    minDistance={data.minDistance}
                    maxDistance={data.maxDistance}
                    zoomSpeed={3} />

                <color attach="background" args={['black']} />

                <When condition={!isMilkyWay}>
                    <SkyBox />
                </When>

                <Bounds>
                    <Scene controlRef={controlRef}>
                        {data.component}
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

        <Header id={data.id} />
        <NavigationPanel />
        <When condition={!isMilkyWay}>
            <UserInterface />
        </When>
    </div>
}

export default UniversePage