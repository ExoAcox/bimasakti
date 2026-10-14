import type { CelestialType } from "@types"

export interface Gordilocks {
    inner_radius: number
    outer_radius: number
}

export interface UniverseRow {
    id: string
    image: string
    position_x: number
    position_y: number
    position_z: number
    min_distance: number
    max_distance: number
    camera_x: number
    camera_y: number
    camera_z: number
    label_position: "top" | "bottom" | "left" | "right"
    default_focus: string | null
    asset_count: number
    mobile: string | null
    order_index: number
}

export interface CelestialObjectRow {
    id: string
    universe_id: string
    parent_id: string | null
    type: CelestialType
    class: string | null
    radius: number
    distance: number
    longest_distance: number | null
    color: string
    axis: number
    tidal_axis: number | null
    orbit_duration: number
    rotate_duration: number
    min_zoom: number | null
    rotation: string | null
    texture: string | null
    texture_hd: string | null
    night_texture: string | null
    night_texture_hd: string | null
    night_opacity: number | null
    cloud_texture: string | null
    cloud_opacity: number | null
    topography_texture: string | null
    atmosphere: number | null
    aurora: number | null
    intensity: number | null
    gordilocks: string | null
    ring: string | null
    model: string | null
    icon: string | null
    agencies: string | null
    order_index: number
}

export interface BeltRow {
    id: string
    universe_id: string
    type: "belt"
    count: number
    min_size: number
    max_size: number
    inner_radius: number
    outer_radius: number
    height: number
    shape: "ring" | "sphere" | null
    icon: string | null
}

export interface LandmarkRow {
    id: string
    parent_id: string
    type: string
    name: string | null
    icon: string | null
    latitude: number
    longitude: number
    reverse: number
}

export interface NationRow {
    id: string
    latitude: number
    longitude: number
}

export interface VariantRow {
    id: number
    parent_id: string
    variant_id: string
    order_val: number
    class: string | null
    radius: number | null
    color: string | null
    intensity: number | null
    gordilocks: string | null
    texture: string | null
    texture_hd: string | null
    night_texture: string | null
    topography_texture: string | null
    cloud_texture: string | null
    aurora: number | null
    icon: string | null
    landmarks: string | null
    artificial_satellites: string | null
}
