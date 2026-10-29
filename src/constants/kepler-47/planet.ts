import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "kepler-47_b",
        type: "planet",
        class: PlanetClass.GasDwarf,
        parent: "kepler-47_a",
        radius: 19300,
        distance: 44040000, // ~0.2956 AU
        color: "#5fa8d3",
        axis: 5.0,
        orbit_duration: 49.51,
        rotate_duration: 2.1,
        texture: "kepler-47_b.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "kepler-47_d",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "kepler-47_a",
        radius: 44800,
        distance: 104180000, // ~0.6992 AU
        color: "#c99a6b",
        axis: 8.0,
        orbit_duration: 187.35,
        rotate_duration: 1.5,
        texture: "kepler-47_d.ktx2",
        icon: "venus.png",
        satellites: []
    },
    {
        id: "kepler-47_c",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "kepler-47_a",
        radius: 29360,
        distance: 147360000, // ~0.989 AU (habitable zone)
        color: "#3b82a6",
        axis: 12.0,
        orbit_duration: 303.16,
        rotate_duration: 1.8,
        texture: "kepler-47_c.ktx2",
        icon: "venus.png",
        satellites: []
    }
]
