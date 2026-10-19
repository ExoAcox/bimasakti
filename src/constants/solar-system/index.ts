import { StarClass, type Asteroid, type Belt, type Comet, type Star, type StarVariant } from "@types"
import { planets } from "./planet"
import { satellites } from "./satellite"
import { spacecraft } from "./spacecraft"
import { landmarks } from "./landmark"
import { variants } from "./variant"

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
    childCount: 8,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 142120000,
        outer_radius: 249832000,
    },
    get artificial_satellites() {
        return spacecraft.filter((craft) => craft.parent === this.id)
    },
    get variants() {
        return variants[this.id] as StarVariant[]
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
        height: 150000000,
        icon: "asteroid.png"
    },
    {
        id: "kuiper",
        type: "belt",
        count: 100000000,
        min_size: 100,
        max_size: 400,
        inner_radius: 4500000000,
        outer_radius: 7500000000,
        height: 1500000000,
        icon: "asteroid.png"
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
        texture: "halley.png",
        icon: "asteroid.png"
    },
    {
        id: "churyumov-gerasimenko",
        type: "comet",
        parent: "sun",
        radius: 2.0,
        distance: 185980000,
        longest_distance: 850400000,
        color: "#999999",
        axis: 7.04,
        orbit_duration: 2345,
        rotate_duration: 0.517,
        model: "churyumov-gerasimenko.glb",
        icon: "asteroid.png"
    }
]

const asteroids: Asteroid[] = [

    {
        id: "vesta",
        type: "asteroid",
        parent: "sun",
        radius: 262.7,
        distance: 353400000,
        rotation: [90, 0, 0],
        color: "#9c9589",
        axis: 7.14,
        orbit_duration: 1325.4,
        rotate_duration: 0.22,
        model: "vesta.ply",
        texture: "vesta.jpg",
        icon: "asteroid.png",
        get landmarks() {
            return landmarks.filter((landmark) => landmark.parent === this.id)
        }
    },
    {
        id: "pallas",
        type: "asteroid",
        parent: "sun",
        radius: 256,
        distance: 414400000,
        rotation: [90, 0, 0],
        color: "#a59d94",
        axis: 34.8,
        orbit_duration: 1686,
        rotate_duration: 0.3255,
        model: "pallas.ply",
        texture: "pallas.ktx2",
        icon: "asteroid.png"
    },
    {
        id: "eros",
        type: "asteroid",
        parent: "sun",
        radius: 8.4,
        distance: 218100000,
        color: "#bfa89b",
        axis: 89,
        orbit_duration: 643.2,
        rotate_duration: 0.2196,
        model: "eros.glb",
        icon: "asteroid.png"
    },
    {
        id: "itokawa",
        type: "asteroid",
        parent: "sun",
        radius: 0.165,
        distance: 198100000,
        color: "#a8a29a",
        axis: 178,
        orbit_duration: 556.4,
        rotate_duration: 0.5055,
        model: "itokawa.glb",
        icon: "asteroid.png"
    },
]

export default { stars, belts, comets, asteroids, planets, satellites, spacecraft, landmarks }

