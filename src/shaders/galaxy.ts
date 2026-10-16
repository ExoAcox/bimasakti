export const pointGlowVertexShader = /* glsl */ `
uniform float u_time;
attribute vec3 color;
attribute float a_size;

varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Larger size for smooth, seamless mist overlap
    gl_PointSize = a_size * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`

export const pointGlowFragmentShader = /* glsl */ `
uniform sampler2D u_texture;
uniform float u_time;

varying vec3 vColor;

void main() {
    vec2 centerCoord = gl_PointCoord - vec2(0.5);
    float dist = length(centerCoord);
    if (dist > 0.5) discard;

    // Exponential Gaussian-like soft falloff for a diffuse mist / fog spread
    float mist = exp(-dist * 10.0);
    
    // Very gentle subtle pulse
    float pulse = 0.95 + 0.05 * sin(u_time * 1.5);
    
    // Intensity multiplier allowing overlapping mist to bloom softly
    float intensity = mist * 1.25 * pulse;

    vec4 texColor = texture2D(u_texture, gl_PointCoord);

    // Soft opacity with solid center fading out smoothly
    float alpha = mist * texColor.a;

    gl_FragColor = vec4(vColor * intensity, alpha);
}
`
