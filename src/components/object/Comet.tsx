import { useLoader } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PLYLoader } from "three-stdlib"
import type { Comet as CometType } from "@types"
import { CelestialBody } from "@components/object"
import { type Mesh } from "three"
import { useControlStore } from "@state"

interface Props {
    data: CometType
}

const Comet = ({ data }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const { sizeScale, setControl } = useControlStore()

    const geometry = useLoader(PLYLoader, `/models/${data.model}`)
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    useMemo(() => {
        if (geometry) {
            geometry.center()
            geometry.computeVertexNormals()

            // Putar geometry di sini untuk menyesuaikan arah awal (base orientation) model
            // Silakan ubah nilai Math.PI / 2 sesuai kebutuhan (misal: Math.PI untuk 180 derajat)
            // geometry.rotateX(Math.PI / 2) // Ubah orientasi pada sumbu X
            // geometry.rotateY(MathUtils.degToRad(90)) // Ubah orientasi pada sumbu Y
            // geometry.rotateZ(Math.PI / 2) // Ubah orientasi pada sumbu Z
        }
    }, [geometry])

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick}>
        <mesh ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }} castShadow receiveShadow>
            <primitive object={geometry} attach="geometry" />
            <meshStandardMaterial
                color={data.color}
                roughness={0.5}
                onBeforeCompile={(shader) => {
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <common>',
                        `#include <common>
                    varying vec3 vLocalPosition;`
                    );
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <begin_vertex>',
                        `#include <begin_vertex>
                    vLocalPosition = position;`
                    );
                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <common>',
                        `#include <common>
                    varying vec3 vLocalPosition;

                    // 3D Noise for rock texture
                    float hash(vec3 p) {
                        p = fract(p * 0.3183099 + 0.1);
                        p *= 17.0;
                        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                    }

                    float noise(in vec3 x) {
                        vec3 i = floor(x);
                        vec3 f = fract(x);
                        f = f * f * (3.0 - 2.0 * f);
                        return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                                       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                                       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
                    }

                    float fbm(vec3 x) {
                        float v = 0.0;
                        float a = 0.5;
                        vec3 shift = vec3(100.0);
                        for (int i = 0; i < 5; ++i) {
                            v += a * noise(x);
                            x = x * 2.0 + shift;
                            a *= 0.5;
                        }
                        return v;
                    }
                    `
                    );
                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <color_fragment>',
                        `#include <color_fragment>

                    float n = fbm(vLocalPosition * 2.0);
                    diffuseColor.rgb = mix(diffuseColor.rgb * 0.3, diffuseColor.rgb * 1.5, n);
                    `
                    );
                }}
            />
        </mesh>
    </CelestialBody>
}

export default Comet