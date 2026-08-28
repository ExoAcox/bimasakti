/* eslint-disable react-hooks/purity */
import { Suspense, useRef, useState } from "react"
import { OrbitControls, useHelper, Stats, Bounds } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Mesh, PointLight, PointLightHelper } from "three"
import Boxes from "./components/Boxes"
import { EffectContext } from "./context"
import { Physics, RigidBody } from "@react-three/rapier"


const Scene = () => {
    const [isMoving, setMoving] = useState(true);

    const lightRef = useRef<PointLight>(null!);
    const sunRef = useRef<Mesh>(null!);

    useHelper(lightRef, PointLightHelper, 1, "red");

    useFrame((state) => {
        if (lightRef.current) {
            lightRef.current.position.x = Math.cos(state.clock.elapsedTime / 1.5) * 8;
            lightRef.current.position.z = Math.sin(state.clock.elapsedTime / 1.5) * 4;
        }

        if (sunRef.current) {
            sunRef.current.position.x = Math.cos(state.clock.elapsedTime / 1.5) * 8;
            sunRef.current.position.z = Math.sin(state.clock.elapsedTime / 1.5) * 4;
        }
    });

    return <>
        <pointLight position={[0, 0, 0]} intensity={80} color="yellow" distance={200} ref={lightRef} />
        <ambientLight />
        <OrbitControls enabled={isMoving} makeDefault />

        <mesh position={[0, 0, 0]} ref={sunRef}>
            <sphereGeometry args={[1]} />
            <meshBasicMaterial color="yellow" wireframe />
        </mesh>

        <Bounds margin={2} maxDuration={2} >
            <Boxes length={300} setMoving={setMoving} />
        </Bounds>

        <RigidBody>
            <mesh rotation-x={Math.PI / 2} position={[0, -30, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial color="lightblue" side={2} />
            </mesh>
        </RigidBody>


    </>
}



const Cube = () => {
    const [effects, setEffects] = useState({
        colorIndex: 0,
        isFalling: false,
        isInitial: true,
    })

    return <div className="w-dvw h-dvh">
        <EffectContext value={effects}>
            <Canvas camera={{ position: [7, 8, 10] }}>
                <Suspense>
                    <Physics gravity={[0, -10, 0]}>
                        <Scene />
                    </Physics>
                </Suspense>
                <Stats />
            </Canvas>
        </EffectContext>
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
            <button className="bg-blue-500 text-primary px-4 py-2 rounded" onClick={() => setEffects((effect) => ({
                ...effect,
                colorIndex: effect.colorIndex + 1
            }))}>
                Change color
            </button>
            <button className="bg-blue-500 text-primary px-4 py-2 rounded" onClick={() => setEffects((effect) => ({
                ...effect,
                isFalling: true,
                isInitial: false,
            }))}>
                Falling
            </button>
            <button className="bg-blue-500 text-primary px-4 py-2 rounded" onClick={() => setEffects((effect) => ({
                ...effect,
                isFalling: false
            }))}>
                Reset
            </button>
        </div>
    </div >

}

export default Cube