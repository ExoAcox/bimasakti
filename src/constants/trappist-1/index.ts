import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "trappist-1",
    type: "star",
    class: StarClass.Red,
    parent: "",
    radius: 81400,
    distance: 0,
    intensity: 2,
    color: "#ff4400",
    axis: 0,
    rotate_duration: 3.3,
    orbit_duration: 0,
    icon: "sun.png",
    gordilocks: {
        inner_radius: 3900000,
        outer_radius: 7200000,
    },
    planets
}]


export default { stars, planets }
