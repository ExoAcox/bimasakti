/* eslint-disable react-hooks/immutability */
import { Earth, Hero } from "@components/homepage"
import SkyBox from "@components/object/SkyBox"
import { OrbitControls, Stars } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { useControlStore } from "@state"
import clsx from "clsx"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { When } from "react-if"
import type { PerspectiveCamera } from "three"
import { OrbitControls as OrbitControlsType } from "three-stdlib"



const Home = () => {
    const [orientation, setOrientation] = useState<string>("")
    const parentRef = useRef<HTMLDivElement>(null!)

    const { setControl } = useControlStore()

    useLayoutEffect(() => {
        setControl({ focus: "earth" })
    }, [setControl])

    useLayoutEffect(() => {
        if (parentRef.current) {
            const { clientWidth, clientHeight } = parentRef.current
            console.log(clientWidth, clientHeight)
            setOrientation(clientWidth > clientHeight ? "landscape" : "portrait")
        }
    }, [parentRef])

    console.log(orientation)


    return <div className="w-dvw h-dvh relative overflow-hidden bg-black" ref={parentRef}>
        <div className="h-dvh w-dvw absolute top-0 left-0">
            <Canvas camera={{ position: [400, -300, 3] }}>
                <OrbitControls />

                <SkyBox path="/textures/milky_way.webp" size={1000} />
                {/* <Stars /> */}
            </Canvas>
        </div>
        <div className={clsx(orientation === "landscape" ? "h-dvh w-dvh" : "w-dvw h-dvw", "absolute -right-16 -bottom-16")}>
            <Canvas camera={{ position: [3, 3, 3] }}>

                <Earth />

                <EffectComposer>
                    <Bloom
                        intensity={1}
                        luminanceThreshold={1.0}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                </EffectComposer>
            </Canvas>
        </div >
        <div className={clsx(orientation === "landscape" ? "top-1/2 -translate-y-1/2 left-4" : "top-4 left-1/2 -translate-x-1/2", "absolute")}>
            <Hero />
        </div>
    </div >
}

export default Home