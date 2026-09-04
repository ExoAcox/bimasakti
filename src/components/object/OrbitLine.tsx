import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { Vector3, Matrix4 } from 'three';
import { useFrame } from '@react-three/fiber';
import type { Line2 } from 'three-stdlib';

interface OrbitLineProps {
    radius: number;
    segments?: number;
    color?: string;
    opacity?: number;
    fadeFactor?: number;
}

const tempMatrix = new Matrix4();
const tempCamPos = new Vector3();

const OrbitLine = ({ radius, segments = 1280, color, opacity = 0.5 }: OrbitLineProps) => {
    const lineRef = useRef<Line2>(null);

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

    useFrame((state) => {
        if (!lineRef.current || !lineRef.current.material || radius <= 0) return;

        // Transform camera position into local space of OrbitLine
        tempMatrix.copy(lineRef.current.matrixWorld).invert();
        tempCamPos.copy(state.camera.position).applyMatrix4(tempMatrix);

        const lx = tempCamPos.x;
        const ly = tempCamPos.y;
        const lz = tempCamPos.z;

        const d_xz = Math.sqrt(lx * lx + lz * lz);
        // Distance from camera to closest point on orbit circle
        const distToCircle = Math.sqrt((d_xz - radius) * (d_xz - radius) + ly * ly);

        // Fade distance threshold: 50% of orbit radius, capped at 10000 so vast orbits remain visible from far away
        const targetDist = Math.min(radius * 3, 10000000);
        const ratioCircle = targetDist > 0 ? distToCircle / targetDist : 1;

        // Smoothstep curve for smooth fade transitions
        const clamped = Math.max(0, Math.min(1, ratioCircle));
        const smoothRatio = clamped * clamped * (3 - 2 * clamped);

        const currentOpacity = opacity * smoothRatio;

        lineRef.current.material.opacity = currentOpacity;
        lineRef.current.material.transparent = true;
    });

    return (
        <Line
            ref={lineRef}
            points={points}
            color={color}
            lineWidth={2}
            transparent
            opacity={opacity}
        />
    );
};

export default OrbitLine;