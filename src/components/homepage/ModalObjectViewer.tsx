/* eslint-disable react-hooks/immutability */
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useKTX2, useTexture } from "@react-three/drei";
import {
    AdditiveBlending,
    BackSide,
    Color,
    Group,
    MathUtils,
    Mesh,
    NoColorSpace,
    ShaderMaterial,
} from "three";
import type { CelestialObject, Planet, Star } from "@types";
import {
    GltfLoader,
    PlanetRing,
    PlyLoader,
    TextureLoader,
} from "@components/object";
import { getStarClassColors } from "@components/object/Star";
import {
    coronaFragmentShader,
    glowFragmentShader,
    glowVertexShader,
    surfaceFragmentShader,
    surfaceVertexShader,
} from "@shaders/star";
import { MdOutlinePause, MdOutlinePlayArrow } from "react-icons/md";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

interface Props {
    data: CelestialObject;
}

// Separate components for Cloud textures to respect React hook rules
const KTX2CloudMaterial = ({ path, opacity }: { path: string; opacity: number }) => {
    const texture = useKTX2(`/textures/${path}`);
    texture.colorSpace = NoColorSpace;

    return (
        <meshStandardMaterial
            color="#ffffff"
            opacity={opacity}
            map={texture}
            transparent={true}
            depthWrite={false}
            roughness={1.0}
            metalness={0.0}
        />
    );
};

const ImageCloudMaterial = ({ path, opacity }: { path: string; opacity: number }) => {
    const texture = useTexture(`/textures/${path}`);
    texture.colorSpace = NoColorSpace;

    return (
        <meshStandardMaterial
            color="#ffffff"
            opacity={opacity}
            map={texture}
            transparent={true}
            depthWrite={false}
            roughness={1.0}
            metalness={0.0}
        />
    );
};

const CloudLayer = ({ path, opacity = 1 }: { path: string; opacity?: number }) => {
    const cloudRef = useRef<Mesh>(null);
    const format = path.split(".")[1];

    useFrame((_, delta) => {
        if (cloudRef.current) {
            cloudRef.current.rotation.y += delta * 0.02
        }
    });

    return (
        <mesh ref={cloudRef} scale={1.015}>
            <sphereGeometry args={[1, 64, 32]} />
            {format === "ktx2" ? (
                <KTX2CloudMaterial path={path} opacity={opacity} />
            ) : (
                <ImageCloudMaterial path={path} opacity={opacity} />
            )}
        </mesh>
    );
};

// Star shader preview mesh
const StarPreviewMesh = ({ data }: { data: Star }) => {
    const surfaceMatRef = useRef<ShaderMaterial>(null);
    const glowMatRef = useRef<ShaderMaterial>(null);
    const coronaMatRef = useRef<ShaderMaterial>(null);

    const { flareColor, hotspotColor, innerHeatScale } = useMemo(() => {
        return getStarClassColors(data.class);
    }, [data.class]);

    const color = data.color || "#ffaa33";
    const glowColor = data.color || "#ffaa33";

    const surfaceMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: surfaceVertexShader,
            fragmentShader: surfaceFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(color) },
                u_hotspotColor: { value: hotspotColor },
                u_innerHeatScale: { value: innerHeatScale },
            },
        });
    }, [color, hotspotColor, innerHeatScale]);

    const glowMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(glowColor) },
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false,
        });
    }, [glowColor]);

    const coronaMaterial = useMemo(() => {
        return new ShaderMaterial({
            vertexShader: glowVertexShader,
            fragmentShader: coronaFragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_color: { value: new Color(glowColor) },
                u_flareColor: { value: flareColor },
            },
            blending: AdditiveBlending,
            side: BackSide,
            transparent: true,
            depthWrite: false,
        });
    }, [glowColor, flareColor]);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        if (surfaceMatRef.current) surfaceMatRef.current.uniforms.u_time.value = elapsedTime;
        if (glowMatRef.current) glowMatRef.current.uniforms.u_time.value = elapsedTime;
        if (coronaMatRef.current) coronaMatRef.current.uniforms.u_time.value = elapsedTime;
    });

    return (
        <group>
            <mesh>
                <sphereGeometry args={[1, 64, 32]} />
                <primitive object={surfaceMaterial} ref={surfaceMatRef} attach="material" />
            </mesh>
            <mesh scale={1.015}>
                <sphereGeometry args={[1, 64, 32]} />
                <primitive object={glowMaterial} ref={glowMatRef} attach="material" />
            </mesh>
            <mesh scale={1.03}>
                <sphereGeometry args={[1, 64, 32]} />
                <primitive object={coronaMaterial} ref={coronaMatRef} attach="material" />
            </mesh>
            <pointLight intensity={2} color={color} />
        </group>
    );
};


const CelestialObject = ({ data }: { data: CelestialObject }) => {
    if (data.type === "star") {
        return <StarPreviewMesh data={data as Star} />
    }

    if (data.type === "blackhole") {
        return (<mesh>
            <sphereGeometry args={[1, 64, 32]} />
            <meshBasicMaterial color="#000000" />
        </mesh>
        );
    }

    if (data.model) {
        const format = data.model.split(".")[1]?.toLowerCase();
        if (format === "ply") {
            return (
                <mesh>
                    <PlyLoader path={data.model} rotation={data.rotation} />
                    {data.texture ? (
                        <TextureLoader path={data.texture} />
                    ) : (
                        <meshStandardMaterial
                            color={data.color || "#94a3b8"}
                            roughness={0.8}
                            metalness={0.1}
                        />
                    )}
                </mesh>
            );
        } else {
            return (<GltfLoader path={data.model} rotation={data.rotation} center={true} />);
        }
    }

    // Standard spherical body (planet, satellite, comet, etc.)
    const hasRing = Boolean("ring" in data && data.ring && data.ring.texture);
    const hasCloud = Boolean(data.cloud_texture);

    return (
        <group>
            <mesh>
                <sphereGeometry args={[1, 64, 32]} />
                {data.texture ? (
                    <TextureLoader path={data.texture} />
                ) : (
                    <meshStandardMaterial
                        color={data.color || "#64748b"}
                        roughness={0.7}
                        metalness={0.1}
                    />
                )}
            </mesh>

            {hasCloud && (
                <CloudLayer
                    path={data.cloud_texture!}
                    opacity={data.cloud_opacity}
                />
            )}

            {hasRing && <PlanetRing data={data as Planet} />}
        </group>
    );
};

const Scene = ({ data, isRotate }: { data: CelestialObject, isRotate: boolean }) => {
    const objectRef = useRef<Group>(null!)

    const tilt = useMemo(() => {
        return [MathUtils.degToRad(data.axis || 0), 0, 0] as [number, number, number];
    }, [data.axis]);

    useFrame((_, delta) => {
        if (objectRef.current && isRotate) {
            objectRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group rotation={tilt} ref={objectRef}>
            <CelestialObject data={data} />
        </group>
    )
}

const FallbackMesh = ({ color }: { color: string }) => {
    return (
        <mesh>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color={color} wireframe opacity={0.3} transparent />
        </mesh>
    );
};

const ModalObjectViewer = ({ data }: Props) => {
    const [isRotate, setIsRotate] = useState(true);

    return (
        <div className="relative aspect-square w-full min-h-72 md:w-100 md:h-full rounded-2xl overflow-hidden bg-radial from-slate-900/80 via-slate-950/90 to-slate-950 border border-panel-border group">
            <div
                className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
                style={{
                    backgroundColor: data.color,
                }}
            />

            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                <button
                    onClick={() => setIsRotate(!isRotate)}
                    className="p-1.5 rounded-lg bg-card-bg hover:bg-card-hover backdrop-blur-md border border-panel-border text-secondary hover:text-primary transition-all text-xs flex items-center justify-center cursor-pointer"
                    title={isRotate ? "Pause Auto-Rotate" : "Start Auto-Rotate"}
                    aria-label="Toggle auto rotate"
                >
                    {isRotate ? (
                        <MdOutlinePause className="size-4" />
                    ) : (
                        <MdOutlinePlayArrow className="size-4" />
                    )}
                </button>
            </div>

            {/* Interactive hint */}
            <div className="absolute whitespace-nowrap bottom-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[11px] font-space-grotesk text-tertiary/70">
                Drag to rotate • Scroll to zoom
            </div>

            {/* Three.js Canvas */}
            <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                gl={{ antialias: true, alpha: true }}
            >
                <Environment preset="sunset" />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={6}
                />

                <Suspense fallback={<FallbackMesh color={data.color} />}>
                    <Scene data={data} isRotate={isRotate} />
                </Suspense>

                <EffectComposer>
                    <Bloom
                        intensity={2}
                        luminanceThreshold={1.0}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default ModalObjectViewer;
