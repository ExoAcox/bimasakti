import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "k2-72_b",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "k2-72",
        radius: 6880,
        distance: 5980000, // ~0.040 AU
        color: "#73382f",
        axis: 0,
        orbit_duration: 5.58,
        rotate_duration: 5.58,
        texture: "k2-72_b.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "k2-72_d",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "k2-72",
        radius: 6435,
        distance: 7480000, // ~0.050 AU
        color: "#889175",
        axis: 0,
        orbit_duration: 7.76,
        rotate_duration: 7.76,
        texture: "k2-72_d.ktx2",
        cloud_texture: "k2-72_d_cloud.ktx2",
        cloud_texture_hd: "k2-72_d_cloud_hd.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "k2-72_c",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "k2-72",
        radius: 7390,
        distance: 11670000, // ~0.078 AU
        color: "#7a6655",
        axis: 0,
        orbit_duration: 15.19,
        rotate_duration: 15.19,
        texture: "k2-72_c.ktx2",
        cloud_texture: "k2-72_c_cloud.ktx2",
        cloud_texture_hd: "k2-72_c_cloud_hd.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "k2-72_e",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "k2-72",
        radius: 8220,
        distance: 15860000, // ~0.106 AU (habitable zone)
        color: "#568073",
        axis: 0,
        orbit_duration: 24.16,
        rotate_duration: 24.16,
        texture: "k2-72_e.ktx2",
        cloud_texture: "earth_cloud.ktx2",
        cloud_texture_hd: "earth_cloud_hd.ktx2",
        icon: "earth.png",
        satellites: []
    }
]
