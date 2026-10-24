import { StarClass, type Star } from "@types"
import { planets } from "./planet"
import { satellites } from "./satellite"

const stars: Star[] = [{
    id: "cervantes",
    type: "star",
    class: StarClass.Yellow,
    parent: "",
    radius: 947000,
    distance: 0,
    intensity: 3.8,
    color: "#fff0a8",
    axis: 0,
    rotate_duration: 37,
    orbit_duration: 0,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 185000000,
        outer_radius: 325000000,
    },
    planets
}]

export default { stars, planets, satellites }
