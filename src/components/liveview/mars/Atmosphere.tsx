import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { BackSide, Vector3, type Mesh } from "three"

const atmosphereVertexShader = `
varying vec3 vWorldPosition;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
uniform vec3 uSunPosition;
uniform vec3 uCameraPosition;
varying vec3 vWorldPosition;

void main() {
    vec3 rayDir = normalize(vWorldPosition - uCameraPosition);
    vec3 sunDir = normalize(uSunPosition - uCameraPosition);

    float height = rayDir.y;

    // Physically-based Mars atmospheric gradient:
    // 1. Zenith: Mars atmosphere is very thin (~0.6% Earth pressure), so zenith sky is deep dark tawny/sepia
    vec3 zenithColor = vec3(0.09, 0.035, 0.02);
    // 2. High sky: Soft dusky copper
    vec3 upperSkyColor = vec3(0.38, 0.17, 0.09);
    // 3. Mid sky: Classic Mars butterscotch ochre
    vec3 midSkyColor = vec3(0.66, 0.33, 0.17);
    // 4. Horizon: Dense suspended iron-oxide dust haze
    vec3 horizonColor = vec3(0.78, 0.43, 0.23);
    // 5. Ground direction below horizon: Dark Martian soil tone
    vec3 groundColor = vec3(0.14, 0.06, 0.03);

    vec3 skyColor;
    if (height > 0.0) {
        float h = pow(height, 0.62);
        if (h < 0.32) {
            skyColor = mix(horizonColor, midSkyColor, h / 0.32);
        } else if (h < 0.72) {
            skyColor = mix(midSkyColor, upperSkyColor, (h - 0.32) / 0.40);
        } else {
            skyColor = mix(upperSkyColor, zenithColor, (h - 0.72) / 0.28);
        }
    } else {
        skyColor = mix(horizonColor, groundColor, clamp(-height * 4.0, 0.0, 1.0));
    }

    // Mars Mie Forward-Scattering: gentle atmospheric wash towards the sun
    float cosTheta = max(dot(rayDir, sunDir), 0.0);
    float skySunWash = pow(cosTheta, 8.0) * 0.10;
    vec3 sunWashColor = vec3(0.70, 0.58, 0.50);

    vec3 finalColor = skyColor + skySunWash * sunWashColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
`

const Atmosphere = ({ sunPosition }: { sunPosition: [number, number, number] }) => {
    const { camera } = useThree()
    const meshRef = useRef<Mesh>(null)

    const uniforms = useMemo(
        () => ({
            uSunPosition: { value: new Vector3(...sunPosition) },
            uCameraPosition: { value: new Vector3() },
        }),
        [sunPosition]
    )

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(camera.position)
            uniforms.uCameraPosition.value.copy(camera.position)
            uniforms.uSunPosition.value.set(...sunPosition)
        }
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1200, 32, 32]} />
            <shaderMaterial
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={uniforms}
                side={BackSide}
                depthWrite={false}
                fog={false}
            />
        </mesh>
    )
}

export default Atmosphere

