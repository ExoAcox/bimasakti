import { StarClass, type Belt, type Comet, type Star } from "@types"
import { planets } from "./planet"
import { satellites, artificial_satellites } from "./satellite"

const stars: Star[] = [{
    id: "sun",
    type: "star",
    class: StarClass.Yellow,
    parent: "",
    radius: 695700,
    distance: 0,
    intensity: 1000,
    color: "#ff6600",
    axis: 7.25, // obliquity to the ecliptic in degrees
    rotate_duration: 25.05, // equator sidereal rotation period in days
    orbit_duration: 0,
    texture: "sun.jpg",
    icon: "sun.png",
    gordilocks: {
        inner_radius: 142120000,
        outer_radius: 249832000,
    },
    planets
}]

const belts: Belt[] = [
    {
        id: "asteriod",
        type: "belt",
        count: 1000000,
        min_size: 100,
        max_size: 300,
        inner_radius: 329000000,
        outer_radius: 478000000,
        height: 150000000
    },
    {
        id: "kuiper",
        type: "belt",
        count: 1000000,
        min_size: 100,
        max_size: 400,
        inner_radius: 4500000000,
        outer_radius: 7500000000,
        height: 1500000000
    }
]

const comets: Comet[] = [
    {
        id: "halley",
        type: "comet",
        parent: "sun",
        radius: 5.5,
        distance: 87660000,
        longest_distance: 5250000000,
        color: "#cccccc",
        axis: 162.26,
        orbit_duration: 27500,
        rotate_duration: 2.2,
        model: "halley.ply",
        icon: "asteroid.png"
    }
]

export default { stars, belts, comets, planets, satellites, artificial_satellites }
