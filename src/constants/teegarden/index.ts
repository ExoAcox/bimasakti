import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "teegarden",
    type: "star",
    class: StarClass.Red,
    parent: "",
    radius: 74400,
    distance: 0,
    intensity: 2.5,
    color: "#ff4422",
    axis: 0,
    rotate_duration: 96.4,
    orbit_duration: 0,
    icon: "red_star.png",
    gordilocks: {
        inner_radius: 3850000,
        outer_radius: 5550000,
    },
    planets
}]

export default { stars, planets }
