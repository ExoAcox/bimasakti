import type { ArtificialSatellite, Satellite } from "@types"

export const satellites: Satellite[] = [
    // Earth
    {
        id: "moon",
        type: "satellite",
        parent: "earth",
        radius: 1737,
        distance: 384400,
        color: "#b0b0b0",
        axis: 1.54,
        orbit_duration: 27.32,
        rotate_duration: 27.32, // Tidally locked
        texture: "moon.jpg",
        icon: "satellite.png"
    },
    // Mars
    {
        id: "phobos",
        type: "satellite",
        parent: "mars",
        radius: 11.1,
        distance: 9377,
        color: "#8d7768",
        axis: 0.01,
        orbit_duration: 0.32,
        rotate_duration: 0.32, // Tidally locked
        texture: "phobos.webp",
        model: "phobos.ply",
        icon: "satellite.png"
    },
    {
        id: "deimos",
        type: "satellite",
        parent: "mars",
        radius: 6.2,
        distance: 23460,
        color: "#b8a088",
        axis: 0.93,
        orbit_duration: 1.26,
        rotate_duration: 1.26, // Tidally locked
        texture: "deimos.webp",
        model: "deimos.ply",
        icon: "satellite.png"
    },
    // Jupiter
    {
        id: "amalthea",
        type: "satellite",
        parent: "jupiter",
        radius: 83.5,
        distance: 181400,
        color: "#c85244",
        axis: 0.4,
        orbit_duration: 0.5,
        rotate_duration: 0.5, // Tidally locked
        texture: "amalthea.webp",
        icon: "satellite.png"
    },
    {
        id: "thebe",
        type: "satellite",
        parent: "jupiter",
        radius: 49.3,
        distance: 221900,
        color: "#8a8a8a",
        axis: 0.2,
        orbit_duration: 0.68,
        rotate_duration: 0.68, // Tidally locked
        texture: "thebe.webp",
        icon: "satellite.png"
    },
    {
        id: "io",
        type: "satellite",
        parent: "jupiter",
        radius: 1821.6,
        distance: 421700,
        color: "#e5c158",
        axis: 0.04,
        orbit_duration: 1.77,
        rotate_duration: 1.77, // Tidally locked
        texture: "io.webp",
        icon: "satellite.png"
    },
    {
        id: "europa",
        type: "satellite",
        parent: "jupiter",
        radius: 1560.8,
        distance: 670900,
        color: "#d6d6d6",
        axis: 0.47,
        orbit_duration: 3.55,
        rotate_duration: 3.55, // Tidally locked
        texture: "europa.webp",
        icon: "satellite.png"
    },
    {
        id: "ganymede",
        type: "satellite",
        parent: "jupiter",
        radius: 2634.1,
        distance: 1070400,
        color: "#969490",
        axis: 0.2,
        orbit_duration: 7.16,
        rotate_duration: 7.16, // Tidally locked
        texture: "ganymede.webp",
        icon: "satellite.png"
    },
    {
        id: "callisto",
        type: "satellite",
        parent: "jupiter",
        radius: 2410.3,
        distance: 1882700,
        color: "#6e6b66",
        axis: 0.28,
        orbit_duration: 16.69,
        rotate_duration: 16.69, // Tidally locked
        texture: "callisto.webp",
        icon: "satellite.png"
    },
    {
        id: "himalia",
        type: "satellite",
        parent: "jupiter",
        radius: 85,
        distance: 11461000,
        color: "#8a8a8a",
        axis: 0,
        orbit_duration: 250.56,
        rotate_duration: 0.41,
        icon: "satellite.png"
    },
    {
        id: "elara",
        type: "satellite",
        parent: "jupiter",
        radius: 43,
        distance: 11741000,
        color: "#8a8a8a",
        axis: 0,
        orbit_duration: 259.64,
        rotate_duration: 0.5, // Tidally locked
        texture: "elara.webp",
        icon: "satellite.png"
    },
    // Saturn
    {
        id: "mimas",
        type: "satellite",
        parent: "saturn",
        radius: 198.2,
        distance: 185539,
        color: "#b5b5b5",
        axis: 1.5,
        orbit_duration: 0.94,
        rotate_duration: 0.94, // Tidally locked
        texture: "mimas.webp",
        icon: "satellite.png"
    },
    {
        id: "enceladus",
        type: "satellite",
        parent: "saturn",
        radius: 252.1,
        distance: 237948,
        color: "#f0f4f8",
        axis: 0.02,
        orbit_duration: 1.37,
        rotate_duration: 1.37, // Tidally locked
        texture: "enceladus.webp",
        icon: "satellite.png"
    },
    {
        id: "tethys",
        type: "satellite",
        parent: "saturn",
        radius: 531.1,
        distance: 294619,
        color: "#cccccc",
        axis: 1.09,
        orbit_duration: 1.89,
        rotate_duration: 1.89, // Tidally locked
        texture: "tethys.webp",
        icon: "satellite.png"
    },
    {
        id: "dione",
        type: "satellite",
        parent: "saturn",
        radius: 561.4,
        distance: 377396,
        color: "#bbbbbb",
        axis: 0.02,
        orbit_duration: 2.74,
        rotate_duration: 2.74, // Tidally locked
        texture: "dione.webp",
        icon: "satellite.png"
    },
    {
        id: "rhea",
        type: "satellite",
        parent: "saturn",
        radius: 763.8,
        distance: 527040,
        color: "#c4c4c4",
        axis: 0.35,
        orbit_duration: 4.52,
        rotate_duration: 4.52, // Tidally locked
        texture: "rhea.webp",
        icon: "satellite.png"
    },
    {
        id: "titan",
        type: "satellite",
        parent: "saturn",
        radius: 2574.7,
        distance: 1221870,
        color: "#e0a96d",
        axis: 0.3,
        orbit_duration: 15.95,
        rotate_duration: 15.95, // Tidally locked
        texture: "titan.webp",
        icon: "satellite.png"
    },
    {
        id: "iapetus",
        type: "satellite",
        parent: "saturn",
        radius: 734.5,
        distance: 3560820,
        color: "#777570",
        axis: 15.47,
        orbit_duration: 79.33,
        rotate_duration: 79.33, // Tidally locked
        texture: "iapetus.webp",
        icon: "satellite.png"
    },
    // Uranus
    {
        id: "miranda",
        type: "satellite",
        parent: "uranus",
        radius: 235.8,
        distance: 129390,
        color: "#a5a5a5",
        axis: 4.34,
        orbit_duration: 1.41,
        rotate_duration: 1.41, // Tidally locked
        texture: "miranda.webp",
        icon: "satellite.png"
    },
    {
        id: "ariel",
        type: "satellite",
        parent: "uranus",
        radius: 578.9,
        distance: 191020,
        color: "#c8c8c8",
        axis: 0.04,
        orbit_duration: 2.52,
        rotate_duration: 2.52, // Tidally locked
        texture: "ariel.webp",
        icon: "satellite.png"
    },
    {
        id: "umbriel",
        type: "satellite",
        parent: "uranus",
        radius: 584.7,
        distance: 265970,
        color: "#686868",
        axis: 0.13,
        orbit_duration: 4.14,
        rotate_duration: 4.14, // Tidally locked
        texture: "umbriel.webp",
        icon: "satellite.png"
    },
    {
        id: "titania",
        type: "satellite",
        parent: "uranus",
        radius: 788.4,
        distance: 435910,
        color: "#adadad",
        axis: 0.34,
        orbit_duration: 8.71,
        rotate_duration: 8.71, // Tidally locked
        texture: "titania.webp",
        icon: "satellite.png"
    },
    {
        id: "oberon",
        type: "satellite",
        parent: "uranus",
        radius: 761.4,
        distance: 583520,
        color: "#9e9e9e",
        axis: 0.06,
        orbit_duration: 13.46,
        rotate_duration: 13.46, // Tidally locked
        texture: "oberon.webp",
        icon: "satellite.png"
    },
    // Neptune
    {
        id: "proteus",
        type: "satellite",
        parent: "neptune",
        radius: 210,
        distance: 117647,
        color: "#636363",
        axis: 0.08,
        orbit_duration: 1.12,
        rotate_duration: 1.12, // Tidally locked
        texture: "proteus.webp",
        icon: "satellite.png"
    },
    {
        id: "triton",
        type: "satellite",
        parent: "neptune",
        radius: 1353.4,
        distance: 354760,
        color: "#d0d8d8",
        axis: 157.0,
        orbit_duration: 5.88,
        rotate_duration: 5.88, // Tidally locked
        texture: "triton.webp",
        icon: "satellite.png"
    },
    {
        id: "nereid",
        type: "satellite",
        parent: "neptune",
        radius: 170,
        distance: 5513400,
        color: "#888888",
        axis: 7.09,
        orbit_duration: 360.14,
        rotate_duration: 0.48, // 11.5 hours
        texture: "nereid.webp",
        icon: "satellite.png"
    },
    // Pluto
    {
        id: "charon",
        type: "satellite",
        parent: "pluto",
        radius: 606,
        distance: 19596,
        color: "#b0b0b0",
        axis: 0,
        orbit_duration: 6.39,
        rotate_duration: 6.39, // Tidally locked
        icon: "satellite.png"
    },
    // {
    //     id: "styx",
    //     type: "satellite",
    //     parent: "pluto",
    //     radius: 8,
    //     distance: 42656,
    //     color: "#8a8a8a",
    //     axis: 0.81,
    //     orbit_duration: 20.16,
    //     rotate_duration: 1.35, // Chaotic
    //     icon: "satellite.png"
    // },
    // {
    //     id: "nix",
    //     type: "satellite",
    //     parent: "pluto",
    //     radius: 23,
    //     distance: 48694,
    //     color: "#d6d6d6",
    //     axis: 0.13,
    //     orbit_duration: 24.85,
    //     rotate_duration: 1.83, // Chaotic / rapid
    //     icon: "satellite.png"
    // },
    // {
    //     id: "kerberos",
    //     type: "satellite",
    //     parent: "pluto",
    //     radius: 9,
    //     distance: 57783,
    //     color: "#686868",
    //     axis: 0.39,
    //     orbit_duration: 32.17,
    //     rotate_duration: 5.33, // Chaotic
    //     icon: "satellite.png"
    // },
    // {
    //     id: "hydra",
    //     type: "satellite",
    //     parent: "pluto",
    //     radius: 27,
    //     distance: 64738,
    //     color: "#d6d6d6",
    //     axis: 0.24,
    //     orbit_duration: 38.2,
    //     rotate_duration: 0.43, // Chaotic / rapid
    //     icon: "satellite.png"
    // }
]

export const artificial_satellites: ArtificialSatellite[] = [
    {
        id: "iss",
        type: "artificial_satellite",
        parent: "earth",
        radius: 0.0545, // ~54.5 meters radius in km
        distance: 6779, // Distance from Earth center in km (6371 km Earth radius + ~408 km altitude)
        color: "#c0c0c0",
        axis: 51.64, // Orbital inclination in degrees
        orbit_duration: 0.0645, // ~92.9 minutes orbital period in days
        rotate_duration: 0.0645, // Earth-facing rotational alignment in days
        model: "/solar-system/models/iss.glb",
        icon: "artificial_satellite.png"
    }
]
