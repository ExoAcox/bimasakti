


import { useRef } from "react"
import { Mesh } from "three"
import { SCALE, sun, TIME_SCALE } from "../constant"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"



const Sun = ({ children }: { children: React.ReactNode }) => {
    const objectRef = useRef<Mesh>(null!)

    const radius = sun.radius / SCALE
    const axis = sun.axis * (Math.PI / 180)

    const texture = useTexture(`/solar-system/textures/${sun.texture}`)


    useFrame(() => {
        const now = Date.now();
        const speed = ((now % 60000) / 60000) * Math.PI * 2;
        objectRef.current.rotation.y = speed / sun.rotate_duration * TIME_SCALE
    })

    return <>
        <pointLight intensity={100000} color="white" />

        <group rotateZ={axis}>
            <mesh ref={objectRef} name={sun.id} >
                <sphereGeometry args={[radius, 64, 64]} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {children}
        </group>
    </>
}


export default Sun