import { artificial_satellites, satellites } from "./satellite"
import { PlanetClass, type Planet } from "@types"




export const planets: Planet[] = [
    {
        id: "mercury",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "sun",
        radius: 2439.7,
        distance: 57910000,
        color: "#97979f",
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
        class: PlanetClass.Terrestrial,
        parent: "sun",
        radius: 6051.8,
        distance: 108200000,
        color: "#e3bb76",
        axis: 177.3,
        orbit_duration: 224.7,
        rotate_duration: 243.02,
        texture: "venus.jpg",
        icon: "venus.png",
        cloud_texture: "venus_cloud.jpg",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "earth",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "sun",
        radius: 6371,
        distance: 149000000,
        color: "#2b82c5",
        axis: 23.4,
        orbit_duration: 365.26,
        rotate_duration: 1.0,
        texture: "earth.jpg",
        icon: "earth.png",
        cloud_texture: "earth_cloud.jpg",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        },
        get artificial_satellites() {
            return artificial_satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "mars",
        type: "planet",
        class: PlanetClass.Terrestrial,
        parent: "sun",
        radius: 3389.5,
        distance: 227900000,
        color: "#c1440e",
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
        class: PlanetClass.GasGiant,
        parent: "sun",
        radius: 69911,
        distance: 778500000,
        color: "#d4a373",
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
        class: PlanetClass.GasGiant,
        parent: "sun",
        radius: 58232,
        distance: 1434000000,
        color: "#e2bf7d",
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
        class: PlanetClass.IceGiant,
        parent: "sun",
        radius: 25362,
        distance: 2871000000,
        color: "#7de3f4",
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
        class: PlanetClass.IceGiant,
        parent: "sun",
        radius: 24622,
        distance: 4495000000,
        color: "#3b72ec",
        axis: 28.32,
        orbit_duration: 60182,
        rotate_duration: 0.67, // 16.1 hours
        texture: "neptune.jpg",
        icon: "neptune.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "pluto",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 1188.3,
        distance: 5906380000,
        color: "#a99787",
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
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 473,
        distance: 413700000,
        color: "#8e8d8a",
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
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 798,
        distance: 6450000000,
        color: "#c2c7cb",
        axis: 28,
        orbit_duration: 104210,
        rotate_duration: 0.163,
        texture: "haumea.jpg",
        model: "haumea.ply",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "makemake",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 715,
        distance: 6850000000,
        color: "#b56950",
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
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 1163,
        distance: 10125000000,
        color: "#e5e8eb",
        axis: 44,
        orbit_duration: 203830,
        rotate_duration: 1.08,
        texture: "eris.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "orcus",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 455,
        distance: 5900000000,
        color: "#96999c",
        axis: 20,
        orbit_duration: 90250,
        rotate_duration: 0.549,
        texture: "orcus.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "salacia",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 423,
        distance: 6310000000,
        color: "#4a4947",
        axis: 18,
        orbit_duration: 99640,
        rotate_duration: 0.25,
        texture: "salacia.jpg",
        icon: "satellite.png",
        satellites: []
    },
    {
        id: "quaoar",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 560,
        distance: 6470000000,
        color: "#8c8780",
        axis: 14,
        orbit_duration: 104380,
        rotate_duration: 0.736,
        texture: "quaoar.jpg",
        icon: "satellite.png",
        ring: {
            inner_radius: 4050,
            outer_radius: 4250,
            texture: "saturn_ring.png"
        },
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "gonggong",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 615,
        distance: 10070000000,
        color: "#c85a4b",
        axis: 30.7,
        orbit_duration: 202300,
        rotate_duration: 0.933,
        texture: "gonggong.jpg",
        icon: "satellite.png",
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "sedna",
        type: "planet",
        class: PlanetClass.Dwarf,
        parent: "sun",
        radius: 498,
        distance: 11370000000,
        longest_distance: 140170000000,
        color: "#b84d38",
        axis: 26,
        orbit_duration: 4161000,
        rotate_duration: 0.427,
        texture: "sedna.jpg",
        icon: "satellite.png",
        satellites: []
    },
]