import { useGLTF } from "@react-three/drei"
import { Canvas, type CameraProps } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { IoArrowBack } from "react-icons/io5"
import { getUniverseById } from "@function"
import Loader from "./Loader"

interface Props {
    id: string
    children: React.ReactNode
    userInterface: React.ReactNode
    camera: CameraProps
}


useGLTF.setDecoderPath("/draco/")

const LiveviewCanvas = ({ id, children, userInterface, camera }: Props) => {
    const [isGrabbing, setIsGrabbing] = useState(false)
    const { t } = useTranslation()

    const universe = getUniverseById(id)

    return (
        <div
            className={`w-dvw h-dvh overflow-hidden select-none touch-none ${isGrabbing ? "cursor-grabbing" : "cursor-grab"
                }`}
            onPointerDown={() => setIsGrabbing(true)}
            onPointerUp={() => setIsGrabbing(false)}
        >
            <div
                className="fixed top-5 left-5 z-40 select-none"
                onPointerDown={(e) => e.stopPropagation()}
            >
                <Link
                    to={`/${universe.id}`}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-background backdrop-blur-xl border border-panel-border hover:border-accent/40 text-secondary hover:text-primary transition-all duration-200 hover:shadow-glow cursor-pointer"

                >
                    <IoArrowBack className="size-3 text-secondary group-hover:text-highlight group-hover:-translate-x-0.5 transition-all duration-200" />
                    <span className="text-xs font-semibold font-space-grotesk tracking-wide">
                        {t("ui.back_to", { universe: t(`object.${universe.id}.title`) })}
                    </span>
                </Link>
            </div>

            <Canvas
                shadows
                camera={camera}
            >
                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </Canvas>

            {userInterface}
        </div>
    )
}

export default LiveviewCanvas