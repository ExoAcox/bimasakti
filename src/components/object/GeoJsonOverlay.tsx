import { useMemo } from "react"
import { BufferGeometry, Float32BufferAttribute, MathUtils, Vector3, Vector2, ShapeUtils, DoubleSide } from "three"
import type { GeoJsonData, GeoJsonFeature, GeoJsonGeometry } from "@constants/geojson/sahara"

interface Props {
    data: GeoJsonData
    color?: string
    strokeColor?: string
    fillOpacity?: number
    altitude?: number
    lonOffset?: number
}

export const latLongToVector3 = (
    lat: number,
    lon: number,
    radius: number = 1.003,
    lonOffset: number = 0
): Vector3 => {
    const latRad = MathUtils.degToRad(lat)
    const lonRad = MathUtils.degToRad(lon + lonOffset)

    const y = radius * Math.sin(latRad)
    const horizRadius = radius * Math.cos(latRad)

    const x = horizRadius * Math.cos(lonRad)
    const z = -horizRadius * Math.sin(lonRad)

    return new Vector3(x, y, z)
}

// Interpolate boundary line points to follow sphere surface curvature smoothly
const interpolatePoints = (coords: number[][], maxStepDeg: number = 1.0): number[][] => {
    if (coords.length < 2) return coords
    const result: number[][] = []

    for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i]
        const [lon2, lat2] = coords[i + 1]

        const dist = Math.hypot(lon2 - lon1, lat2 - lat1)
        const steps = Math.max(1, Math.ceil(dist / maxStepDeg))

        for (let s = 0; s < steps; s++) {
            const t = s / steps
            const lon = lon1 + (lon2 - lon1) * t
            const lat = lat1 + (lat2 - lat1) * t
            result.push([lon, lat])
        }
    }
    result.push(coords[coords.length - 1])
    return result
}

// Subdivide a 2D triangle (A, B, C) in (lon, lat) space recursively so all sub-vertices sit on sphere radius
const subdivideTriangle2D = (
    a: [number, number],
    b: [number, number],
    c: [number, number],
    maxDeg: number = 1.2
): Array<[[number, number], [number, number], [number, number]]> => {
    const dAB = Math.hypot(a[0] - b[0], a[1] - b[1])
    const dBC = Math.hypot(b[0] - c[0], b[1] - c[1])
    const dCA = Math.hypot(c[0] - a[0], c[1] - a[1])

    if (dAB <= maxDeg && dBC <= maxDeg && dCA <= maxDeg) {
        return [[a, b, c]]
    }

    const ab: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    const bc: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2]
    const ca: [number, number] = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2]

    return [
        ...subdivideTriangle2D(a, ab, ca, maxDeg),
        ...subdivideTriangle2D(b, bc, ab, maxDeg),
        ...subdivideTriangle2D(c, ca, bc, maxDeg),
        ...subdivideTriangle2D(ab, bc, ca, maxDeg),
    ]
}

const extractFeatures = (data: GeoJsonData): GeoJsonFeature[] => {
    if (data.type === "FeatureCollection") {
        return data.features
    } else if (data.type === "Feature") {
        return [data]
    } else {
        return [{ type: "Feature", geometry: data as GeoJsonGeometry }]
    }
}

const PolygonMesh = ({
    ring,
    color,
    fillOpacity,
    fillRadius,
    lonOffset,
}: {
    ring: number[][]
    color: string
    fillOpacity: number
    fillRadius: number
    lonOffset: number
}) => {
    const geometry = useMemo(() => {
        if (!ring || ring.length < 3) return null

        // 1. Remove duplicate end point if present for 2D triangulation
        const pts = ring.slice()
        if (
            pts.length > 3 &&
            pts[0][0] === pts[pts.length - 1][0] &&
            pts[0][1] === pts[pts.length - 1][1]
        ) {
            pts.pop()
        }

        // 2. Convert points to Vector2 for ShapeUtils
        const contour2D = pts.map(([lon, lat]) => new Vector2(lon, lat))

        // 3. Perform 2D Ear Clipping triangulation
        const faces = ShapeUtils.triangulateShape(contour2D, [])
        if (!faces || faces.length === 0) return null

        // 4. Subdivide all 2D triangles so they adapt to the sphere's curved surface
        const subdividedTriangles: Array<[[number, number], [number, number], [number, number]]> = []
        for (const face of faces) {
            const p0: [number, number] = [pts[face[0]][0], pts[face[0]][1]]
            const p1: [number, number] = [pts[face[1]][0], pts[face[1]][1]]
            const p2: [number, number] = [pts[face[2]][0], pts[face[2]][1]]

            const subTris = subdivideTriangle2D(p0, p1, p2, 1.2)
            subdividedTriangles.push(...subTris)
        }

        // 5. Convert all subdivided 2D triangles to 3D sphere positions
        const positions: number[] = []
        const normals: number[] = []

        for (const [v0, v1, v2] of subdividedTriangles) {
            const vec0 = latLongToVector3(v0[1], v0[0], fillRadius, lonOffset)
            const vec1 = latLongToVector3(v1[1], v1[0], fillRadius, lonOffset)
            const vec2 = latLongToVector3(v2[1], v2[0], fillRadius, lonOffset)

            positions.push(
                vec0.x, vec0.y, vec0.z,
                vec1.x, vec1.y, vec1.z,
                vec2.x, vec2.y, vec2.z
            )

            const norm0 = vec0.clone().normalize()
            const norm1 = vec1.clone().normalize()
            const norm2 = vec2.clone().normalize()

            normals.push(
                norm0.x, norm0.y, norm0.z,
                norm1.x, norm1.y, norm1.z,
                norm2.x, norm2.y, norm2.z
            )
        }

        const geo = new BufferGeometry()
        geo.setAttribute("position", new Float32BufferAttribute(positions, 3))
        geo.setAttribute("normal", new Float32BufferAttribute(normals, 3))
        return geo
    }, [ring, fillRadius, lonOffset])

    if (!geometry) return null

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial
                color={color}
                transparent
                opacity={fillOpacity}
                side={DoubleSide}
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-1}
                roughness={0.4}
                metalness={0.1}
            />
        </mesh>
    )
}

const RingLine = ({
    ring,
    color,
    lineRadius,
    lonOffset,
}: {
    ring: number[][]
    color: string
    lineRadius: number
    lonOffset: number
}) => {
    const geometry = useMemo(() => {
        const denseRing = interpolatePoints(ring, 0.8)
        const points: Vector3[] = denseRing.map(([lon, lat]) =>
            latLongToVector3(lat, lon, lineRadius, lonOffset)
        )
        const geo = new BufferGeometry()
        geo.setFromPoints(points)
        return geo
    }, [ring, lineRadius, lonOffset])

    return (
        <lineLoop geometry={geometry}>
            <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.95} />
        </lineLoop>
    )
}

export const GeoJsonOverlay = ({
    data,
    color,
    strokeColor,
    fillOpacity = 0.35,
    altitude = 0.003,
    lonOffset = 0,
}: Props) => {
    const features = useMemo(() => extractFeatures(data), [data])
    const fillRadius = 1.0 + altitude
    const lineRadius = fillRadius + 0.001

    return (
        <group name="geojson-overlay">
            {features.map((feature, featureIdx) => {
                const geom = feature.geometry
                const itemColor = feature.properties?.color || color
                const itemStroke = feature.properties?.strokeColor || strokeColor

                if (geom.type === "Polygon") {
                    return (
                        <group key={featureIdx}>
                            {geom.coordinates.map((ring, ringIdx) => (
                                <group key={ringIdx}>
                                    <PolygonMesh
                                        ring={ring}
                                        color={itemColor}
                                        fillOpacity={fillOpacity}
                                        fillRadius={fillRadius}
                                        lonOffset={lonOffset}
                                    />
                                    <RingLine
                                        ring={ring}
                                        color={itemStroke}
                                        lineRadius={lineRadius}
                                        lonOffset={lonOffset}
                                    />
                                </group>
                            ))}
                        </group>
                    )
                }

                if (geom.type === "MultiPolygon") {
                    return (
                        <group key={featureIdx}>
                            {geom.coordinates.map((poly, polyIdx) =>
                                poly.map((ring, ringIdx) => (
                                    <group key={`${polyIdx}-${ringIdx}`}>
                                        <PolygonMesh
                                            ring={ring}
                                            color={itemColor}
                                            fillOpacity={fillOpacity}
                                            fillRadius={fillRadius}
                                            lonOffset={lonOffset}
                                        />
                                        <RingLine
                                            ring={ring}
                                            color={itemStroke}
                                            lineRadius={lineRadius}
                                            lonOffset={lonOffset}
                                        />
                                    </group>
                                ))
                            )}
                        </group>
                    )
                }

                if (geom.type === "LineString") {
                    return (
                        <RingLine
                            key={featureIdx}
                            ring={geom.coordinates}
                            color={itemStroke}
                            lineRadius={lineRadius}
                            lonOffset={lonOffset}
                        />
                    )
                }

                return null
            })}
        </group>
    )
}

export default GeoJsonOverlay
