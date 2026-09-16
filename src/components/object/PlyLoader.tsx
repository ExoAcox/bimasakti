import { useLoader } from "@react-three/fiber"
import { useMemo } from "react"
import { BufferAttribute, type BufferGeometry } from "three"
import { PLYLoader } from "three-stdlib"

const generateSphericalUVs = (geometry: BufferGeometry) => {
    if (!geometry || geometry.attributes.uv) return

    const pos = geometry.attributes.position
    if (!pos) return

    const uvs = new Float32Array(pos.count * 2)

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)

        const radius = Math.sqrt(x * x + y * y + z * z) || 1
        const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI)
        const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, y / radius))) / Math.PI

        uvs[i * 2] = u
        uvs[i * 2 + 1] = v
    }

    geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
}

const ModelRenderer = ({ path }: { path: string }) => {
    const geometry = useLoader(PLYLoader, `/models/${path}`)

    useMemo(() => {
        if (geometry) {
            geometry.center()
            geometry.computeVertexNormals()
            generateSphericalUVs(geometry)
            geometry.computeBoundingSphere()
            if (geometry.boundingSphere && geometry.boundingSphere.radius > 0) {
                const scaleFactor = 1 / geometry.boundingSphere.radius
                geometry.scale(scaleFactor, scaleFactor, scaleFactor)
            }
        }
    }, [geometry])

    return <primitive object={geometry} attach="geometry" />
}

export default ModelRenderer