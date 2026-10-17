import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "kepler-32",
    type: "star",
    class: StarClass.Red,
    parent: "",
    radius: 369000,
    distance: 0,
    intensity: 3,
    color: "#ff5522",
    axis: 0,
    rotate_duration: 37.8,
    orbit_duration: 0,
    icon: "red_star.png",
    gordilocks: {
        inner_radius: 20000000,
        outer_radius: 48000000,
    },
    planets
}]

export default { stars, planets }
