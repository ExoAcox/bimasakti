import { StarClass, type Star } from "@types"
import { planets } from "./planet"

export const stars: Star[] = [
        {
                id: "alpha_centauri_a",
                type: "star",
                class: StarClass.Yellow,
                parent: "",
                radius: 847000,
                distance: 1589000000, // ~10.62 AU from barycenter
                intensity: 1519,
                color: "#ffe0a0",
                axis: 7.9, // obliquity to the ecliptic in degrees
                rotate_duration: 22.0, // equator sidereal rotation period in days
                orbit_duration: 29187, // ~79.91 years in days
                texture: "sun.jpg",
                icon: "sun.png",
                // gordilocks: {
                //     inner_radius: 175160000,
                //     outer_radius: 307912000,
                // },
                get planets() {
                        return planets.filter(planet => planet.parent === this.id)
                }

        },
        {
                id: "alpha_centauri_b",
                type: "star",
                class: StarClass.Orange,
                parent: "",
                radius: 598000,
                distance: 1927000000, // ~12.88 AU from barycenter
                intensity: 500,
                color: "#ffaa44",
                axis: 7.25,
                rotate_duration: 41.0,
                orbit_duration: 29187, // ~79.91 years in days
                texture: "sun.jpg",
                icon: "sun.png",
                // gordilocks: {
                //     inner_radius: 100494000,
                //     outer_radius: 176658000,
                // },
                get planets() {
                        return planets.filter(planet => planet.parent === this.id)
                }
        },
        {
                id: "proxima_centauri",
                type: "star",
                class: StarClass.Red,
                parent: "",
                radius: 107200,
                distance: 1930000000000, // ~12,900 AU from barycenter
                intensity: 1.7,
                color: "#ff4411",
                axis: 7.25,
                rotate_duration: 82.6,
                orbit_duration: 199790000, // ~547,000 years in days
                texture: "sun.jpg",
                icon: "sun.png",
                gordilocks: {
                        inner_radius: 5860000,
                        outer_radius: 10300000,
                },
                get planets() {
                        return planets.filter(planet => planet.parent === this.id)
                }
        }
]
