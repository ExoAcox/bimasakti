// Black Hole GLSL Shaders inspired by Caian/blackholejs

/**
 * Post-processing fragment shader for Gravitational Lensing effect
 * Designed for postprocessing Effect / ShaderPass
 */
export const blackHoleLensingFragmentShader = /* glsl */ `
uniform vec2 uPosition;
uniform float uRatio;
uniform float uDistance;
uniform float uRadius;
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
    // Aspect-corrected radial distance from black hole center
    float rad = length(offset / ratio);
    
    // Dynamic event horizon radius:
    // Uses projected screen radius if available, otherwise falls back gracefully
    float rEH = uRadius > 0.0 ? uRadius : sqrt((uRad * uMul) / (max(uK, 0.001) * max(uDistance, 0.001)));
    rEH = max(rEH, 0.0001);

    // 1. Inside Event Horizon (if 2D cutout is enabled):
    if (uEH == 1 && rad <= rEH) {
        outputColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // 2. Gravitational Lensing (relativistically bounded deflection):
    // Deflection is scale-invariant with respect to the black hole size (rad / rEH)
    float normalizedDist = rad / rEH; // > 1.0 outside horizon
    float invDistSq = 1.0 / (normalizedDist * normalizedDist);

    // Smooth exponential decay so deformation attenuates cleanly at distance
    float falloff = exp(-max(normalizedDist - 1.0, 0.0) * 0.4);

    // Bounded deformation factor (capped strictly to [0.0, 0.85] to prevent extreme coordinate shifts)
    float deformation = clamp(invDistSq * 0.45 * falloff, 0.0, 0.85);

    // Deflect coordinates inward towards black hole center (authentic gravitational lensing pinch)
    vec2 distortedOffset = offset * (1.0 - deformation);
    vec2 distortedUv = uPosition + distortedOffset;

    // Strict clamping to inputBuffer viewport to eliminate edge streaking and out-of-bounds sampling
    distortedUv = clamp(distortedUv, vec2(0.0001), vec2(0.9999));
    vec4 color = texture2D(inputBuffer, distortedUv);

    outputColor = color;
}
`

export const blackholePointVertexShader = /* glsl */ `
uniform float u_time;
uniform float u_size;
attribute vec3 color;
attribute float a_size;

varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Scale point size for distance with safe clamping
    float pSize = (a_size * u_size) * (2000.0 / max(-mvPosition.z, 0.1));
    gl_PointSize = clamp(pSize, 2.0, 160.0);
    gl_Position = projectionMatrix * mvPosition;
}
`

export const blackholePointFragmentShader = /* glsl */ `
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_intensity;

varying vec3 vColor;

void main() {
    vec2 centerCoord = gl_PointCoord - vec2(0.5);
    float dist = length(centerCoord);
    if (dist > 0.5) discard;

    // Smooth exponential Gaussian falloff
    float mist = exp(-dist * 6.0);
    float pulse = 0.95 + 0.05 * sin(u_time * 2.0);
    float intensity = mist * u_intensity * pulse;

    vec4 texColor = texture2D(u_texture, gl_PointCoord);
    float alpha = mist * max(texColor.a, 0.6);

    gl_FragColor = vec4(vColor * intensity, alpha);
}
`