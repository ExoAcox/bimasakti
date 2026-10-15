import type { Vector3 } from "@react-three/fiber"

export type CelestialType = "blackhole" | "star" | "planet" | "asteroid" | "comet" | "satellite" | "spacecraft-flyby" | "spacecraft-orbiter"
export type CelestialObject = Blackhole | Star | Planet | Asteroid | Comet | Satellite | SpaceCraft

export interface Object {
    id: string
    type: CelestialType
    parent: string
    radius: number
    distance: number
    color: string
    axis: number
    orbit_duration: number
    rotate_duration: number
    min_zoom?: number
    rotation?: [number, number, number]
    texture?: string
    texture_hd?: string
    night_texture?: string
    night_texture_hd?: string
    night_opacity?: number
    cloud_texture?: string
    cloud_opacity?: number
    topography_texture?: string
    artificial_satellites?: SpaceCraft[]
    aurora?: number
    atmosphere?: number
    model?: string
    icon?: string
    longest_distance?: number
    landmarks?: Landmark[]
    variant_id?: string
    liveview?: boolean
}

export interface Blackhole extends Object {
    type: "blackhole"
    model?: string
    stars: Star[]
}

export interface StarVariant extends Partial<Star> {
    variant_id: string
    order: number
}

export interface SatelliteVariant extends Partial<Satellite> {
    variant_id: string
    order: number
}

export interface Star extends Object {
    type: "star"
    class: StarClass
    planets: Planet[]
    intensity: number
    gordilocks?: {
        inner_radius: number
        outer_radius: number
    },
    variants?: StarVariant[]
}

export interface Variant extends Partial<Planet> {
    variant_id: string
    order: number
}

export interface Planet extends Object {
    type: "planet"
    class: PlanetClass
    satellites?: Satellite[]
    ring?: Ring
    variants?: Variant[]
}

export interface Satellite extends Object {
    type: "satellite"
    variants?: SatelliteVariant[]
}

export interface Asteroid extends Object {
    type: "asteroid"
    model: string
}

export interface Comet extends Object {
    type: "comet"
    model: string
    longest_distance: number
}

export interface SpaceCraft extends Object {
    type: "spacecraft-flyby" | "spacecraft-orbiter"
    model: string
    // class: SpaceCraftClass
    agencies: string[]
}

export interface Ring {
    inner_radius: number
    outer_radius: number
    texture: string
    opacity?: number
}

export interface Belt {
    id: string
    type: "belt"
    count: number
    min_size: number
    max_size: number
    inner_radius: number
    outer_radius: number
    height: number
    shape?: "ring" | "sphere"
    icon?: string
}

export const PlanetClass = {
    Terrestrial: "Terrestrial Planet",
    GasGiant: "Gas Giant Planet",
    IceGiant: "Ice Giant Planet",
    Dwarf: "Dwarf Planet",
    SuperEarth: "Super-Earth Planet"
} as const;

export const StarClass = {
    Yellow: "Yellow Dwarf Star",
    Orange: "Orange Dwarf Star",
    Red: "Red Dwarf Star",
    RedGiant: "Red Giant Star",
    Neutron: "Neutron Star",
    Blue: "Blue Main-Sequence Star"
} as const;

// export const SpaceCraftClass = {
//     FlyBy: "Fly-by Probe",
//     Orbiter: "Orbiter Probe",
//     Station: "Space Station",
//     Telescope: "Space Telescope"
// } as const

export type PlanetClass = (typeof PlanetClass)[keyof typeof PlanetClass];
export type StarClass = (typeof StarClass)[keyof typeof StarClass];
// export type SpaceCraftClass = (typeof SpaceCraftClass)[keyof typeof SpaceCraftClass];

export interface Landmark {
    id: string
    type?: "landmark"
    latitude: number
    longitude: number
    parent: string
    reverse?: true
    object?: {
        name: string
        icon: string
    }
}

export interface Nation {
    id: string
    latitude: number
    longitude: number
}

export interface Universe {
    id: string
    image: string
    stars: Star[]
    position: Vector3,
    minDistance: number,
    maxDistance: number,
    cameraPosition: Vector3,
    labelPosition: "top" | "bottom" | "left" | "right",
    labelLength?: number,
    defaultFocus?: string,
    assetCount?: number,
    skyboxTexture?: string,
    mobile: Partial<Universe>
}

export const Mode = {
    Object: "object-view",
    ThirdPerson: "third-person",
    FirstPerson: "first-person",
    LiveView: "live-view"
} as const

export type Mode = (typeof Mode)[keyof typeof Mode];