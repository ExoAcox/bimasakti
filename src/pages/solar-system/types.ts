export interface Object {
    id: string
    type: "star" | "planet" | "satellite" | "artificial_satellite" | "dummy"
    parent: string
    radius: number
    distance: number
    color: string
    axis: number
    orbit_duration: number
    rotate_duration: number
    texture?: string
    icon?: string
    overlay_textures?: string[]
}

export interface Dummy extends Object {
    type: "dummy"
}


export interface Star extends Object {
    type: "star"
    planets: Planet[]
    intensity: number
}

export interface Satellite extends Object {
    type: "satellite"
}

export interface ArtificialSatellite extends Object {
    type: "artificial_satellite"
    model: string
}

export interface Planet extends Object {
    type: "planet"
    satellites?: Satellite[]
    artificial_satellites?: ArtificialSatellite[]
    ring?: Ring
}

export interface Ring {
    inner_radius: number
    outer_radius: number
    texture: string
}

export interface Belt {
    id: string
    type: "belt"
    min_size: number
    max_size: number
    inner_radius: number
    outer_radius: number
    height: number
}
