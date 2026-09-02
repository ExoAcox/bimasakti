


import { useContext, useMemo, useRef } from "react"
import { Color, ShaderMaterial, AdditiveBlending, BackSide, Mesh } from "three"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { ControlContext } from "../../context"
import type { Star as StarType } from "../../types"
import { Object } from "."
import { getObjectById } from "../../function"

const surfaceVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNormalModel;
varying vec3 vNormalView;
varying vec3 vPosition;
varying vec3 vLocalPosition;

void main() {
    vUv = uv;
    vLocalPosition = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vNormalModel = normal;
    vNormalView = normalize(normalMatrix * normal);
    vPosition = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const surfaceFragmentShader = /* glsl */ `
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNormalModel;
varying vec3 vNormalView;
varying vec3 vPosition;
varying vec3 vLocalPosition;

// 3D Random
float random(in vec3 st) {
    return fract(sin(dot(st, vec3(12.9898, 78.233, 23.112))) * 12943.145);
}

// 3D Noise with 4D-like temporal evolution
float noise(in vec3 _pos) {
    vec3 i_pos = floor(_pos);
    vec3 f_pos = fract(_pos);

    float i_time = floor(u_time * 0.2);
    float f_time = fract(u_time * 0.2);

    float aa = random(i_pos + i_time);
    float ab = random(i_pos + i_time + vec3(1.0, 0.0, 0.0));
    float ac = random(i_pos + i_time + vec3(0.0, 1.0, 0.0));
    float ad = random(i_pos + i_time + vec3(1.0, 1.0, 0.0));
    float ae = random(i_pos + i_time + vec3(0.0, 0.0, 1.0));
    float af = random(i_pos + i_time + vec3(1.0, 0.0, 1.0));
    float ag = random(i_pos + i_time + vec3(0.0, 1.0, 1.0));
    float ah = random(i_pos + i_time + vec3(1.0, 1.0, 1.0));

    float ba = random(i_pos + (i_time + 1.0));
    float bb = random(i_pos + (i_time + 1.0) + vec3(1.0, 0.0, 0.0));
    float bc = random(i_pos + (i_time + 1.0) + vec3(0.0, 1.0, 0.0));
    float bd = random(i_pos + (i_time + 1.0) + vec3(1.0, 1.0, 0.0));
    float be = random(i_pos + (i_time + 1.0) + vec3(0.0, 0.0, 1.0));
    float bf = random(i_pos + (i_time + 1.0) + vec3(1.0, 0.0, 1.0));
    float bg = random(i_pos + (i_time + 1.0) + vec3(0.0, 1.0, 1.0));
    float bh = random(i_pos + (i_time + 1.0) + vec3(1.0, 1.0, 1.0));

    vec3 t = smoothstep(0.0, 1.0, f_pos);
    float t_time = smoothstep(0.0, 1.0, f_time);

    return mix(
        mix(
            mix(mix(aa, ab, t.x), mix(ac, ad, t.x), t.y),
            mix(mix(ae, af, t.x), mix(ag, ah, t.x), t.y),
            t.z
        ),
        mix(
            mix(mix(ba, bb, t.x), mix(bc, bd, t.x), t.y),
            mix(mix(be, bf, t.x), mix(bg, bh, t.x), t.y),
            t.z
        ),
        t_time
    );
}

#define NUM_OCTAVES 6
float fBm(in vec3 _pos, in float sz) {
    float v = 0.0;
    float a = 0.2;
    _pos *= sz;

    vec3 angle = vec3(-0.001 * u_time, 0.0001 * u_time, 0.0004 * u_time);
    mat3 rotx = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(angle.x), -sin(angle.x),
        0.0, sin(angle.x), cos(angle.x)
    );
    mat3 roty = mat3(
        cos(angle.y), 0.0, sin(angle.y),
        0.0, 1.0, 0.0,
        -sin(angle.y), 0.0, cos(angle.y)
    );
    mat3 rotz = mat3(
        cos(angle.z), -sin(angle.z), 0.0,
        sin(angle.z), cos(angle.z), 0.0,
        0.0, 0.0, 1.0
    );

    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_pos);
        _pos = rotx * roty * rotz * _pos * 2.0;
        a *= 0.8;
    }
    return v;
}

void main() {
    vec3 st = vLocalPosition;

    vec3 q = vec3(0.0);
    q.x = fBm(st, 5.0);
    q.y = fBm(st + vec3(1.2, 3.2, 1.52), 5.0);
    q.z = fBm(st + vec3(0.02, 0.12, 0.152), 5.0);

    float n = fBm(st + q + vec3(1.82, 1.32, 1.09), 5.0);

    vec3 color = mix(u_color, vec3(1.0, 1.0, 1.0), n * n);
    vec3 darkPlasma = mix(u_color * 0.3, u_color * u_color, 0.5);
    color = mix(color, darkPlasma, q * 0.7);

    // Fresnel rim & inner effect from Sangil Lee article
    float fresnelTerm_inner = 0.2 - 0.7 * min(dot(vPosition, vNormalView), 0.0);
    fresnelTerm_inner = pow(max(fresnelTerm_inner, 0.0), 5.0);

    float fresnelTerm_outer = 1.0 + dot(vPosition, vNormalView);
    fresnelTerm_outer = pow(max(fresnelTerm_outer, 0.0), 2.0);

    float fresnelTerm = fresnelTerm_inner + fresnelTerm_outer;

    vec3 finalColor = 1.3 * color + (u_color * fresnelTerm * 0.3);

    gl_FragColor = vec4(finalColor, 1.0);
}
`

const glowVertexShader = /* glsl */ `
varying vec3 vPosition;
varying vec3 vNormalView;
varying vec3 vLocalPosition;

void main() {
    vLocalPosition = position;
    vNormalView = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = normalize(mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
}
`

const glowFragmentShader = /* glsl */ `
uniform vec3 u_color;
uniform float u_time;

varying vec3 vPosition;
varying vec3 vNormalView;
varying vec3 vLocalPosition;

void main() {
    float rim = pow(clamp(1.0 + dot(vPosition, vNormalView), 0.0, 1.0), 3.0);
    float intensity = rim * 1.2;

    gl_FragColor = vec4(u_color * intensity, intensity);
}
`

const coronaFragmentShader = /* glsl */ `
uniform vec3 u_color;
uniform float u_time;

varying vec3 vPosition;
varying vec3 vNormalView;
varying vec3 vLocalPosition;

// 3D Random
float random(in vec3 st) {
    return fract(sin(dot(st, vec3(12.9898, 78.233, 23.112))) * 12943.145);
}

// 3D Noise for Solar Flares
float noise(in vec3 _pos) {
    vec3 i_pos = floor(_pos);
    vec3 f_pos = fract(_pos);

    float aa = random(i_pos);
    float ab = random(i_pos + vec3(1.0, 0.0, 0.0));
    float ac = random(i_pos + vec3(0.0, 1.0, 0.0));
    float ad = random(i_pos + vec3(1.0, 1.0, 0.0));
    float ae = random(i_pos + vec3(0.0, 0.0, 1.0));
    float af = random(i_pos + vec3(1.0, 0.0, 1.0));
    float ag = random(i_pos + vec3(0.0, 1.0, 1.0));
    float ah = random(i_pos + vec3(1.0, 1.0, 1.0));

    vec3 t = smoothstep(0.0, 1.0, f_pos);

    return mix(
        mix(mix(aa, ab, t.x), mix(ac, ad, t.x), t.y),
        mix(mix(ae, af, t.x), mix(ag, ah, t.x), t.y),
        t.z
    );
}

float coronaFbm(in vec3 pos) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; ++i) {
        v += a * noise(pos);
        pos = pos * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Outer Rim Fresnel (1.0 at edge limb, 0.0 at center)
    float dotProduct = dot(vPosition, vNormalView);
    float fresnelOuter = pow(clamp(1.0 + dotProduct, 0.0, 1.0), 2.0);

    // Streaming solar rays / flare noise
    vec3 rayDir = normalize(vLocalPosition);
    vec3 noisePos = rayDir * 4.0 + vec3(0.0, 0.0, u_time * 0.3);
    float flareNoise = coronaFbm(noisePos);

    // Combine rim glow and flare animation
    float intensity = fresnelOuter * (0.5 + 0.8 * flareNoise);
    intensity = pow(intensity, 1.3);

    vec3 color = mix(u_color, vec3(1.0, 0.85, 0.4), flareNoise * 0.6);

    gl_FragColor = vec4(color * intensity * 1.5, intensity);
}
`

const hexToRawColor = (hex: string) => {
    if (!hex) return new Color(1, 0.4, 0)
    const cleanHex = hex.replace("#", "")
    const num = parseInt(cleanHex, 16)
    return new Color(
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255
    )
}

export interface Props {
    id: string
    children?: React.ReactNode
    labelRef?: React.RefObject<HTMLButtonElement>
}

const Star = ({ id, children, labelRef }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const surfaceMatRef = useRef<ShaderMaterial>(null!)
    const glowMatRef = useRef<ShaderMaterial>(null!)
    const coronaMatRef = useRef<ShaderMaterial>(null!)

    const { distanceScale, sizeScale, setControl } = useContext(ControlContext)

    const data = getObjectById(id) as StarType
    const intensity = data.intensity / Math.pow(distanceScale, 2)
    const scale = data.radius / sizeScale
    const color = data.color
    const glowColor = data.color

    const handleClick = () => {
        setControl({ focus: id })
    }


    const surfaceMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: surfaceVertexShader,
            fragmentShader: surfaceFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: hexToRawColor(color) }
            }
        })
    }, [color])

    const glowMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: hexToRawColor(glowColor) }
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false
        })
    }, [glowColor])

    const coronaMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: coronaFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: hexToRawColor(glowColor) }
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false
        })
    }, [glowColor])

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime()
        if (surfaceMatRef.current) {
            surfaceMatRef.current.uniforms.u_time.value = elapsedTime
        }
        if (glowMatRef.current) {
            glowMatRef.current.uniforms.u_time.value = elapsedTime
        }
        if (coronaMatRef.current) {
            coronaMatRef.current.uniforms.u_time.value = elapsedTime
        }
    })

    if (!data) return null

    return (
        <Object data={data} onClick={handleClick} objectRef={objectRef} childrenComponent={children} labelRef={labelRef}>
            <pointLight intensity={intensity} color="white" />

            <mesh ref={objectRef} name={id} scale={scale} onClick={(e) => {
                e.stopPropagation()
                handleClick()
            }} castShadow receiveShadow>
                <sphereGeometry args={[1, 64, 64]} />
                <primitive object={surfaceMaterial} ref={surfaceMatRef} attach="material" />
            </mesh>

            {/* <mesh scale={[1.15, 1.15, 1.15]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive object={glowMaterial} ref={glowMatRef} attach="material" />
                </mesh> */}

            {/* <mesh scale={[1.4, 1.4, 1.4]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <primitive object={coronaMaterial} ref={coronaMatRef} attach="material" />
                </mesh> */}

        </Object>
    )
}

export default Star