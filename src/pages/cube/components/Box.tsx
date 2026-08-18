/* eslint-disable react-hooks/purity */

import { animated, useSpring } from "@react-spring/three";
import { Instance } from "@react-three/drei"
import type { ThreeEvent } from "@react-three/fiber"
import { useContext, useEffect } from "react"
import { ColorContext } from "../context";
import { RigidBody } from "@react-three/rapier";
import { getRandomColor } from "../function";



interface Props {
    index: number;
    cubeRoot: number;
    onClick: (e: ThreeEvent<MouseEvent>) => void;
    onPointerMissed: () => void;
}



const AnimatedInstance = animated(Instance)

const Box = ({ index, cubeRoot, onClick, onPointerMissed }: Props) => {
    const randomDimension = Math.floor(Math.random() * 3) + 1;
    const randomSide = Math.floor(Math.random() * 2) + 1;
    const dimension = randomDimension === 1 ? 'x' : randomDimension === 2 ? 'y' : 'z';
    const side = randomSide === 1 ? 1 : -1;
    const position = [(index % cubeRoot * 2) - (cubeRoot - 1), Math.floor(index / (cubeRoot * cubeRoot)) * 2 - (cubeRoot - 1), Math.floor((index / cubeRoot) % cubeRoot) * 2 - (cubeRoot - 1)] as [x: number, y: number, z: number];

    const colorIndex = useContext(ColorContext);

    const [springs, api] = useSpring(
        () => ({
            color: getRandomColor(),
            config: key => {
                switch (key) {
                    case 'color':
                        return {
                            mass: 20,
                        }
                }
            },
        }),
        []
    )

    useEffect(() => {
        api.start({ color: getRandomColor() })
    }, [colorIndex, api])


    return (<RigidBody>
        <AnimatedInstance
            key={index}
            color={springs.color}
            userData={{ dimension, side }}
            position={position}
            onClick={(e) => {
                onClick(e);
            }}
            onPointerMissed={onPointerMissed}
        />
    </RigidBody>
    );
}

export default Box