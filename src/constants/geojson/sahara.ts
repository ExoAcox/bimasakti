export interface GeoJsonPolygon {
    type: "Polygon"
    coordinates: number[][][]
}

export interface GeoJsonMultiPolygon {
    type: "MultiPolygon"
    coordinates: number[][][][]
}

export interface GeoJsonLineString {
    type: "LineString"
    coordinates: number[][]
}

export type GeoJsonGeometry = GeoJsonPolygon | GeoJsonMultiPolygon | GeoJsonLineString

export interface GeoJsonFeature {
    type: "Feature"
    properties?: Record<string, any>
    geometry: GeoJsonGeometry
}

export interface GeoJsonFeatureCollection {
    type: "FeatureCollection"
    features: GeoJsonFeature[]
}

export type GeoJsonData = GeoJsonGeometry | GeoJsonFeature | GeoJsonFeatureCollection

// Refined GeoJSON boundary coordinates for Sahara Desert (North Africa)
// Coordinates format: [longitude, latitude]
export const SAHARA_DESERT_GEOJSON: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Sahara Desert",
                id: "sahara_desert",
                category: "desert",
                // color: "#eab308", // Golden yellow
                strokeColor: "#facc15", // Bright amber outline
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        // Counter-clockwise outer boundary ring of Sahara Desert
                        [-16.5, 20.5],
                        [-16.0, 17.5],
                        [-12.5, 15.8],
                        [-8.0, 15.0],
                        [-2.0, 15.2],
                        [4.0, 15.5],
                        [10.0, 15.0],
                        [16.0, 14.5],
                        [22.0, 14.0],
                        [28.0, 14.5],
                        [33.5, 15.0],
                        [36.0, 19.0],
                        [35.5, 23.0],
                        [33.5, 27.5],
                        [32.0, 31.0],
                        [27.0, 31.2],
                        [22.0, 31.5],
                        [15.0, 31.0],
                        [10.5, 33.5],
                        [7.0, 35.0],
                        [2.0, 34.5],
                        [-3.0, 33.0],
                        [-7.5, 31.5],
                        [-11.5, 29.0],
                        [-14.5, 26.5],
                        [-16.8, 23.5],
                        [-16.5, 20.5], // Close ring
                    ]
                ]
            }
        }
    ]
}
