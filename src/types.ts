import type { Vector3 } from "@react-three/fiber"

export type CelestialType = "blackhole" | "star" | "planet" | "satellite" | "artificial_satellite" | "human_made" | "dummy"
export type CelestialObject = Blackhole | Star | Planet | ArtificialSatellite | Satellite | HumanMade | Dummy

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
    texture?: string
    icon?: string
    overlay_textures?: string[]
}

export interface Dummy extends Object {
    type: "dummy"
}

export interface Blackhole extends Object {
    type: "blackhole"
    model?: string
    stars: Star[]
}

export interface Star extends Object {
    type: "star"
    class: StarClass
    planets: Planet[]
    intensity: number
    gordilocks?: {
        inner_radius: number
        outer_radius: number
    }
}

export interface Satellite extends Object {
    type: "satellite"
    model?: string
}

export interface HumanMade extends Object {
    type: "human_made"
    model: string
}

export interface ArtificialSatellite extends Object {
    type: "artificial_satellite"
    model: string
}

export interface Planet extends Object {
    type: "planet"
    class: PlanetClass
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
    Blackhole: "Supermassive Blackhole"
} as const;

export type PlanetClass = (typeof PlanetClass)[keyof typeof PlanetClass];
export type StarClass = (typeof StarClass)[keyof typeof StarClass];

export interface Universe {
    id: string
    component: React.ReactNode,
    stars: Star[]
    position: Vector3,
    minDistance: number,
    maxDistance: number,
    cameraPosition: Vector3,
    labelPosition: "top" | "bottom" | "left" | "right"
}