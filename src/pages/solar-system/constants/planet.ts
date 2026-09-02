import { artificialSatellite, satellites } from "./satellite"
import type { Planet } from "../types"




export const planets: Planet[] = [
    {
        id: "mercury",
        type: "planet",
        parent: "sun",
        radius: 2439.7,
        distance: 57910000,
        color: "gray",
        axis: 0.034,
        orbit_duration: 87.97,
        rotate_duration: 58.65,
        texture: "mercury.jpg",
        icon: "mercury.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "venus",
        type: "planet",
        parent: "sun",
        radius: 6051.8,
        distance: 108200000,
        color: "orange",
        axis: 177.3,
        orbit_duration: 224.7,
        rotate_duration: 243.02,
        texture: "venus.jpg",
        icon: "venus.png",
        overlay_textures: ["venus_cloud.jpg"],
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "earth",
        type: "planet",
        parent: "sun",
        radius: 6371,
        distance: 149000000,
        color: "blue",
        axis: 23.4,
        orbit_duration: 365.26,
        rotate_duration: 1.0,
        texture: "earth.jpg",
        icon: "earth.png",
        overlay_textures: ["earth_cloud.jpg"],
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        },
        get artificial_satellites() {
            return artificialSatellite.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "mars",
        type: "planet",
        parent: "sun",
        radius: 3389.5,
        distance: 227900000,
        color: "red",
        axis: 25.19,
        orbit_duration: 686.98,
        rotate_duration: 1.03,
        texture: "mars.jpg",
        icon: "mars.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "jupiter",
        type: "planet",
        parent: "sun",
        radius: 69911,
        distance: 778500000,
        color: "khaki",
        axis: 3.13,
        orbit_duration: 4332.59,
        rotate_duration: 0.41, // 9.9 hours
        texture: "jupiter.jpg",
        icon: "jupiter.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "saturn",
        type: "planet",
        parent: "sun",
        radius: 58232,
        distance: 1434000000,
        color: "goldenrod",
        axis: 26.73,
        orbit_duration: 10759.22,
        rotate_duration: 0.44, // 10.6 hours
        texture: "saturn.jpg",
        icon: "saturn.png",
        ring: {
            inner_radius: 66900,
            outer_radius: 136770,
            texture: "saturn_ring.png"
        },
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "uranus",
        type: "planet",
        parent: "sun",
        radius: 25362,
        distance: 2871000000,
        color: "lightblue",
        axis: 97.77,
        orbit_duration: 30688.5,
        rotate_duration: 0.72, // 17.2 hours
        texture: "uranus.jpg",
        icon: "uranus.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "neptune",
        type: "planet",
        parent: "sun",
        radius: 24622,
        distance: 4495000000,
        color: "blue",
        axis: 28.32,
        orbit_duration: 60182,
        rotate_duration: 0.67, // 16.1 hours
        texture: "neptune.jpg",
        icon: "neptune.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    }
]

export const dwarfPlanets: Planet[] = [
    {
        id: "pluto",
        type: "planet",
        parent: "sun",
        radius: 1188.3,
        distance: 5906380000,
        color: "brown",
        axis: 122.5,
        orbit_duration: 90560,
        rotate_duration: 6.39, // Tidally locked with Charon
        texture: "pluto.webp",
        icon: "pluto.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "ceres",
        type: "planet",
        parent: "sun",
        radius: 473,
        distance: 413700000,
        color: "gray",
        axis: 4,
        orbit_duration: 1682,
        rotate_duration: 0.378,
        texture: "ceres.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "haumea",
        type: "planet",
        parent: "sun",
        radius: 798,
        distance: 6450000000,
        color: "gray",
        axis: 28,
        orbit_duration: 104210,
        rotate_duration: 0.163,
        texture: "haumea.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "makemake",
        type: "planet",
        parent: "sun",
        radius: 715,
        distance: 6850000000,
        color: "brown",
        axis: 29,
        orbit_duration: 112897,
        rotate_duration: 0.937,
        texture: "makemake.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "eris",
        type: "planet",
        parent: "sun",
        radius: 1163,
        distance: 10125000000,
        color: "white",
        axis: 44,
        orbit_duration: 203830,
        rotate_duration: 1.08,
        texture: "eris.jpg",
        icon: "satellite.png",
        satellites: []
    }
]

export const planets_ac: Planet[] = [
    {
        id: "alpha_centauri_a_b",
        type: "planet",
        parent: "alpha_centauri_a",
        radius: 7000,
        distance: 164500000,
        color: "blue",
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
        parent: "proxima_centauri",
        radius: 6800,
        distance: 7480000,
        color: "red",
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
        parent: "proxima_centauri",
        radius: 15000,
        distance: 222800000,
        color: "lightblue",
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
        parent: "proxima_centauri",
        radius: 5100,
        distance: 4320000,
        color: "gray",
        axis: 0,
        orbit_duration: 5.12,
        rotate_duration: 5.12,
        texture: "proxima_centauri_d.png",
        icon: "mercury.png",
        satellites: []
    },
]