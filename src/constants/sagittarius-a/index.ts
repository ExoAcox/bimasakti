import { type Blackhole } from "@types"
import { stars } from "./star"

const blackholes: Blackhole[] = [{
    id: "sagittarius_a",
    type: "blackhole",
    parent: "",
    radius: 12000000,
    distance: 0,
    color: "#000000",
    axis: 0,
    rotate_duration: Infinity,
    orbit_duration: 0,
    icon: "blackhole.png",
    model: "sagittarius_a.glb",
    stars
}]

export default { blackholes }