import type { Star } from "../types"
import { dwarfPlanets, planets, planets_ac } from "./planet"

export const stars: Star[] = [{
    id: "sun",
    type: "star",
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
    get planets() {
        return [...planets, ...dwarfPlanets]
    }
}]

export const sun = stars[0]


export const stars_ac: Star[] = [
    {
        id: "alpha_centauri_a",
        type: "star",
        parent: "",
        radius: 847000,
        distance: 1589000000, // ~10.62 AU from barycenter
        intensity: 1.519e17,
        color: "#ffe0a0",
        axis: 7.9, // obliquity to the ecliptic in degrees
        rotate_duration: 22.0, // equator sidereal rotation period in days
        orbit_duration: 29187, // ~79.91 years in days
        texture: "sun.jpg",
        icon: "sun.png",
        get planets() {
            return planets_ac.filter(planet => planet.parent === this.id)
        }

    },
    {
        id: "alpha_centauri_b",
        type: "star",
        parent: "",
        radius: 598000,
        distance: 1927000000, // ~12.88 AU from barycenter
        intensity: 0.5e17,
        color: "#ffaa44",
        axis: 7.25,
        rotate_duration: 41.0,
        orbit_duration: 29187, // ~79.91 years in days
        texture: "sun.jpg",
        icon: "sun.png",
        get planets() {
            return planets_ac.filter(planet => planet.parent === this.id)
        }
    },
    {
        id: "proxima_centauri",
        type: "star",
        parent: "",
        radius: 107200,
        distance: 1930000000000, // ~12,900 AU from barycenter
        intensity: 1.7e14,
        color: "#ff4411",
        axis: 7.25,
        rotate_duration: 82.6,
        orbit_duration: 199790000, // ~547,000 years in days
        texture: "sun.jpg",
        icon: "sun.png",
        get planets() {
            return planets_ac.filter(planet => planet.parent === this.id)
        }
    }
]
