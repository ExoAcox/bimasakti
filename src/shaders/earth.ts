export const earthVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;

uniform vec3 u_sunPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec3 earthWorldPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 sunDirWorld = normalize(u_sunPosition - earthWorldPos);
    vSunDir = mat3(viewMatrix) * sunDirWorld;
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const earthFragmentShader = /* glsl */ `
uniform sampler2D u_dayTexture;
uniform sampler2D u_nightTexture;
uniform float u_nightIntensity;
uniform float u_mode;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;

void main() {
    vec4 dayColor = texture2D(u_dayTexture, vUv);
    vec4 nightColor = texture2D(u_nightTexture, vUv);

    vec3 surfaceColor;

    if (u_mode < 0.5) {
        // Mode 0: Day Mode (use u_dayTexture only)
        surfaceColor = dayColor.rgb;
    } else {
        // Mode 1: Auto Mode (dynamic blend based on sun position)
        vec3 N = normalize(vNormal);
        vec3 sunDir = normalize(vSunDir);
        vec3 viewDir = normalize(vViewPosition);
        
        float dotNL = dot(N, sunDir);
        
        // Smooth daylight transition factor
        float dayFactor = smoothstep(-0.2, 0.25, dotNL);
        
        // Night lights activation: city lights smoothly fade in as night sets in
        float nightLightFactor = smoothstep(0.1, -0.15, dotNL);

        // Night city lights emission
        vec3 nightLights = nightColor.rgb * nightLightFactor * u_nightIntensity * 2.0;

        // Day surface lighting gradient
        float sunIntensity = max(0.02, dayFactor);
        vec3 daySurface = dayColor.rgb * sunIntensity;

        // Smooth twilight gradient (warm sunset tint blended into terrain along terminator)
        float twilight = smoothstep(-0.2, 0.02, dotNL) * (1.0 - smoothstep(0.02, 0.22, dotNL));
        vec3 twilightGlow = vec3(0.95, 0.45, 0.18) * twilight * 0.35 * dayColor.rgb;

        // Base surface color with smooth day-to-night blend
        surfaceColor = daySurface + twilightGlow + nightLights;

        // Surface Fresnel atmospheric scattering (blue edge glow on day side)
        float fresnel = pow(1.0 - clamp(dot(N, viewDir), 0.0, 1.0), 3.5);
        vec3 atmosphereGlow = vec3(0.18, 0.55, 1.0) * fresnel * dayFactor * 0.6;
        surfaceColor += atmosphereGlow;
    }

    gl_FragColor = vec4(surfaceColor, 1.0);
}
`;

export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;

uniform vec3 uSunPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec3 earthWorldPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 sunDirWorld = normalize(uSunPosition - earthWorldPos);
    vSunDir = mat3(viewMatrix) * sunDirWorld;
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const atmosphereFragmentShader = /* glsl */ `
uniform vec3 uAtmosphereColor;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSunDir;

void main() {
    vec3 N = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(vSunDir);

    // Fresnel rim intensity falloff
    float dotNV = abs(dot(N, viewDir));
    float fresnel = pow(1.0 - clamp(dotNV, 0.0, 1.0), 3.0);
    
    // Sun light factor for day/night atmosphere illumination
    float dotNSun = dot(N, sunDir);
    float dayFactor = smoothstep(-0.25, 0.45, dotNSun);
    
    // Sunset transition glow near the terminator line
    float sunsetFactor = smoothstep(-0.35, 0.05, dotNSun) * (1.0 - smoothstep(0.05, 0.45, dotNSun));
    vec3 sunsetColor = vec3(1.0, 0.4, 0.15);
    
    // Mix cyan/blue atmosphere with sunset color near terminator
    vec3 finalColor = mix(uAtmosphereColor, sunsetColor, sunsetFactor * 0.45);
    
    // Combine Fresnel rim with day light intensity
    float alpha = fresnel * (0.1 + 0.9 * dayFactor);

    gl_FragColor = vec4(finalColor, alpha);
}
`;
