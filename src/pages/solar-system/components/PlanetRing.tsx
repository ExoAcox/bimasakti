import { useTexture } from "@react-three/drei";
import type { Planet } from "../constant";

import { SCALE } from "../constant";
import { useEffect, useLayoutEffect, useRef } from "react";
import { BufferGeometry, Mesh, Vector3 } from "three";


interface Props {
    data: Planet
}

const PlanetRing = ({ data }: Props) => {
    const ringRef = useRef<Mesh>(null!);

    const texture = useTexture(`/solar-system/textures/${data.ring?.texture}`)

    const axis = data.axis * (Math.PI / 180)

    const innerRadius = data.ring.inner_radius / SCALE
    const outerRadius = data.ring.outer_radius / SCALE

    // useLayoutEffect(() => {
    //     if (ringRef.current) {
    //         const pos = ringRef.current.geometry.attributes.position;

    //         const v3 = new Vector3();
    //         for (let i = 0; i < pos.count; i++) {
    //             console.log(v3.length())
    //             v3.fromBufferAttribute(pos, i);
    //             ringRef.current.geometry.attributes.uv.setXY(i, 1, 1);
    //         }
    //         ringRef.current.geometry.attributes.uv.needsUpdate = true;
    //     }
    // }, [ringRef])



    return <mesh rotation={[-Math.PI / 2, 0, axis]} ref={ringRef} castShadow receiveShadow>
        <ringGeometry
            args={[
                innerRadius,
                outerRadius,
                64,
            ]}
        />
        <meshStandardMaterial map={texture}
            side={2}
            transparent={true}
            opacity={1}

        />
    </mesh>
}

export default PlanetRing;