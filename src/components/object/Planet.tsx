import { Else, If, Then, When } from "react-if"

import type { Planet as PlanetType } from "@types"
import { useMemo, useRef } from "react"
import { AdditiveBlending, BackSide, Color, ShaderMaterial, type Mesh } from "three"
import { useControlStore } from "@state"
import { CelestialBody, PlyLoader, PlanetRing, TextureLoader, PlanetCloud } from "@components/object"
import { Detailed } from "@react-three/drei"
import { LOWREST_SCALE } from "@constants"
import { atmosphereFragmentShader, atmosphereVertexShader } from "@shaders/planet"



interface Props {
    data: PlanetType
    children?: React.ReactNode
}

const Planet = ({ data, children }: Props) => {
    const objectRef = useRef<Mesh>(null!)
    const cloudRef = useRef<Mesh>(null!)

    const { sizeScale, distanceScale, setControl } = useControlStore()
    const distance = LOWREST_SCALE / distanceScale
    const scale = data.radius / sizeScale

    const handleClick = () => {
        setControl({ focus: data.id })
    }

    const atmosphereMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            side: BackSide,
            uniforms: {
                atmosphereColor: { value: new Color(data.color) }
            },
        })
    }, [data.color])

    if (!data) return null

    return <CelestialBody data={data} objectRef={objectRef} onClick={handleClick} cloudRef={cloudRef} childrenComponent={children}>
        <group ref={objectRef} name={data.id} scale={scale} onClick={(e) => {
            e.stopPropagation()
            handleClick()
        }}>
            <Detailed distances={[0, distance]}>
                <mesh castShadow receiveShadow>
                    <If condition={data.model}>
                        <Then>
                            <PlyLoader path={data.model!} />
                        </Then>
                        <Else>
                            <sphereGeometry args={[1, 64, 64]} />
                        </Else>
                    </If>
                    <If condition={data.texture}>
                        <Then>
                            <TextureLoader path={data.texture!} />
                        </Then>
                        <Else>
                            <meshStandardMaterial color={data.color} wireframe />
                        </Else>
                    </If>
                </mesh>
                <mesh>
                    <sphereGeometry />
                    <meshStandardMaterial color={data.color} />
                </mesh>
            </Detailed>
        </group>

        <mesh scale={scale * 1.05}>
            <sphereGeometry args={[1, 64, 64]} />
            <primitive object={atmosphereMaterial} attach="material" />
        </mesh>

        <When condition={data.cloud_texture}>
            <PlanetCloud
                path={data.cloud_texture!}
                scale={scale}
                cloudRef={cloudRef} />
        </When>

        <When condition={!!data.ring}>
            <PlanetRing data={data} />
        </When>
    </CelestialBody>
}

export default Planet