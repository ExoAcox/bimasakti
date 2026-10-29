import { StarClass, type Star } from "@types"
import { planets } from "./planet"

export const stars: Star[] = [
    {
        id: "kepler-47_a",
        type: "star",
        class: StarClass.Yellow,
        parent: "",
        radius: 671000,
        distance: 0,
        intensity: 950,
        color: "#ffe082",
        axis: 0,
        rotate_duration: 7.45,
        orbit_duration: 0,
        icon: "yellow_star.png",
        gordilocks: {
            inner_radius: 120000000,
            outer_radius: 210000000
        },
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    },
    {
        id: "kepler-47_b_star",
        type: "star",
        class: StarClass.Red,
        parent: "kepler-47_a",
        radius: 244000,
        distance: 12500000, // ~0.0836 AU mutual separation from Kepler-47 A
        intensity: 20,
        color: "#ff4411",
        axis: 0,
        rotate_duration: 7.45,
        orbit_duration: 7.45,
        icon: "red_star.png",
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    }
]
