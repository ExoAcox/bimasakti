import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "janssen",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "copernicus",
        radius: 11947,
        distance: 2310000,
        color: "#bf4f26",
        axis: 3,
        orbit_duration: 0.7365,
        rotate_duration: 0.7365,
        texture: "janssen.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "galileo",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "copernicus",
        radius: 58000,
        distance: 17200000,
        color: "#4e859c",
        axis: 10,
        orbit_duration: 14.65,
        rotate_duration: 14.65,
        texture: "galileo.ktx2",
        texture_hd: "galileo_hd.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "brahe",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "copernicus",
        radius: 32000,
        distance: 36000000,
        color: "#c89a64",
        axis: 8,
        orbit_duration: 44.34,
        rotate_duration: 44.34,
        texture: "brahe.ktx2",
        texture_hd: "brahe_hd.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "harriot",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "copernicus",
        radius: 35000,
        distance: 117000000,
        color: "#7ea494",
        axis: 14,
        orbit_duration: 260.7,
        rotate_duration: 260.7,
        texture: "harriot.ktx2",
        texture_hd: "harriot_hd.ktx2",
        icon: "jupiter.png",
        satellites: []
    },
    {
        id: "lipperhey",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "copernicus",
        radius: 74000,
        distance: 890000000,
        color: "#a97d58",
        axis: 22,
        orbit_duration: 5218,
        rotate_duration: 0.45,
        texture: "lipperhey.ktx2",
        texture_hd: "lipperhey_hd.ktx2",
        icon: "saturn.png",
        ring: {
            inner_radius: 90000,
            outer_radius: 180000,
            texture: "lipperhey_ring.ktx2"
        },
        satellites: []
    }
]
