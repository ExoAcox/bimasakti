/* eslint-disable react-hooks/set-state-in-effect */
import { Bounds, OrbitControls, useProgress, useGLTF, Stats, Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState, useEffect, Suspense } from "react"
import { track } from '@vercel/analytics';

import Scene from "@components/Scene"
import { useSettingStore, useControlStore } from "@state"
import { Header, DetailPanel, NavigationPanel, Sidebar, ControlPanel } from "@components/panel"
import { SkyBox } from "@components/object"
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import BlackholeWrapEffect from "@components/effect/BlackholeWrapEffect"
import Loader from "@components/Loader"
import { When } from "react-if";
import { useCelestial } from "@function";
import { Outlet, useSearchParams } from "react-router";


const UserInterface = ({ id }: { id: string }) => {
    const { active, progress } = useProgress()
    const [isLoaded, setLoaded] = useState(false)
    const { focus } = useControlStore()

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
        <When condition={id !== "milky_way"}>
            <When condition={id !== "sagittarius_a"}>
                <Sidebar />
            </When>
            <When condition={focus}>
                <ControlPanel id={focus} />
            </When>
            <DetailPanel />
        </When>
    )
}

useGLTF.setDecoderPath('/draco/')

const CanvasLayout = () => {
    const controlRef = useRef(null!)
    const [searchParams] = useSearchParams();

    const data = useCelestial().getUniverse()
    const { setSetting } = useSettingStore()
    const { focus } = useControlStore()

    const skyboxTexture = data.id === "sagittarius_a" ? "/textures/nebula.jpg" : "/textures/milky_way.jpg"

    useEffect(() => {
        if (focus) track('focus', { object: focus, universe: data.id })
    }, [focus, data.id])

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return <div className="w-dvw h-dvh">
        <Canvas
            camera={{ near: 1e-7, far: 1e+7 }}
            onPointerMissed={() => setSetting({ showSetting: false })}>

            <When condition={import.meta.env.DEV || searchParams.get('dev')}>
                <Stats className="top-auto! left-auto! bottom-0! right-0!" />
            </When>

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

                <When condition={data.id !== "milky_way"}>
                    <SkyBox path={skyboxTexture} />
                </When>

                <Bounds>
                    <Scene controlRef={controlRef}>
                        <Outlet />
                    </Scene>
                </Bounds>

                <EffectComposer>
                    <BlackholeWrapEffect />
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
        <UserInterface id={data.id} />
    </div>
}

export default CanvasLayout