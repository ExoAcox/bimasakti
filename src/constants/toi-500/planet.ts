import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "toi-500_b",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "toi-500",
        radius: 7430,
        distance: 1780000,
        color: "#cf6a32",
        axis: 3,
        orbit_duration: 0.55,
        rotate_duration: 0.55,
        texture: "toi-500_b.ktx2",
        cloud_texture: "toi-500_b_cloud.ktx2",
        cloud_opacity: 0.9,
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "toi-500_c",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "toi-500",
        radius: 13380,
        distance: 9390000,
        color: "#528ca8",
        axis: -4,
        orbit_duration: 6.64,
        rotate_duration: 6.64,
        texture: "toi-500_c.ktx2",
        icon: "venus.png",
        satellites: []
    },
    {
        id: "toi-500_d",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "toi-500",
        radius: 40520,
        distance: 23490000,
        color: "#a67848",
        axis: 8,
        orbit_duration: 26.23,
        rotate_duration: 26.23,
        texture: "toi-500_d.ktx2",
        icon: "jupiter.png",
        satellites: []
    },
    {
        id: "toi-500_e",
        type: "planet",
        class: PlanetClass.GasDwarf,
        parent: "toi-500",
        radius: 25420,
        distance: 41300000,
        color: "#4a7a8c",
        axis: -6,
        orbit_duration: 61.3,
        rotate_duration: 61.3,
        texture: "toi-500_e.ktx2",
        icon: "jupiter.png",
        satellites: []
    }
]
