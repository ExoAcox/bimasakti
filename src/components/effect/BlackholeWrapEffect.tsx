import { useRef } from "react"
import { Effect } from "postprocessing"
import { Uniform, Vector2, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { wrapEffect } from "@react-three/postprocessing"
import { blackHoleLensingFragmentShader } from "@shaders"
import { useCelestial } from "@function"

export class BlackHoleLensingEffectImpl extends Effect {
    constructor() {
        super("BlackHoleLensingEffect", blackHoleLensingFragmentShader, {
            uniforms: new Map<string, Uniform>([
                ["uPosition", new Uniform(new Vector2(0.5, 0.5))],
                ["uRatio", new Uniform(1.0)],
                ["uDistance", new Uniform(1.0)],
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

        const worldPos = new Vector3()
        bhMesh.getWorldPosition(worldPos)

        const projPos = worldPos.clone().project(camera)

        // If behind camera frustum, disable lensing
        if (projPos.z > 1.0) {
            const activeUniform = uniforms.get("uActive")
            if (activeUniform) activeUniform.value = 0.0
            return
        }

        const screenX = (projPos.x + 1) * 0.5
        const screenY = (projPos.y + 1) * 0.5
        const distance = camera.position.distanceTo(worldPos)
        const ratio = size.height / size.width

        const uPosition = uniforms.get("uPosition")
        if (uPosition) uPosition.value.set(screenX, screenY)

        const uRatio = uniforms.get("uRatio")
        if (uRatio) uRatio.value = ratio

        const uDistance = uniforms.get("uDistance")
        if (uDistance) uDistance.value = distance

        const uActive = uniforms.get("uActive")
        if (uActive) uActive.value = 1.0
    })

    return <BlackHoleLensingWrapped ref={effectRef} />
}

export default BlackHoleLensingEffect
