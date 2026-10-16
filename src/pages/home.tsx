/* eslint-disable react-hooks/set-state-in-effect */
import {
    Navbar,
    Hero,
    Description,
    Earth,
    Universe,
    Liveview,
    Featured,
    Footer
} from "@components/homepage";
import SkyBox from "@components/object/SkyBox";
import { seo } from "@function";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import clsx from "clsx";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const meta = () =>
    seo({
        title: "Bimasakti - 3D Interactive Universe Observatory",
        description:
            "Explore the Milky Way galaxy, Solar System, and exoplanetary worlds in interactive real-time 3D simulation with Keplerian physics.",
    });

const Home = () => {
    const [orientation, setOrientation] = useState<string>("");
    const isLandscape = orientation === "landscape";

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

    return <div className="min-w-dvw min-h-dvh relative bg-black pt-32">
        <div className="fixed inset-0">
            <Canvas camera={{ position: [400, -300, 3] }}>
                <SkyBox path="/textures/milky_way.webp" size={1000} />
            </Canvas>
        </div>

        <Navbar />

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

        <div className="flex w-fit mx-auto items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[10px] sm:text-xs md:text-sm font-medium backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-accent/50 transition-colors">
            <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-accent"></span>
            </span>
            <span className="font-space-grotesk tracking-wide uppercase font-semibold">
                {t("ui.hero_badge")}
            </span>
        </div>


        <div className="w-dvw h-[120dvh] sm:h-[140dvh] lg:h-[160dvh] xl:h-[220dvh] flex flex-col relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="xl:flex-1">
                <Hero />
            </div>

            <Description />
        </div>
        <div className="max-w-7xl mx-auto relative z-2">
            <Universe />
            <Liveview />
            <Featured />
        </div>
        <Footer />
    </div >
}

export default Home