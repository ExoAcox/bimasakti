


import { useContext, useMemo, useRef } from "react"
import { Mesh } from "three"
import { SCALE, sun, TIME_SCALE } from "../constant"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, useTexture } from "@react-three/drei"
import { ControlContext } from "../context"



const Sun = ({ children }: { children: React.ReactNode }) => {
    const objectRef = useRef<Mesh>(null!)

    const radius = sun.radius / SCALE
    const axis = sun.axis * (Math.PI / 180)

    const texture = useTexture(`/solar-system/textures/${sun.texture}`)

    const { focus, setControl } = useContext(ControlContext)
    const { scene } = useThree()

    const focusedObject = useMemo(() => {
        if (!focus) return undefined

        const object = scene.getObjectByName(focus)
        if (!object) return undefined

        return { current: object }
    }, [focus, scene])


    useFrame(() => {
        const now = Date.now();
        const speed = ((now % 60000) / 60000) * Math.PI * 2;
        objectRef.current.rotation.y = speed / sun.rotate_duration * TIME_SCALE
    })

    return <>
        <pointLight intensity={100000} color="white" />

        <group rotation={[0, 0, axis]}>
            <Html occlude={focusedObject ? [focusedObject] : undefined} zIndexRange={[2, 0]}>
                {(focus && focus !== sun.id) && <button className="py-1 px-2 rounded-lg text-sm font-semibold bg-white" onClick={() => setControl({ focus: sun.id })}>{sun.name}</button>}
            </Html>


            <mesh ref={objectRef} name={sun.id} >
                <sphereGeometry args={[radius, 64, 64]} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {children}
        </group>
    </>
}


export default Sun