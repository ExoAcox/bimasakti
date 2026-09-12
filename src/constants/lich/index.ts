import { StarClass, type Star } from "@types"
import { planets } from "./planet"

const stars: Star[] = [{
    id: "lich",
    type: "star",
    class: StarClass.Neutron,
    parent: "",
    radius: 15000,
    distance: 0,
    intensity: 5,
    color: "#00e5ff",
    axis: -4.3,
    rotate_duration: 0.00622,
    orbit_duration: 0,
    icon: "sun.png",
    gordilocks: {
        inner_radius: 40000000,
        outer_radius: 75000000,
    },
    planets
}]

export default { stars, planets }
