import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "hd_110067",
    type: "star",
    class: StarClass.Orange,
    parent: "",
    radius: 555000,
    distance: 0,
    intensity: 3.5,
    color: "#ffaa44",
    axis: 0,
    rotate_duration: 30.5,
    orbit_duration: 0,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 99000000,
        outer_radius: 174000000,
    },
    planets
}]

export default { stars, planets }
