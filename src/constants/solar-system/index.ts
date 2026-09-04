import { StarClass, type Belt, type Star } from "@types"
import { dwarf_planets, planets } from "./planet"
import { satellites, artificial_satellites } from "./satellite"

const stars: Star[] = [{
    id: "sun",
    type: "star",
    class: StarClass.Yellow,
    parent: "",
    radius: 695700,
    distance: 0,
    intensity: 1e17,
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
    get planets() {
        return [...planets, ...dwarf_planets]
    }
}]

const belts: Belt[] = [
    {
        id: "asteriod",
        type: "belt",
        min_size: 100,
        max_size: 300,
        inner_radius: 329000000,
        outer_radius: 478000000,
        height: 150000000
    }
]

export default { stars, belts, planets, dwarf_planets, satellites, artificial_satellites }