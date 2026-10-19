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
        texture: "draugr.ktx2",
        texture_hd: "draugr_hd.ktx2",
        icon: "mercury.png",
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
        texture: "poltergeist.ktx2",
        texture_hd: "poltergeist_hd.ktx2",
        cloud_texture: "poltergeist_cloud.ktx2",
        icon: "venus.png",
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
        texture: "phobetor.ktx2",
        texture_hd: "phobetor_hd.ktx2",
        icon: "mercury.png",
        satellites: []
    }
]
