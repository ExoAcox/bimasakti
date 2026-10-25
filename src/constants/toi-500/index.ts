import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "toi-500",
    type: "star",
    class: StarClass.Orange,
    parent: "",
    radius: 473000,
    distance: 0,
    intensity: 3.2,
    color: "#f59e42",
    axis: 0,
    rotate_duration: 42,
    orbit_duration: 0,
    icon: "yellow_star.png",
    gordilocks: {
        inner_radius: 56000000,
        outer_radius: 82000000,
    },
    planets
}]

export default { stars, planets }
