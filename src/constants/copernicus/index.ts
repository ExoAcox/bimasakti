import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [
    {
        id: "copernicus",
        type: "star",
        class: StarClass.Yellow,
        parent: "",
        radius: 654000,
        distance: 0,
        intensity: 589,
        color: "#ffcc44",
        axis: 7.25,
        rotate_duration: 42.2,
        orbit_duration: 0,
        icon: "yellow_star.png",
        gordilocks: {
            inner_radius: 110000000,
            outer_radius: 200000000,
        },
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    },
    {
        id: "55_cancri_b",
        type: "star",
        class: StarClass.Red,
        parent: "",
        radius: 208700,
        distance: 159300000000,
        intensity: 2,
        color: "#ff4411",
        axis: 7.25,
        rotate_duration: 39,
        orbit_duration: 12000000,
        icon: "red_star.png",
        gordilocks: {
            inner_radius: 5700000,
            outer_radius: 9500000,
        },
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    }
]

export default { stars, planets }
