import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "toi-700_b",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "toi-700",
        radius: 5824,
        distance: 10130000,
        color: "#c49a7a",
        axis: 5,
        orbit_duration: 9.98,
        rotate_duration: 9.98,
        texture: "toi-700_b.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "toi-700_c",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "toi-700",
        radius: 16565,
        distance: 13900000,
        color: "#5d93b3",
        axis: 10,
        orbit_duration: 16.05,
        rotate_duration: 16.05,
        texture: "toi-700_c.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "toi-700_e",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "toi-700",
        radius: 6072,
        distance: 20050000,
        color: "#7fa699",
        axis: -12,
        orbit_duration: 27.81,
        rotate_duration: 27.81,
        texture: "toi-700_e.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "toi-700_d",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "toi-700",
        radius: 6836,
        distance: 24430000,
        rotation: [-90, 0, 0],
        color: "#4b7a94",
        axis: -8,
        orbit_duration: 37.42,
        rotate_duration: 37.42,
        texture: "toi-700_d.ktx2",
        texture_hd: "toi-700_d_hd.ktx2",
        cloud_texture: "toi-700_d_cloud.ktx2",
        icon: "earth.png",
        satellites: []
    },

]
