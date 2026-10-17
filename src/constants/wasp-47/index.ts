import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "wasp-47",
    type: "star",
    class: StarClass.Yellow,
    parent: "",
    radius: 800000,
    distance: 0,
    intensity: 3.5,
    color: "#ffb833",
    axis: 0,
    rotate_duration: 13.1,
    orbit_duration: 0,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 149000000,
        outer_radius: 268000000,
    },
    planets
}]

export default { stars, planets }
