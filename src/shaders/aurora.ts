export const auroraVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;
varying vec3 vLocalPosition;

uniform vec3 uSunPosition;
uniform float uTime;

void main() {
    vUv = uv;
    vLocalPosition = position;
    
    // Smooth wave distortion near polar caps using 3D position (seamless around sphere)
    vec3 pos = position;
    float polarFactor = smoothstep(0.3, 0.9, abs(pos.y));
    float angle = atan(pos.z, pos.x);
    float wave = sin(angle * 4.0 + uTime * 1.8) * cos(pos.y * 10.0 + uTime * 1.4) * 0.005 * polarFactor;
    pos += normal * wave;

    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec3 earthWorldPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 vecToSun = uSunPosition - earthWorldPos;
    float sunDist = length(vecToSun);
    vec3 sunDirWorld = sunDist > 0.001 ? vecToSun / sunDist : vec3(1.0, 0.2, 0.0);
    vSunDir = mat3(viewMatrix) * sunDirWorld;
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const auroraFragmentShader = /* glsl */ `
uniform sampler2D uAuroraTexture;
uniform float uTime;
uniform float uIntensity;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;
varying vec3 vLocalPosition;

void main() {
    // 3D Cartesian angle around polar axis (-PI to +PI) for 100% seamless wrap
    float longitudeAngle = atan(vLocalPosition.z, vLocalPosition.x);
    
    // Animate UV scrolling horizontally to simulate aurora curtain rotation
    vec2 animatedUv = vUv;
    animatedUv.x = fract(vUv.x + uTime * 0.015);
    
    // Seamless wave perturbation using 3D longitude angle (4 full periods around 360 deg)
    animatedUv.y += sin(longitudeAngle * 4.0 + uTime * 1.2) * 0.008;
    
    vec4 texColor = texture2D(uAuroraTexture, animatedUv);
    float auroraAlpha = texColor.a;
    
    // Strictly isolate aurora to regions where texture alpha exists
    if (auroraAlpha < 0.01) {
        gl_FragColor = vec4(0.0);
        return;
    }
    
    // Seamless dancing curtain wave pattern (6 full periods around 360 deg)
    float wavePattern = sin(longitudeAngle * 6.0 + uTime * 2.2) * cos(vLocalPosition.y * 20.0 - uTime * 1.6) * 0.12;
    float curtainAlpha = clamp(auroraAlpha + wavePattern * auroraAlpha, 0.0, 1.0);
    
    // Vibrant colors: Emerald green, Cyan glow, & Violet upper fringe
    vec3 emeraldGreen = vec3(0.08, 1.0, 0.45);
    vec3 cyanGlow = vec3(0.0, 0.88, 1.0);
    vec3 violetFringe = vec3(0.65, 0.25, 1.0);
    
    float poleHeight = abs(vLocalPosition.y);
    vec3 auroraColor = mix(emeraldGreen, cyanGlow, smoothstep(0.4, 0.8, poleHeight));
    auroraColor = mix(auroraColor, violetFringe, smoothstep(0.8, 0.95, poleHeight));
    
    // Fresnel rim boost for realistic limb view from space
    vec3 N = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float dotNV = clamp(abs(dot(N, viewDir)), 0.0, 1.0);
    float fresnel = pow(1.0 - dotNV, 2.0);
    float rimBoost = mix(0.85, 1.8, fresnel);
    
    // Pulsing intensity
    float pulse = 0.9 + 0.1 * sin(uTime * 2.5 + longitudeAngle * 3.0);
    
    // Full 360-degree seamless aurora visibility around polar ring
    vec3 finalRGB = auroraColor * curtainAlpha * uIntensity * 1.3 * rimBoost * pulse;
    float finalAlpha = curtainAlpha * uIntensity * 1.2 * (0.6 + 0.4 * fresnel);

    gl_FragColor = vec4(finalRGB, finalAlpha);
}
`;
