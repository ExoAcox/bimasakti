import { PlanetClass, type Planet } from "@types"
import { satellites } from "./satellite"

export const planets: Planet[] = [
    {
        id: "dulcinea",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "cervantes",
        radius: 17000,
        distance: 13600000,
        color: "#c4936d",
        axis: 4,
        orbit_duration: 9.64,
        rotate_duration: 9.64,
        texture: "dulcinea.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "rocinante",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "cervantes",
        radius: 68000,
        distance: 137800000,
        color: "#7091a4",
        axis: 9,
        orbit_duration: 310.55,
        rotate_duration: 0.42,
        texture: "rocinante.ktx2",
        icon: "neptune.png",
        childCount: 1,
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "quijote",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "cervantes",
        radius: 78000,
        distance: 224000000,
        color: "#d4a373",
        axis: 14,
        orbit_duration: 643.25,
        rotate_duration: 0.46,
        texture: "quijote.ktx2",
        icon: "neptune.png",
        childCount: 1,
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    },
    {
        id: "sancho",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "cervantes",
        radius: 74000,
        distance: 783000000,
        color: "#c2b092",
        axis: 24,
        orbit_duration: 4205.8,
        rotate_duration: 0.44,
        texture: "sancho.ktx2",
        icon: "saturn.png",
        ring: {
            inner_radius: 120120,
            outer_radius: 182947,
            texture: "sancho_ring.png"
        },
        childCount: 1,
        get satellites() {
            return satellites.filter((satellite) => satellite.parent === this.id)
        }
    }
]
