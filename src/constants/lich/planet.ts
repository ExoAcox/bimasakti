import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "draugr",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "lich",
        radius: 1800,
        distance: 28400000,
        color: "#8c7b70",
        axis: 8,
        orbit_duration: 25.26,
        rotate_duration: 25.26,
        texture: "trappist-1_b.png",
        icon: "earth.png",
        satellites: []
    },
    {
        id: "poltergeist",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "lich",
        radius: 9200,
        distance: 53800000,
        color: "#4a6b82",
        axis: -15,
        orbit_duration: 66.34,
        rotate_duration: 66.34,
        texture: "trappist-1_c.png",
        icon: "earth.png",
        satellites: []
    },
    {
        id: "phobetor",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "lich",
        radius: 8900,
        distance: 70300000,
        color: "#9966cc",
        axis: 12,
        orbit_duration: 98.22,
        rotate_duration: 98.22,
        texture: "trappist-1_d.png",
        icon: "earth.png",
        satellites: []
    }
]
