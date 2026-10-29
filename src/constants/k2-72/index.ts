import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [
    {
        id: "k2-72",
        type: "star",
        class: StarClass.Red,
        parent: "",
        radius: 229580,
        distance: 0,
        intensity: 2.5,
        color: "#ff4d29",
        axis: 0,
        rotate_duration: 25.0,
        orbit_duration: 0,
        icon: "red_star.png",
        gordilocks: {
            inner_radius: 10500000,
            outer_radius: 21000000
        },
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    }
]

export default { stars, planets }
