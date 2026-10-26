import { useRef } from "react"
import { Effect } from "postprocessing"
import { Uniform, Vector2, Vector3, type PerspectiveCamera } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { wrapEffect } from "@react-three/postprocessing"
import { blackHoleLensingFragmentShader } from "@shaders/blackhole"
import { useCelestial } from "@function"
import { useControlStore } from "@state"

export class BlackHoleLensingEffectImpl extends Effect {
    constructor() {
        super("BlackHoleLensingEffect", blackHoleLensingFragmentShader, {
            uniforms: new Map<string, Uniform>([
                ["uPosition", new Uniform(new Vector2(0.5, 0.5))],
                ["uRatio", new Uniform(1.0)],
                ["uDistance", new Uniform(1.0)],
                ["uRadius", new Uniform(0.1)],
                ["uRad", new Uniform(2.0)],
                ["uMul", new Uniform(2.0)],
                ["uK", new Uniform(1.4)],
                ["uEH", new Uniform(1)],
                ["uActive", new Uniform(0.0)],
            ]),
        })
    }
}

const BlackHoleLensingWrapped = wrapEffect(BlackHoleLensingEffectImpl)

export const BlackHoleLensingEffect = () => {
    const effectRef = useRef<BlackHoleLensingEffectImpl>(null!)
    const { camera, size, scene } = useThree()
    const celestial = useCelestial()
    const currentUniverse = celestial.getUniverse()
    const { focus } = useControlStore()

    // Persistent vectors to prevent allocations in useFrame (AGENTS.md rule 6.1)
    const worldPosRef = useRef(new Vector3())
    const projPosRef = useRef(new Vector3())
    const camDirRef = useRef(new Vector3())
    const toBhRef = useRef(new Vector3())
    const worldScaleRef = useRef(new Vector3())

    useFrame(() => {
        if (!effectRef.current) return

        const uniforms = effectRef.current.uniforms
        const isSagittariusA = currentUniverse.id === "sagittarius_a"

        if (!isSagittariusA) {
            const activeUniform = uniforms.get("uActive")
            if (activeUniform) activeUniform.value = 0.0
            return
        }

        const bhMesh = scene.getObjectByName("sagittarius_a")
        if (!bhMesh) {
            const activeUniform = uniforms.get("uActive")
            if (activeUniform) activeUniform.value = 0.0
            return
        }

        bhMesh.getWorldPosition(worldPosRef.current)

        // Check if object is in front of the camera plane
        camera.getWorldDirection(camDirRef.current)
        toBhRef.current.subVectors(worldPosRef.current, camera.position)
        if (toBhRef.current.dot(camDirRef.current) <= 0) {
            const activeUniform = uniforms.get("uActive")
            if (activeUniform) activeUniform.value = 0.0
            return
        }

        projPosRef.current.copy(worldPosRef.current).project(camera)

        // If behind camera frustum, disable lensing
        if (projPosRef.current.z > 1.0) {
            const activeUniform = uniforms.get("uActive")
            if (activeUniform) activeUniform.value = 0.0
            return
        }

        const screenX = (projPosRef.current.x + 1) * 0.5
        const screenY = (projPosRef.current.y + 1) * 0.5
        const distance = camera.position.distanceTo(worldPosRef.current)
        const ratio = size.height / size.width

        // Compute projected screen-space radius of the event horizon
        bhMesh.getWorldScale(worldScaleRef.current)
        const worldRadius = worldScaleRef.current.x || 120.0
        const persCamera = camera as PerspectiveCamera
        const fov = persCamera.fov ? (persCamera.fov * Math.PI) / 180 : 1.0
        const visibleHeight = 2.0 * Math.max(distance, 0.001) * Math.tan(fov / 2.0)
        const screenRadius = worldRadius / Math.max(visibleHeight, 0.0001)

        const uPosition = uniforms.get("uPosition")
        if (uPosition) uPosition.value.set(screenX, screenY)

        const uRatio = uniforms.get("uRatio")
        if (uRatio) uRatio.value = ratio

        const uDistance = uniforms.get("uDistance")
        if (uDistance) uDistance.value = distance

        const uRadius = uniforms.get("uRadius")
        if (uRadius) uRadius.value = screenRadius

        const isSgrAFocused = focus === "sagittarius_a" || !focus
        const uEH = uniforms.get("uEH")
        if (uEH) uEH.value = isSgrAFocused ? 1 : 0

        const uActive = uniforms.get("uActive")
        if (uActive) uActive.value = 1.0
    })

    return <BlackHoleLensingWrapped ref={effectRef} />
}

export default BlackHoleLensingEffect
