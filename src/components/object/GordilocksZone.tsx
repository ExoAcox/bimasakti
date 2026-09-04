import { useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Matrix4, Group, MeshBasicMaterial } from 'three';
import type { Star } from "@types";
import { SCALE } from "@constants";
import { ControlContext } from '@context';
import { useCelestial } from '@function';

interface Props {
    data: Star
}

const tempMatrix = new Matrix4();
const tempCamPos = new Vector3();

const GordilocksZone = ({ data }: Props) => {
    const groupRef = useRef<Group>(null);
    const innerRef = useRef<MeshBasicMaterial>(null);
    const outerRef = useRef<MeshBasicMaterial>(null);

    const { focus } = useContext(ControlContext)
    const focusedObject = useCelestial().getObjectById(focus)

    const innerRadius = data.gordilocks.inner_radius / SCALE;
    const outerRadius = data.gordilocks.outer_radius / SCALE;

    const innerColor = "#dddd22";
    const outerColor = "#22dddd";

    const baseInnerOpacity = 0.015;
    const baseOuterOpacity = 0.015;



    useFrame((state) => {
        if (focus && focusedObject?.type !== "star") return;
        if (!groupRef.current || outerRadius <= 0) return;

        // Transform camera position into local space of GordilocksZone
        tempMatrix.copy(groupRef.current.matrixWorld).invert();
        tempCamPos.copy(state.camera.position).applyMatrix4(tempMatrix);

        const lx = tempCamPos.x;
        const ly = tempCamPos.y;
        const lz = tempCamPos.z;

        const distToCenter = Math.sqrt(lx * lx + ly * ly + lz * lz);

        // Fade distance threshold: 3x outerRadius (similar threshold logic to OrbitLine)
        const targetDist = Math.min(outerRadius * 3, 10000000);
        const ratio = targetDist > 0 ? distToCenter / targetDist : 1;

        // Smoothstep curve for smooth fade transitions
        const clamped = Math.max(0, Math.min(1, ratio));
        const smoothRatio = clamped * clamped * (3 - 2 * clamped);

        if (innerRef.current) {
            innerRef.current.opacity = baseInnerOpacity * smoothRatio;
            innerRef.current.transparent = true;
        }

        if (outerRef.current) {
            outerRef.current.opacity = baseOuterOpacity * smoothRatio;
            outerRef.current.transparent = true;
        }
    });

    if (focus && focus !== "sun") return null

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry
                    args={[
                        innerRadius,
                        64,
                        64,
                    ]}
                />
                <meshBasicMaterial
                    ref={innerRef}
                    transparent={true}
                    opacity={baseInnerOpacity}
                    color={innerColor}
                />
            </mesh>
            <mesh>
                <sphereGeometry
                    args={[
                        outerRadius,
                        64,
                        64,
                    ]}
                />
                <meshBasicMaterial
                    ref={outerRef}
                    transparent={true}
                    opacity={baseOuterOpacity}
                    color={outerColor}
                />
            </mesh>
        </group>
    );
};

export default GordilocksZone;