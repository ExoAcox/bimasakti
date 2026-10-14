/* eslint-disable react-hooks/immutability */
import { seo } from "@function"
import { useGLTF, useTexture } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

export const meta = () =>
    seo({
        title: "Mars Terrain Simulation",
        description: "Simulasi 3D berada di terrain permukaan Mars",
    })

useGLTF.setDecoderPath("/draco/")

// Ground elevation at center (0, 0) with scale 100 is ~33.08
const TERRAIN_SCALE = 100
const EYE_HEIGHT = 1.8
const CAMERA_ORIGIN = new THREE.Vector3(0, 33.08 + EYE_HEIGHT, 0)

const MarsModel = () => {
    const { scene } = useGLTF("/models/mars_terrain.glb")

    const textures = useTexture({
        map: "/textures/rocky_terrain_03/diff_2k.jpg",
        normalMap: "/textures/rocky_terrain_03/nor_gl_2k.jpg",
        roughnessMap: "/textures/rocky_terrain_03/rough_2k.jpg",
        aoMap: "/textures/rocky_terrain_03/ao_2k.jpg",
    })

    const customMaterial = useMemo(() => {
        const { map, normalMap, roughnessMap, aoMap } = textures

        const repeatCount = 18
            ;[map, normalMap, roughnessMap, aoMap].forEach((tex) => {
                tex.wrapS = THREE.RepeatWrapping
                tex.wrapT = THREE.RepeatWrapping
                tex.repeat.set(repeatCount, repeatCount)
                tex.needsUpdate = true
            })

        map.colorSpace = THREE.SRGBColorSpace

        return new THREE.MeshStandardMaterial({
            map,
            normalMap,
            normalScale: new THREE.Vector2(1.8, 1.8),
            roughnessMap,
            roughness: 0.92,
            metalness: 0.05,
            aoMap,
            aoMapIntensity: 1.0,
            color: new THREE.Color("#d98358"), // Mars reddish-ochre regolith tint
        })
    }, [textures])

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.material = customMaterial

                if (mesh.geometry && !mesh.geometry.attributes.uv2 && mesh.geometry.attributes.uv) {
                    mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv
                }
            }
        })
        return clone
    }, [scene, customMaterial])

    return (
        <primitive
            object={clonedScene}
            scale={[TERRAIN_SCALE, TERRAIN_SCALE, TERRAIN_SCALE]}
            position={[0, 0, 0]}
        />
    )
}

/**
 * Stationary 360 Panoramic Look Controller
 * Camera position stays locked at CAMERA_ORIGIN.
 * Dragging rotates yaw (left/right) and pitch (up/down).
 */
const PanoramaLookControls = () => {
    const { camera, gl } = useThree()

    // Spherical angles for rotation (yaw: horizontal, pitch: vertical)
    const targetYaw = useRef<number>(Math.PI * 0.25)
    const currentYaw = useRef<number>(Math.PI * 0.25)

    const targetPitch = useRef<number>(0.05)
    const currentPitch = useRef<number>(0.05)

    const targetFov = useRef<number>(65)
    const currentFov = useRef<number>(65)

    const isDragging = useRef<boolean>(false)
    const previousPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const touchDistance = useRef<number | null>(null)

    useEffect(() => {
        const domElement = gl.domElement

        const onPointerDown = (e: PointerEvent) => {
            isDragging.current = true
            previousPointer.current = { x: e.clientX, y: e.clientY }
            domElement.setPointerCapture?.(e.pointerId)
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return
            const deltaX = e.clientX - previousPointer.current.x
            const deltaY = e.clientY - previousPointer.current.y
            previousPointer.current = { x: e.clientX, y: e.clientY }

            // Sensitivity factor scaled by current FOV
            const fovFactor = (currentFov.current / 65) * 0.003

            // Dragging left turns camera left, dragging right turns camera right
            targetYaw.current -= deltaX * fovFactor

            // Dragging up tilts up (targetPitch increases), dragging down tilts down
            targetPitch.current -= deltaY * fovFactor

            // Clamp pitch to prevent flipping upside down (-75 deg to +75 deg)
            const maxPitch = (75 * Math.PI) / 180
            targetPitch.current = Math.max(-maxPitch, Math.min(maxPitch, targetPitch.current))
        }

        const onPointerUp = (e: PointerEvent) => {
            isDragging.current = false
            try {
                domElement.releasePointerCapture?.(e.pointerId)
            } catch {
                // Ignore if pointer capture release fails
            }
        }

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const zoomSensitivity = 0.04
            targetFov.current = Math.max(35, Math.min(85, targetFov.current + e.deltaY * zoomSensitivity))
        }

        // Mobile touch pinch-to-zoom
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                )
                if (touchDistance.current !== null) {
                    const diff = touchDistance.current - dist
                    targetFov.current = Math.max(35, Math.min(85, targetFov.current + diff * 0.1))
                }
                touchDistance.current = dist
            }
        }

        const onTouchEnd = () => {
            touchDistance.current = null
        }

        domElement.addEventListener("pointerdown", onPointerDown)
        window.addEventListener("pointermove", onPointerMove)
        window.addEventListener("pointerup", onPointerUp)
        window.addEventListener("pointercancel", onPointerUp)
        domElement.addEventListener("wheel", onWheel, { passive: false })
        domElement.addEventListener("touchmove", onTouchMove, { passive: true })
        domElement.addEventListener("touchend", onTouchEnd)

        return () => {
            domElement.removeEventListener("pointerdown", onPointerDown)
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("pointerup", onPointerUp)
            window.removeEventListener("pointercancel", onPointerUp)
            domElement.removeEventListener("wheel", onWheel)
            domElement.removeEventListener("touchmove", onTouchMove)
            domElement.removeEventListener("touchend", onTouchEnd)
        }
    }, [gl, camera])

    useFrame((_, delta) => {
        // Smoothly damp towards target angles
        const lerpFactor = 1 - Math.exp(-14 * delta)
        currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, targetYaw.current, lerpFactor)
        currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch.current, lerpFactor)
        currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov.current, lerpFactor)

        const perspectiveCam = camera as THREE.PerspectiveCamera
        if (Math.abs(perspectiveCam.fov - currentFov.current) > 0.01) {
            perspectiveCam.fov = currentFov.current
            perspectiveCam.updateProjectionMatrix()
        }

        // Lock camera position strictly at center origin
        camera.position.copy(CAMERA_ORIGIN)

        // Calculate look direction from yaw and pitch
        const cosPitch = Math.cos(currentPitch.current)
        const sinPitch = Math.sin(currentPitch.current)
        const cosYaw = Math.cos(currentYaw.current)
        const sinYaw = Math.sin(currentYaw.current)

        const targetLook = new THREE.Vector3(
            CAMERA_ORIGIN.x + cosPitch * sinYaw,
            CAMERA_ORIGIN.y + sinPitch,
            CAMERA_ORIGIN.z + cosPitch * cosYaw
        )

        camera.lookAt(targetLook)
    })

    return null
}

const SUN_POSITION: [number, number, number] = [-100, 120, 0]

const atmosphereVertexShader = `
varying vec3 vWorldPosition;
void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const atmosphereFragmentShader = `
uniform vec3 uSunPosition;
uniform vec3 uCameraPosition;
varying vec3 vWorldPosition;

void main() {
    vec3 rayDir = normalize(vWorldPosition - uCameraPosition);
    vec3 sunDir = normalize(uSunPosition - uCameraPosition);

    float height = rayDir.y;

    // Physically-based Mars atmospheric gradient:
    // 1. Zenith: Mars atmosphere is very thin (~0.6% Earth pressure), so zenith sky is deep dark tawny/sepia
    vec3 zenithColor = vec3(0.09, 0.035, 0.02);
    // 2. High sky: Soft dusky copper
    vec3 upperSkyColor = vec3(0.38, 0.17, 0.09);
    // 3. Mid sky: Classic Mars butterscotch ochre
    vec3 midSkyColor = vec3(0.66, 0.33, 0.17);
    // 4. Horizon: Dense suspended iron-oxide dust haze
    vec3 horizonColor = vec3(0.78, 0.43, 0.23);
    // 5. Ground direction below horizon: Dark Martian soil tone
    vec3 groundColor = vec3(0.14, 0.06, 0.03);

    vec3 skyColor;
    if (height > 0.0) {
        float h = pow(height, 0.62);
        if (h < 0.32) {
            skyColor = mix(horizonColor, midSkyColor, h / 0.32);
        } else if (h < 0.72) {
            skyColor = mix(midSkyColor, upperSkyColor, (h - 0.32) / 0.40);
        } else {
            skyColor = mix(upperSkyColor, zenithColor, (h - 0.72) / 0.28);
        }
    } else {
        skyColor = mix(horizonColor, groundColor, clamp(-height * 4.0, 0.0, 1.0));
    }

    // Mars Mie Forward-Scattering: gentle atmospheric wash towards the sun
    float cosTheta = max(dot(rayDir, sunDir), 0.0);
    float skySunWash = pow(cosTheta, 8.0) * 0.10;
    vec3 sunWashColor = vec3(0.70, 0.58, 0.50);

    vec3 finalColor = skyColor + skySunWash * sunWashColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
`

const MarsAtmosphereSky = ({ sunPosition }: { sunPosition: [number, number, number] }) => {
    const { camera } = useThree()
    const meshRef = useRef<THREE.Mesh>(null)

    const uniforms = useMemo(
        () => ({
            uSunPosition: { value: new THREE.Vector3(...sunPosition) },
            uCameraPosition: { value: new THREE.Vector3() },
        }),
        [sunPosition]
    )

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(camera.position)
            uniforms.uCameraPosition.value.copy(camera.position)
            uniforms.uSunPosition.value.set(...sunPosition)
        }
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1200, 32, 32]} />
            <shaderMaterial
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide}
                depthWrite={false}
                fog={false}
            />
        </mesh>
    )
}

const MarsSun = () => {
    const sunRef = useRef<THREE.Group>(null)

    // Generate soft glowing halo texture mimicking Martian forward scattering
    const glowTexture = useMemo(() => {
        if (typeof document === "undefined") return null
        const canvas = document.createElement("canvas")
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext("2d")
        if (!ctx) return null

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
        gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)")
        gradient.addColorStop(0.15, "rgba(240, 248, 255, 0.9)")
        gradient.addColorStop(0.38, "rgba(180, 215, 250, 0.5)") // Martian blue forward-scattered halo
        gradient.addColorStop(0.68, "rgba(220, 145, 100, 0.25)") // Transition to atmospheric dust
        gradient.addColorStop(1, "rgba(166, 80, 44, 0.0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 256, 256)

        const tex = new THREE.CanvasTexture(canvas)
        tex.needsUpdate = true
        return tex
    }, [])

    // Ensure sun corona always faces the camera
    useFrame(({ camera }) => {
        if (sunRef.current) {
            sunRef.current.lookAt(camera.position)
        }
    })

    return (
        <group position={SUN_POSITION}>
            {/* Primary sunlight originating directly from the Sun */}
            <directionalLight
                position={[0, 0, 0]}
                intensity={2}
                color="#fff1dc"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={10}
                shadow-camera-far={400}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-bias={-0.0001}
            />

            <group ref={sunRef}>
                {/* Visible Sun Core Disk - Realistic size for Mars */}
                <mesh>
                    <sphereGeometry args={[0.7, 32, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        fog={false}
                        toneMapped={false}
                    />
                </mesh>

                {/* Sun Corona / Martian atmospheric halo */}
                {glowTexture && (
                    <mesh position={[0, 0, -0.2]}>
                        <planeGeometry args={[3.0, 3.0]} />
                        <meshBasicMaterial
                            map={glowTexture}
                            transparent
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                            fog={false}
                            toneMapped={false}
                        />
                    </mesh>
                )}
            </group>
        </group>
    )
}

const Mars = () => {
    const [isGrabbing, setIsGrabbing] = useState(false)

    return (
        <div
            className={`w-dvw h-dvh overflow-hidden select-none touch-none ${isGrabbing ? "cursor-grabbing" : "cursor-grab"
                }`}
            onPointerDown={() => setIsGrabbing(true)}
            onPointerUp={() => setIsGrabbing(false)}
        >
            <Canvas
                shadows
                camera={{
                    position: [CAMERA_ORIGIN.x, CAMERA_ORIGIN.y, CAMERA_ORIGIN.z],
                    fov: 65,
                    near: 0.1,
                    far: 1500,
                }}
            >
                {/* Physically Grounded Mars Atmospheric Sky Dome */}
                <MarsAtmosphereSky sunPosition={SUN_POSITION} />
                <fog attach="fog" args={["#944927", 35, 260]} />

                {/* Lighting */}
                {/* Warm ambient bounce from Martian soil */}
                <ambientLight intensity={0.55} color="#d4794e" />

                {/* Atmospheric gradient: orange sky above, dark dusty red ground below */}
                <hemisphereLight
                    args={["#c66a3b", "#3e190e", 0.65]}
                    position={[0, 50, 0]}
                />

                {/* Visible Mars Sun (Persis di tengah atas pandangan awal) */}
                <MarsSun />

                {/* Secondary gentle fill light */}
                <directionalLight
                    position={[-70, 40, -50]}
                    intensity={0.5}
                    color="#d66838"
                />

                <Suspense fallback={null}>
                    <MarsModel />
                    <PanoramaLookControls />
                </Suspense>
            </Canvas>
        </div>
    )
}

useGLTF.preload("/models/mars_terrain.glb")
useTexture.preload("/textures/rocky_terrain_03/diff_2k.jpg")
useTexture.preload("/textures/rocky_terrain_03/nor_gl_2k.jpg")
useTexture.preload("/textures/rocky_terrain_03/rough_2k.jpg")
useTexture.preload("/textures/rocky_terrain_03/ao_2k.jpg")

export default Mars
