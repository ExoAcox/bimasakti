export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const atmosphereFragmentShader = /* glsl */ `
uniform vec3 color;
varying vec3 vNormal;

void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(color, 1.0) * intensity;
}
}
`
