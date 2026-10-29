import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "wasp-47_e",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "wasp-47",
        radius: 11530,
        distance: 2590000,
        color: "#e3a0af",
        axis: 2,
        orbit_duration: 0.79,
        rotate_duration: 0.79,
        texture: "wasp-47_e.ktx2",
        icon: "mars.png",
        satellites: []
    },
    {
        id: "wasp-47_b",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "wasp-47",
        radius: 80600,
        distance: 7760000,
        color: "#467eb3",
        axis: 5,
        orbit_duration: 4.16,
        rotate_duration: 4.16,
        texture: "wasp-47_b.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "wasp-47_d",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "wasp-47",
        radius: 22760,
        distance: 13160000,
        color: "#3b2314",
        axis: 8,
        orbit_duration: 9.03,
        rotate_duration: 9.03,
        texture: "wasp-47_d.ktx2",
        icon: "jupiter.png",
        satellites: []
    },
    {
        id: "wasp-47_c",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "wasp-47",
        radius: 71500,
        distance: 210900000,
        color: "#c1cdd5",
        axis: 12,
        orbit_duration: 588.5,
        rotate_duration: 588.5,
        texture: "wasp-47_c.ktx2",
        icon: "saturn.png",
        ring: {
            inner_radius: 95000,
            outer_radius: 175000,
            texture: "wasp-47_c_ring.png"
        },
        satellites: []
    }
]
