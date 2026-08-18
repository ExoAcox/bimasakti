/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
import { useBounds } from "@react-three/drei"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Color, type InstancedMesh, Mesh } from "three"
import { InstancedRigidBodies, RapierRigidBody, type InstancedRigidBodyProps } from "@react-three/rapier"
import { getRandomColor } from "../function"
import { EffectContext } from "../context"
import BoundBox from "./BoundBox"
import gsap from "gsap"

const Boxes = ({ length, setMoving }: { length: number, setMoving: (isMoving: boolean) => void }) => {
    const [clicked] = useState(false)
    const meshRef = useRef<InstancedMesh>(null!)
    const rigidRef = useRef<RapierRigidBody[]>(null!)
    const boundRef = useRef<Mesh>(null!)
    const bound = useBounds()
    const cubeRoot = Math.floor(Math.cbrt(length))
    const cubeCount = cubeRoot * cubeRoot * cubeRoot

    const { colorIndex, isFalling, isInitial } = useContext(EffectContext);



    // const { camera } = useThree()
    // const smoothTarget = useRef(new Vector3())




    // useFrame((state) => {
    //   if (ref.current) {

    //     ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 10
    //   }
    // })

    // useLayoutEffect(() => {
    //     setMoving(false)
    //     bound.refresh().fit()
    //     setTimeout(() => {
    //         setMoving(true)
    //     }, 1500)
    // }, [])

    const onClick = (e: ThreeEvent<MouseEvent>) => {
        rigidRef.current[e.instanceId!].wakeUp()
        rigidRef.current[e.instanceId!].applyImpulse({ x: 0, y: 40, z: 0 }, true)
    }

    const boundFocus = () => {
        if (boundRef.current && !isFalling) {
            setMoving(false)
            bound.refresh(boundRef.current).clip().fit()
            setTimeout(() => {
                setMoving(true)
            }, 1000)
        }
    }



    const instances = useMemo(() => {
        const instances: InstancedRigidBodyProps[] = [];

        for (let i = 0; i < cubeCount; i++) {
            const randomDimension = Math.floor(Math.random() * 3) + 1;
            const randomSide = Math.floor(Math.random() * 2) + 1;
            const dimension = randomDimension === 1 ? 'x' : randomDimension === 2 ? 'y' : 'z';
            const side = randomSide === 1 ? 1 : -1;
            const position = [(i % cubeRoot * 2) - (cubeRoot - 1), Math.floor(i / (cubeRoot * cubeRoot)) * 2 - (cubeRoot - 1), Math.floor((i / cubeRoot) % cubeRoot) * 2 - (cubeRoot - 1)] as [x: number, y: number, z: number];

            instances.push({
                key: "box_" + i,
                position,
                userData: {
                    dimension,
                    side
                }
            });
        }

        return instances;
    }, [cubeCount, cubeRoot]);

    useLayoutEffect(() => {
        boundFocus()
    }, [boundRef]);

    useEffect(() => {
        if (!isFalling) return;


        // setMoving(false)
        rigidRef.current.forEach(instance => {
            instance.wakeUp()
            instance.setGravityScale(3, true)
        })

        // bound.moveTo([15, -10, 20]).lookAt({ target: [4, -20, 6] })

        // setTimeout(() => {
        //     setMoving(true)
        // }, 2000)
    }, [isFalling]);

    const colors = useMemo(() => {
        return Array.from({ length: cubeCount }).map(() => {
            return getRandomColor()
        })
    }, [cubeCount, colorIndex])

    useEffect(() => {
        if (!meshRef.current || !instances) return;

        instances.forEach((_, i) => {
            const color = getRandomColor()
            meshRef.current.setColorAt(i, new Color(color))
        })


    }, [instances, meshRef])

    const emptyColor = useMemo(() => new Color(), [])


    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.computeBoundingSphere()
            meshRef.current.computeBoundingBox()
        }
    })


    useFrame((_, delta) => {
        instances.forEach((_, i) => {
            const color = meshRef.current.getColorAt(i, emptyColor).lerp(new Color(colors[i]), delta)
            meshRef.current.setColorAt(i, new Color(color))
            meshRef.current.instanceColor.needsUpdate = true
        })


        if (rigidRef.current && !isFalling && !isInitial) {
            rigidRef.current.forEach((body, i) => {
                body.setBodyType(2, true);
                // body.setLinvel({ x: 0, y: 0, z: 0 }, true)
                // body.setAngvel({ x: 0, y: 0, z: 0 }, true);
                body.setGravityScale(0, true);

                const currentPos = body.translation();
                const targetPos = instances[i].position;

                const proxy = { x: currentPos.x, y: currentPos.y, z: currentPos.z };

                gsap.to(proxy, {
                    x: targetPos[0],
                    y: targetPos[1],
                    z: targetPos[2],
                    duration: 1,
                    // ease: "power2.out",
                    onUpdate: () => {
                        body.setNextKinematicTranslation({ x: proxy.x, y: proxy.y, z: proxy.z });
                        // body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false);
                    },
                    onComplete: () => {
                        body.setBodyType(0, true)
                    }
                });
            })
        }
    })

    return <>
        <BoundBox count={cubeRoot} ref={boundRef} />
        <InstancedRigidBodies instances={instances} ref={rigidRef} gravityScale={0}>
            <instancedMesh args={[undefined, undefined, cubeCount]} count={cubeCount} ref={meshRef} onClick={onClick} onPointerMissed={boundFocus}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="lightblue" wireframe={clicked} />
            </instancedMesh>
        </InstancedRigidBodies>
    </>
}

export default Boxes