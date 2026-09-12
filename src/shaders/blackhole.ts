// Black Hole GLSL Shaders inspired by Caian/blackholejs

/**
 * Post-processing fragment shader for Gravitational Lensing effect
 * Designed for postprocessing Effect / ShaderPass
 */
export const blackHoleLensingFragmentShader = /* glsl */ `
uniform vec2 uPosition;
uniform float uRatio;
uniform float uDistance;
uniform float uRad;
uniform float uMul;
uniform float uK;
uniform int uEH;
uniform float uActive;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    if (uActive < 0.5) {
        outputColor = inputColor;
        return;
    }

    vec2 offset = uv - uPosition;
    vec2 ratio = vec2(uRatio, 1.0);
    float rad = length(offset / ratio);
    
    // Gravitational lensing deformation equation (inverse square distance calculation from blackholejs)
    float distSq = pow(rad * pow(max(uDistance, 0.001), 0.5), 2.0);
    float deformation = 0.0;
    if (distSq > 0.000001) {
        deformation = (1.0 / distSq) * uRad * uMul;
    }

    vec2 distortedUv = uv - offset * deformation;
    vec4 color = texture2D(inputBuffer, distortedUv);

    // Event horizon dark cutout
    if (uEH == 1) {
        if (deformation >= uK) {
            color = vec4(0.0, 0.0, 0.0, 1.0);
        } else if (deformation > uK * 0.6) {
            float f = smoothstep(uK * 1.6, uK, deformation);
            color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), f);
        }
    }

    outputColor = color;
}
`

/**
 * Accretion Disk Shaders
 */
export const accretionDiskVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const accretionDiskFragmentShader = /* glsl */ `
uniform float u_time;
uniform vec3 u_color;
varying vec2 vUv;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    // vUv.x is angle fraction (0..1), vUv.y is radial distance (0..1 from inner to outer ring)
    float r = vUv.y;
    float angle = vUv.x * 6.28318530718;

    float speed = 1.2;
    float spiral = angle * 4.0 + (1.0 / (r + 0.08)) * 2.5 - u_time * speed;
    float n = fbm(vec2(spiral, r * 10.0 - u_time * 0.4));

    float radialIntensity = sin(r * 3.14159);
    radialIntensity = pow(radialIntensity, 0.7);

    // Relativistic Doppler beaming asymmetry
    float doppler = 0.65 + 0.35 * cos(angle + 0.4);

    vec3 hotColor = vec3(1.0, 0.96, 0.85);
    vec3 midColor = u_color;
    vec3 coolColor = vec3(0.85, 0.15, 0.02);

    vec3 color = mix(hotColor, midColor, smoothstep(0.0, 0.35, r));
    color = mix(color, coolColor, smoothstep(0.35, 1.0, r));

    float finalAlpha = radialIntensity * (0.35 + 0.65 * n) * doppler;
    vec3 finalColor = color * (1.6 + n * 1.4) * doppler;

    gl_FragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 1.0));
}
`

/**
 * Photon Ring Shaders
 */
export const photonRingVertexShader = /* glsl */ `
varying vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const photonRingFragmentShader = /* glsl */ `
uniform float u_time;
uniform vec3 u_color;
varying vec3 vNormal;

void main() {
    // Fresnel rim effect: 0.0 at center, 1.0 at outer edge
    float viewDotNormal = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float rim = smoothstep(0.15, 0.95, 1.0 - viewDotNormal);
    float intensity = pow(rim, 3.5);

    vec3 glow = mix(vec3(1.0, 1.0, 0.95), u_color, 0.3) * intensity * 3.5;
    gl_FragColor = vec4(glow, clamp(intensity, 0.0, 1.0));
}
`
