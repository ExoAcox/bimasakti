/* eslint-disable react-hooks/immutability */
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
uniform float uIsSunset;
varying vec3 vWorldPosition;

void main() {
    vec3 rayDir = normalize(vWorldPosition - uCameraPosition);
    vec3 sunDir = normalize(uSunPosition - uCameraPosition);

    float height = rayDir.y;

    // 1. Daytime Mars atmospheric gradient
    vec3 dayZenith = vec3(0.09, 0.035, 0.02);
    vec3 dayUpper = vec3(0.38, 0.17, 0.09);
    vec3 dayMid = vec3(0.66, 0.33, 0.17);
    vec3 dayHorizon = vec3(0.78, 0.43, 0.23);
    vec3 dayGround = vec3(0.14, 0.06, 0.03);

    // 2. Sunset Mars atmospheric gradient (NASA Curiosity blue sunset)
    vec3 sunsetZenith = vec3(0.04, 0.05, 0.08);
    vec3 sunsetUpper = vec3(0.09, 0.11, 0.16);
    vec3 sunsetMid = vec3(0.18, 0.18, 0.22);
    vec3 sunsetHorizon = vec3(0.25, 0.18, 0.14);
    vec3 sunsetGround = vec3(0.05, 0.03, 0.02);

    vec3 zenithColor = mix(dayZenith, sunsetZenith, uIsSunset);
    vec3 upperSkyColor = mix(dayUpper, sunsetUpper, uIsSunset);
    vec3 midSkyColor = mix(dayMid, sunsetMid, uIsSunset);
    vec3 horizonColor = mix(dayHorizon, sunsetHorizon, uIsSunset);
    vec3 groundColor = mix(dayGround, sunsetGround, uIsSunset);

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

    float cosTheta = max(dot(rayDir, sunDir), 0.0);

    // Day Forward Scattering
    float dayWash = pow(cosTheta, 8.0) * 0.10;
    vec3 dayWashColor = vec3(0.70, 0.58, 0.50);

    // Sunset Mie Scattering: Focused, brilliant Blue Sunset cone from reference
    // Ambient upper glow
    float wideWash = pow(cosTheta, 5.0) * 0.18;
    vec3 wideBlue = vec3(0.28, 0.48, 0.82);

    // Focused core cyan-blue pillar
    float coreWash = pow(cosTheta, 18.0) * 0.32;
    vec3 coreBlue = vec3(0.50, 0.75, 1.0);

    // Bright inner solar radiance
    float innerSun = pow(cosTheta, 80.0) * 0.40;
    vec3 innerWhite = vec3(0.8, 0.9, 1.0);

    vec3 sunsetWashTotal = wideWash * wideBlue + coreWash * coreBlue + innerSun * innerWhite;

    vec3 finalWash = mix(dayWash * dayWashColor, sunsetWashTotal, uIsSunset);
    vec3 finalColor = skyColor + finalWash;

    gl_FragColor = vec4(finalColor, 1.0);
}
`

interface Props {
    sunPosition: [number, number, number]
    mode?: "day" | "sunset"
}

const Atmosphere = ({ sunPosition, mode = "day" }: Props) => {
    const { camera } = useThree()
    const meshRef = useRef<Mesh>(null)
    const isSunset = mode === "sunset" ? 1.0 : 0.0

    const uniforms = useMemo(
        () => ({
            uSunPosition: { value: new Vector3(...sunPosition) },
            uCameraPosition: { value: new Vector3() },
            uIsSunset: { value: isSunset },
        }),
        [sunPosition, isSunset]
    )

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(camera.position)
            uniforms.uCameraPosition.value.copy(camera.position)
            uniforms.uSunPosition.value.set(...sunPosition)
            uniforms.uIsSunset.value = isSunset
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

