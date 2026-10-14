/* eslint-disable react-hooks/set-state-in-effect */
import { Description, Earth, Universe, Hero, Featured } from "@components/homepage"
import SkyBox from "@components/object/SkyBox"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import clsx from "clsx"
import { useLayoutEffect, useState } from "react"

const Home = () => {
    const [orientation, setOrientation] = useState<string>("")
    const isLandscape = orientation === "landscape"

    useLayoutEffect(() => {
        const { innerWidth, innerHeight } = window
        setOrientation(innerWidth > innerHeight ? "landscape" : "portrait")
    }, [])

    return <div className="min-w-dvw min-h-dvh relative bg-black">
        <div className="fixed inset-0">
            <Canvas camera={{ position: [400, -300, 3] }}>
                <SkyBox path="/textures/milky_way.webp" size={1000} />
            </Canvas>
        </div>
        <div className="absolute h-dvh w-dvw top-0 left-0">

            <div className={clsx(isLandscape ? "h-[75dvw] w-dvw" : "w-dvw h-dvw", "absolute z-3 left-1/2 bottom-0 -translate-x-1/2 translate-y-3/5")}>
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
        </div>

        <div className="w-dvw h-[150dvh] sm:h-[170dvh] md:h-[250dvh] flex flex-col relative max-w-7xl mx-auto px-4">
            <div className="md:flex-1">
                <Hero />
            </div>

            <Description />
        </div>
        <div className="max-w-7xl mx-auto relative z-2">
            <Universe />
            <Featured />
        </div>

    </div >
}

export default Home