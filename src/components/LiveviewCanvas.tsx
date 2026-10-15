import { useGLTF } from "@react-three/drei"
import { useState } from "react"

interface Props {
    children: React.ReactNode
}


useGLTF.setDecoderPath("/draco/")

const LiveviewCanvas = ({ children }: Props) => {
    const [isGrabbing, setIsGrabbing] = useState(false)

    return <div
        className={`w-dvw h-dvh overflow-hidden select-none touch-none ${isGrabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
        onPointerDown={() => setIsGrabbing(true)}
        onPointerUp={() => setIsGrabbing(false)}
    >
        {children}
    </div>
}

export default LiveviewCanvas