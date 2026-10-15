import { useGLTF } from "@react-three/drei"
import { Canvas, type CameraProps } from "@react-three/fiber"
import { Suspense, useState } from "react"
import Loader from "./Loader"

interface Props {
    children: React.ReactNode
    userInterface: React.ReactNode
    camera: CameraProps
}


useGLTF.setDecoderPath("/draco/")

const LiveviewCanvas = ({ children, userInterface, camera }: Props) => {
    const [isGrabbing, setIsGrabbing] = useState(false)

    return <div
        className={`w-dvw h-dvh overflow-hidden select-none touch-none ${isGrabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
        onPointerDown={() => setIsGrabbing(true)}
        onPointerUp={() => setIsGrabbing(false)}
    >
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
}

export default LiveviewCanvas