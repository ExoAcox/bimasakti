import { useLoader } from "@react-three/fiber"
import { useMemo } from "react"
import { BufferAttribute, MathUtils, type BufferGeometry } from "three"
import { PLYLoader } from "three-stdlib"

const generateSphericalUVs = (geometry: BufferGeometry) => {
    if (!geometry) return

    const pos = geometry.attributes.position
    if (!pos) return

    const count = pos.count
    const uvs = new Float32Array(count * 2)

    for (let i = 0; i < count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)

        const radius = Math.sqrt(x * x + y * y + z * z) || 1
        const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI)
        const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, y / radius))) / Math.PI

        uvs[i * 2] = u
        uvs[i * 2 + 1] = v
    }

    for (let i = 0; i < count; i += 3) {
        const u0 = uvs[i * 2]
        const u1 = uvs[(i + 1) * 2]
        const u2 = uvs[(i + 2) * 2]

        const maxU = Math.max(u0, u1, u2)
        const minU = Math.min(u0, u1, u2)

        if (maxU - minU > 0.5) {
            if (u0 < 0.5) uvs[i * 2] += 1.0
            if (u1 < 0.5) uvs[(i + 1) * 2] += 1.0
            if (u2 < 0.5) uvs[(i + 2) * 2] += 1.0
        }
    }

    geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
}

const ModelRenderer = ({ path, rotation }: { path: string, rotation?: [number, number, number] }) => {
    const rawGeometry = useLoader(PLYLoader, `/models/${path}`)

    const geometry = useMemo(() => {
        if (!rawGeometry) return null

        const geo = rawGeometry.clone()
        const [x, y, z] = rotation ?? [0, 0, 0]
        if (x) geo.rotateX(MathUtils.degToRad(x))
        if (y) geo.rotateY(MathUtils.degToRad(y))
        if (z) geo.rotateZ(MathUtils.degToRad(z))

        geo.computeVertexNormals()

        const unindexedGeo = geo.index ? geo.toNonIndexed() : geo
        generateSphericalUVs(unindexedGeo)

        const pos = unindexedGeo.attributes.position
        let maxDistSq = 0
        if (pos) {
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i)
                const y = pos.getY(i)
                const z = pos.getZ(i)
                const distSq = x * x + y * y + z * z
                if (distSq > maxDistSq) maxDistSq = distSq
            }
        }
        const maxDist = Math.sqrt(maxDistSq)
        if (maxDist > 0) {
            const scaleFactor = 1 / maxDist
            unindexedGeo.scale(scaleFactor, scaleFactor, scaleFactor)
        }
        return unindexedGeo
    }, [rawGeometry])

    if (!geometry) return null

    return <primitive object={geometry} attach="geometry" />
}

export default ModelRenderer