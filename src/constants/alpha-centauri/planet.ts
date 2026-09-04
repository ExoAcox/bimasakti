import { PlanetClass, type Planet } from "@types";


export const planets: Planet[] = [
    {
        id: "alpha_centauri_a_b",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "alpha_centauri_a",
        radius: 7000,
        distance: 164500000,
        color: "#c1440e",
        axis: 23.4,
        orbit_duration: 360,
        rotate_duration: 1.0,
        texture: "alpha_centauri_a_b.png",
        icon: "mars.png",
        satellites: []
    },
    {
        id: "proxima_centauri_b",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "proxima_centauri",
        radius: 6800,
        distance: 7480000,
        color: "#7de3f4",
        axis: 0,
        orbit_duration: 11.186,
        rotate_duration: 11.186,
        texture: "proxima_centauri_b.png",
        overlay_textures: ["earth_cloud.jpg"],
        icon: "earth.png",
        satellites: []
    },
    {
        id: "proxima_centauri_c",
        type: "planet",
        class: PlanetClass.IceGiant,
        parent: "proxima_centauri",
        radius: 15000,
        distance: 222800000,
        color: "#2b82c5",
        axis: 15,
        orbit_duration: 1928,
        rotate_duration: 1.2,
        texture: "proxima_centauri_c.png",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "proxima_centauri_d",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "proxima_centauri",
        radius: 5100,
        distance: 4320000,
        color: "#97979f",
        axis: 0,
        orbit_duration: 5.12,
        rotate_duration: 5.12,
        texture: "proxima_centauri_d.png",
        icon: "mercury.png",
        satellites: []
    },
]