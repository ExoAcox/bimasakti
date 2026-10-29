import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [
    {
        id: "corot-7",
        type: "star",
        class: StarClass.Orange,
        parent: "",
        radius: 570000,
        distance: 0,
        intensity: 3.5,
        color: "#ffa834",
        axis: 0,
        rotate_duration: 23.0,
        orbit_duration: 0,
        icon: "yellow_star.png",
        gordilocks: {
            inner_radius: 65000000,
            outer_radius: 125000000
        },
        get planets() {
            return planets.filter(planet => planet.parent === this.id)
        }
    }
]

export default { stars, planets }
