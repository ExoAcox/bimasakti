import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "rho_coronae_borealis",
    type: "star",
    class: StarClass.Yellow,
    parent: "",
    radius: 908000,
    distance: 0,
    intensity: 3.5,
    color: "#ffe082",
    axis: 0,
    rotate_duration: 17.7,
    orbit_duration: 0,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 185000000,
        outer_radius: 267000000,
    },
    planets
}]

export default { stars, planets }
