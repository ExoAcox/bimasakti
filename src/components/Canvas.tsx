/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { Bounds, useProgress, useGLTF, Stats, KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useState, useEffect, Suspense } from "react"
import { track } from '@vercel/analytics';

import Scene from "@components/Scene"
import { useSettingStore, useControlStore } from "@state"
import { Header, DetailPanel, NavigationPanel, Sidebar, ControlPanel, SettingPanel } from "@components/panel"
import { SkyBox } from "@components/object"
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import BlackholeWrapEffect from "@components/effect/BlackholeWrapEffect"
import Loader from "@components/Loader"
import { Case, Default, Switch, When } from "react-if";
import { useCelestial } from "@function";
import { Outlet, useSearchParams } from "react-router";
import ThirdPersonScene from "./ThirdPersonScene";
import { keyboardMap } from "./object/Spaceship";



import { useThree, useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

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

const AutoCameraClip = () => {
    const { camera, controls } = useThree()

    useFrame(() => {
        const orbitControls = controls as unknown as OrbitControlsType
        if (!orbitControls.target) return

        const dist = camera.position.distanceTo(orbitControls.target)
        if (dist <= 0) return

        const targetNear = Math.max(1e-7, dist * 0.00005)
        console.log("Target near :", targetNear)

        if (Math.abs(camera.near - targetNear) / camera.near > 0.05) {
            camera.near = targetNear
            camera.updateProjectionMatrix()
        }
    })

    return null
}

useGLTF.setDecoderPath('/draco/')

const CanvasLayout = () => {
    const [searchParams] = useSearchParams();

    const data = useCelestial().getUniverse()
    const { mode, setSetting } = useSettingStore()
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
            camera={{ near: 1e-5, far: 1e+10 }}
            onPointerMissed={() => setSetting({ showSetting: false })}>

            <AutoCameraClip />

            <When condition={import.meta.env.DEV || searchParams.get('dev')}>
                <Stats className="top-auto! left-auto! bottom-0! right-0!" />
            </When>

            <Suspense fallback={<Loader />}>
                <ambientLight intensity={0.5} />
                <color attach="background" args={['black']} />

                <When condition={data.id !== "milky_way"}>
                    <SkyBox path={skyboxTexture} />
                </When>

                {/* <Physics gravity={[0, 0, 0]} debug> */}
                <KeyboardControls map={keyboardMap}>
                    <Bounds>
                        <Switch>
                            <Case condition={mode === "third-person"}>
                                <ThirdPersonScene />
                            </Case>
                            <Default>
                                <Scene data={data} />
                            </Default>
                        </Switch>

                        <Outlet />
                    </Bounds>
                </KeyboardControls>
                {/* </Physics> */}

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
        <SettingPanel />
        <UserInterface id={data.id} />
    </div>
}

export default CanvasLayout