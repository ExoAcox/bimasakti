import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "corot-7_b",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "corot-7",
        radius: 10060,
        distance: 2570000, // ~0.0172 AU (lava super-Earth)
        color: "#c84a28",
        axis: 0,
        orbit_duration: 0.85,
        rotate_duration: 0.85,
        texture: "corot-7_b.ktx2",
        cloud_texture: "corot-7_b_cloud.ktx2",
        icon: "venus.png",
        satellites: []
    },
    {
        id: "corot-7_c",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "corot-7",
        radius: 12000,
        distance: 6880000, // ~0.046 AU
        color: "#5c93a8",
        axis: 0,
        orbit_duration: 3.70,
        rotate_duration: 3.70,
        texture: "corot-7_c.ktx2",
        cloud_texture: "corot-7_c_cloud.ktx2",
        icon: "mars.png",
        satellites: []
    },
    {
        id: "corot-7_d",
        type: "planet",
        class: PlanetClass.GasDwarf,
        parent: "corot-7",
        radius: 13400,
        distance: 11970000, // ~0.08 AU
        color: "#7a9a60",
        axis: 0,
        orbit_duration: 8.97,
        rotate_duration: 4.5,
        texture: "corot-7_d.ktx2",
        icon: "venus.png",
        satellites: []
    }
]
