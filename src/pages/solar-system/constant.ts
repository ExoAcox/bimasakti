export interface Satellite {
    id: string
    name: string
    radius: number
    distance: number
    color: string
    axis: number
    orbit_duration: number
    rotate_duration: number
    texture?: string
    overlay_textures?: string[]
}

export interface Planet extends Satellite {
    satellites: Satellite[]
    ring?: Ring
}

interface Ring {
    inner_radius: number
    outer_radius: number
    texture: string
}

export const planets: Planet[] = [
    {
        id: "mercury",
        name: "Mercury",
        radius: 2439.7,
        distance: 57910000,
        color: "gray",
        axis: 0.034,
        orbit_duration: 87.97,
        rotate_duration: 58.65,
        texture: "mercury.jpg",
        satellites: []
    },
    {
        id: "venus",
        name: "Venus",
        radius: 6051.8,
        distance: 108200000,
        color: "orange",
        axis: 177.3,
        orbit_duration: 224.7,
        rotate_duration: 243.02,
        texture: "venus.jpg",
        overlay_textures: ["venus_cloud.jpg"],
        satellites: []
    },
    {
        id: "earth",
        name: "Earth",
        radius: 6371,
        distance: 149000000,
        color: "blue",
        axis: 23.4,
        orbit_duration: 365.26,
        rotate_duration: 1.0,
        texture: "earth.jpg",
        overlay_textures: ["earth_cloud.jpg"],
        satellites: [
            {
                id: "moon",
                name: "Moon",
                radius: 1737,
                distance: 384400,
                color: "gray",
                axis: 1.54,
                orbit_duration: 27.32,
                rotate_duration: 27.32, // Tidally locked
                texture: "moon.jpg",
            }
        ]
    },
    {
        id: "mars",
        name: "Mars",
        radius: 3389.5,
        distance: 227900000,
        color: "red",
        axis: 25.19,
        orbit_duration: 686.98,
        rotate_duration: 1.03,
        texture: "mars.jpg",
        satellites: [
            {
                id: "phobos",
                name: "Phobos",
                radius: 11.1,
                distance: 9377,
                color: "brown",
                axis: 0.01,
                orbit_duration: 0.32,
                rotate_duration: 0.32, // Tidally locked
                texture: "phobos.webp",
            },
            {
                id: "deimos",
                name: "Deimos",
                radius: 6.2,
                distance: 23460,
                color: "tan",
                axis: 0.93,
                orbit_duration: 1.26,
                rotate_duration: 1.26, // Tidally locked
                texture: "deimos.webp",
            }
        ]
    },
    {
        id: "jupiter",
        name: "Jupiter",
        radius: 69911,
        distance: 778500000,
        color: "khaki",
        axis: 3.13,
        orbit_duration: 4332.59,
        rotate_duration: 0.41, // 9.9 hours
        texture: "jupiter.jpg",
        satellites: [
            {
                id: "io",
                name: "Io",
                radius: 1821.6,
                distance: 421700,
                color: "yellow",
                axis: 0.04,
                orbit_duration: 1.77,
                rotate_duration: 1.77, // Tidally locked
                texture: "io.webp",
            },
            {
                id: "europa",
                name: "Europa",
                radius: 1560.8,
                distance: 670900,
                color: "lightgray",
                axis: 0.47,
                orbit_duration: 3.55,
                rotate_duration: 3.55, // Tidally locked
                texture: "europa.webp",
            },
            {
                id: "ganymede",
                name: "Ganymede",
                radius: 2634.1,
                distance: 1070400,
                color: "gray",
                axis: 0.2,
                orbit_duration: 7.16,
                rotate_duration: 7.16, // Tidally locked
                texture: "ganymede.webp",
            },
            {
                id: "callisto",
                name: "Callisto",
                radius: 2410.3,
                distance: 1882700,
                color: "darkgray",
                axis: 0.28,
                orbit_duration: 16.69,
                rotate_duration: 16.69, // Tidally locked
                texture: "callisto.webp",
            },
            {
                id: "amalthea",
                name: "Amalthea",
                radius: 83.5,
                distance: 181400,
                color: "red",
                axis: 0.4,
                orbit_duration: 0.5,
                rotate_duration: 0.5, // Tidally locked
                texture: "amalthea.webp",
            },
            {
                id: "himalia",
                name: "Himalia",
                radius: 85,
                distance: 11461000,
                color: "gray",
                axis: 0,
                orbit_duration: 250.56,
                rotate_duration: 0.41
            },
            {
                id: "thebe",
                name: "Thebe",
                radius: 49.3,
                distance: 221900,
                color: "gray",
                axis: 0.2,
                orbit_duration: 0.68,
                rotate_duration: 0.68, // Tidally locked
                texture: "thebe.webp",
            },
            {
                id: "elara",
                name: "Elara",
                radius: 43,
                distance: 11741000,
                color: "gray",
                axis: 0,
                orbit_duration: 259.64,
                rotate_duration: 0.5, // Tidally locked
                texture: "elara.webp",
            }
        ]
    },
    {
        id: "saturn",
        name: "Saturn",
        radius: 58232,
        distance: 1434000000,
        color: "goldenrod",
        axis: 26.73,
        orbit_duration: 10759.22,
        rotate_duration: 0.44, // 10.6 hours
        texture: "saturn.jpg",
        ring: {
            inner_radius: 66900,
            outer_radius: 136770,
            texture: "saturn_ring.png"
        },
        satellites: [
            {
                id: "titan",
                name: "Titan",
                radius: 2574.7,
                distance: 1221870,
                color: "orange",
                axis: 0.3,
                orbit_duration: 15.95,
                rotate_duration: 15.95, // Tidally locked
                texture: "titan.webp",
            },
            {
                id: "rhea",
                name: "Rhea",
                radius: 763.8,
                distance: 527040,
                color: "lightgray",
                axis: 0.35,
                orbit_duration: 4.52,
                rotate_duration: 4.52, // Tidally locked
                texture: "rhea.webp",
            },
            {
                id: "enceladus",
                name: "Enceladus",
                radius: 252.1,
                distance: 237948,
                color: "white",
                axis: 0.02,
                orbit_duration: 1.37,
                rotate_duration: 1.37, // Tidally locked
                texture: "enceladus.webp",
            },
            {
                id: "mimas",
                name: "Mimas",
                radius: 198.2,
                distance: 185539,
                color: "gray",
                axis: 1.5,
                orbit_duration: 0.94,
                rotate_duration: 0.94, // Tidally locked
                texture: "mimas.webp",
            },
            {
                id: "tethys",
                name: "Tethys",
                radius: 531.1,
                distance: 294619,
                color: "lightgray",
                axis: 1.09,
                orbit_duration: 1.89,
                rotate_duration: 1.89, // Tidally locked
                texture: "tethys.webp",
            },
            {
                id: "dione",
                name: "Dione",
                radius: 561.4,
                distance: 377396,
                color: "gray",
                axis: 0.02,
                orbit_duration: 2.74,
                rotate_duration: 2.74, // Tidally locked
                texture: "dione.webp",
            },
            {
                id: "iapetus",
                name: "Iapetus",
                radius: 734.5,
                distance: 3560820,
                color: "darkgray",
                axis: 15.47,
                orbit_duration: 79.33,
                rotate_duration: 79.33, // Tidally locked
                texture: "iapetus.webp",
            }
        ]
    },
    {
        id: "uranus",
        name: "Uranus",
        radius: 25362,
        distance: 2871000000,
        color: "lightblue",
        axis: 97.77,
        orbit_duration: 30688.5,
        rotate_duration: 0.72, // 17.2 hours
        texture: "uranus.jpg",
        satellites: [
            {
                id: "titania",
                name: "Titania",
                radius: 788.4,
                distance: 435910,
                color: "gray",
                axis: 0.34,
                orbit_duration: 8.71,
                rotate_duration: 8.71, // Tidally locked
                texture: "titania.webp",
            },
            {
                id: "oberon",
                name: "Oberon",
                radius: 761.4,
                distance: 583520,
                color: "gray",
                axis: 0.06,
                orbit_duration: 13.46,
                rotate_duration: 13.46, // Tidally locked
                texture: "oberon.webp",
            },
            {
                id: "ariel",
                name: "Ariel",
                radius: 578.9,
                distance: 191020,
                color: "lightgray",
                axis: 0.04,
                orbit_duration: 2.52,
                rotate_duration: 2.52, // Tidally locked
                texture: "ariel.webp",
            },
            {
                id: "umbriel",
                name: "Umbriel",
                radius: 584.7,
                distance: 265970,
                color: "darkgray",
                axis: 0.13,
                orbit_duration: 4.14,
                rotate_duration: 4.14, // Tidally locked
                texture: "umbriel.webp",
            },
            {
                id: "miranda",
                name: "Miranda",
                radius: 235.8,
                distance: 129390,
                color: "gray",
                axis: 4.34,
                orbit_duration: 1.41,
                rotate_duration: 1.41, // Tidally locked
                texture: "miranda.webp",
            }
        ]
    },
    {
        id: "neptune",
        name: "Neptune",
        radius: 24622,
        distance: 4495000000,
        color: "blue",
        axis: 28.32,
        orbit_duration: 60182,
        rotate_duration: 0.67, // 16.1 hours
        texture: "neptune.jpg",
        satellites: [
            {
                id: "triton",
                name: "Triton",
                radius: 1353.4,
                distance: 354760,
                color: "lightgray",
                axis: 157.0,
                orbit_duration: 5.88,
                rotate_duration: 5.88, // Tidally locked
                texture: "triton.webp",
            },
            {
                id: "proteus",
                name: "Proteus",
                radius: 210,
                distance: 117647,
                color: "darkgray",
                axis: 0.08,
                orbit_duration: 1.12,
                rotate_duration: 1.12, // Tidally locked
                texture: "proteus.webp",
            },
            {
                id: "nereid",
                name: "Nereid",
                radius: 170,
                distance: 5513400,
                color: "gray",
                axis: 7.09,
                orbit_duration: 360.14,
                rotate_duration: 0.48, // 11.5 hours
                texture: "nereid.webp",
            }
        ]
    },
    {
        id: "pluto",
        name: "Pluto",
        radius: 1188.3,
        distance: 5906380000,
        color: "brown",
        axis: 122.5,
        orbit_duration: 90560,
        rotate_duration: 6.39, // Tidally locked with Charon
        texture: "pluto.webp",
        satellites: [
            {
                id: "charon",
                name: "Charon",
                radius: 606,
                distance: 19596,
                color: "gray",
                axis: 0,
                orbit_duration: 6.39,
                rotate_duration: 6.39 // Tidally locked
            },
            {
                id: "nix",
                name: "Nix",
                radius: 23,
                distance: 48694,
                color: "lightgray",
                axis: 0.13,
                orbit_duration: 24.85,
                rotate_duration: 1.83 // Chaotic / rapid
            },
            {
                id: "hydra",
                name: "Hydra",
                radius: 27,
                distance: 64738,
                color: "lightgray",
                axis: 0.24,
                orbit_duration: 38.2,
                rotate_duration: 0.43 // Chaotic / rapid
            },
            {
                id: "kerberos",
                name: "Kerberos",
                radius: 9,
                distance: 57783,
                color: "darkgray",
                axis: 0.39,
                orbit_duration: 32.17,
                rotate_duration: 5.33 // Chaotic
            },
            {
                id: "styx",
                name: "Styx",
                radius: 8,
                distance: 42656,
                color: "gray",
                axis: 0.81,
                orbit_duration: 20.16,
                rotate_duration: 1.35 // Chaotic
            }
        ]
    }
]

export const sun = {
    id: "sun",
    name: "Sun",
    radius: 695700,
    color: "yellow",
    axis: 7.25, // obliquity to the ecliptic in degrees
    rotate_duration: 25.05, // equator sidereal rotation period in days
    texture: "sun.jpg"
}

export const SCALE = 1000000
export const TIME_SCALE = 5