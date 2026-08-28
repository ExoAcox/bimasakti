import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

const OrbitLine = ({ radius, segments = 1280, color, opacity = 0.5 }) => {
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push(new Vector3(
                Math.cos(theta) * radius,
                0,
                Math.sin(theta) * radius
            ));
        }
        return pts;
    }, [radius, segments]);


    return (
        <Line
            points={points}
            color={color}
            lineWidth={2}
            transparent
            opacity={opacity}
        />
    );
}

export default OrbitLine