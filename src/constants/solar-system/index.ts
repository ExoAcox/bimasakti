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
    }
]

export default { stars, belts, comets, asteroids, planets, satellites, spacecraft, landmarks }

