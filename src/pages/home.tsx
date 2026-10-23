/* eslint-disable react-hooks/set-state-in-effect */
import {
    Navbar,
    Hero,
    Earth,
    Universe,
    Liveview,
    Featured,
    Footer
} from "@components/homepage";
import { Galaxy } from "@components/object";
import SkyBox from "@components/object/SkyBox";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import clsx from "clsx";
import { Suspense, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const Loading = () => {
    return (
        <Html fullscreen>
            <div className="w-full h-full flex justify-center pointer-events-none">
                <svg
                    className="size-16 animate-spin text-white opacity-80"
                    viewBox="0 0 24 24"
                >
                    <circle
                        cx="12"
                        cy="12"

                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>
        </Html>
    );
};

const Home = () => {
    const [orientation, setOrientation] = useState<string>("");
    const isLandscape = orientation === "landscape";
    const { progress } = useProgress()

    const { t } = useTranslation()

    useLayoutEffect(() => {
        const { innerWidth, innerHeight } = window;
        setOrientation(innerWidth > innerHeight ? "landscape" : "portrait");

        const handleResize = () => {
            const { innerWidth, innerHeight } = window;
            setOrientation(innerWidth > innerHeight ? "landscape" : "portrait");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
        document.body.style.overflow = progress < 100 ? "hidden" : "auto"
    }, [progress])

    return <div className="min-w-dvw min-h-dvh relative bg-black pt-32">
        <div className="fixed inset-0">
            <Canvas camera={{ position: [400, -300, 3] }}>
                <SkyBox path="/textures/milky_way.webp" size={1000} />
            </Canvas>
        </div>

        <Navbar />


        <div className="absolute h-dvh w-dvw top-0 left-0">
            <div className={clsx(isLandscape ? "h-[75dvw] w-dvw" : "w-dvw h-dvw", "absolute z-3 left-1/2 bottom-0 -translate-x-1/2 translate-y-3/5 cursor-grab active:cursor-grabbing")}>
                <Canvas camera={{ position: [3, 3, 3] }}>
                    <OrbitControls enablePan={false} enableZoom={false} />
                    <Suspense fallback={<Loading />}>
                        <Earth />

                        <EffectComposer>
                            <Bloom
                                intensity={1}
                                luminanceThreshold={1.0}
                                luminanceSmoothing={0.9}
                                mipmapBlur
                            />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
            </div >
        </div>


        <div className="flex w-fit mx-auto items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[10px] md:text-xs lg:text-sm font-medium backdrop-blur">
            {/* <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-accent"></span>
            </span> */}
            <span className="font-space-grotesk tracking-wide uppercase font-semibold">
                {t("ui.hero_badge")}
            </span>
        </div>

        <Hero />

        <div className="max-w-7xl mx-auto relative z-2 px-4 sm:px-6">
            <div className="hidden xl:block w-full aspect-video">
                <Canvas camera={{ position: [-2, -12, -5] }}>
                    <Galaxy />
                </Canvas>
            </div>
            <Universe />
            <Liveview />
            <Featured />
        </div>
        <Footer />
    </div >
}

export default Home