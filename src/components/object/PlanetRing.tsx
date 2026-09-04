import { useTexture } from "@react-three/drei";
import type { Planet } from "@types";

import { SCALE } from "@constants";
import { useLayoutEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";


interface Props {
    data: Planet
}

const PlanetRing = ({ data }: Props) => {
    const ringRef = useRef<Mesh>(null!);

    const texture = useTexture(`/solar-system/textures/${data.ring?.texture}`)

    const axis = data.axis * (Math.PI / 180)

    const innerRadius = data.ring.inner_radius / SCALE
    const outerRadius = data.ring.outer_radius / SCALE

    useLayoutEffect(() => {
        if (ringRef.current) {
            const geometry_ring = ringRef.current.geometry;
            const pos = geometry_ring.attributes.position;
            const mid_point = 0.5 * (innerRadius + outerRadius);
            const v3 = new Vector3();
            for (let i = 0; i < pos.count; ++i) {
                v3.fromBufferAttribute(pos, i);
                geometry_ring.attributes.uv.setXY(i, v3.length() < mid_point ? 0 : 1, 0);
            }
            geometry_ring.attributes.uv.needsUpdate = true;
        }
    }, [innerRadius, outerRadius]);



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