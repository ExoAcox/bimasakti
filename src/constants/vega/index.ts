import { PlanetClass, StarClass, type Planet, type Star } from "@types"

const planets: Planet[] = [
    {
        id: "vega_b",
        type: "planet",
        class: PlanetClass.GasDwarf,
        parent: "vega",
        radius: 28500,
        distance: 9400000,
        color: "#3d68a2",
        axis: 3,
        orbit_duration: 2.43,
        rotate_duration: 2.43,
        texture: "vega_b.ktx2",
        cloud_texture: "vega_b_cloud.ktx2",
        cloud_opacity: 0.25,
        icon: "jupiter.png",
        satellites: []
    }
]

const stars: Star[] = [{
    id: "vega",
    type: "star",
    class: StarClass.Blue,
    parent: "",
    radius: 1643000,
    distance: 0,
    intensity: 4.5,
    color: "#d0e0ff",
    axis: 5,
    rotate_duration: 0.52,
    orbit_duration: 0,
    icon: "blue_star.png",
    protoplanetaryDisk: true,
    planets
}]

export default { stars, planets }
