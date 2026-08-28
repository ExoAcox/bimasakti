interface Object {
    id: string
    type: "star" | "planet" | "satellite" | "artificial_satellite"
    parent: string
    radius: number
    distance: number
    color: string
    axis: number
    orbit_duration: number
    rotate_duration: number
    texture?: string
    icon?: string
    overlay_textures?: string[]
}

interface Star extends Omit<Object, "distance" | "orbit_duration"> {
    type: "star",
}

export interface Satellite extends Object {
    type: "satellite",
}

export interface ArtificialSatellite extends Object {
    type: "artificial_satellite",
    model: string
}

export interface Planet extends Object {
    type: "planet",
    icon: string,
    satellites?: Satellite[]
    artificial_satellites?: ArtificialSatellite[]
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
        type: "planet",
        parent: "",
        radius: 2439.7,
        distance: 57910000,
        color: "gray",
        axis: 0.034,
        orbit_duration: 87.97,
        rotate_duration: 58.65,
        texture: "mercury.jpg",
        icon: "mercury.png",
        satellites: [],
    },
    {
        id: "venus",
        type: "planet",
        parent: "",
        radius: 6051.8,
        distance: 108200000,
        color: "orange",
        axis: 177.3,
        orbit_duration: 224.7,
        rotate_duration: 243.02,
        texture: "venus.jpg",
        icon: "venus.png",
        overlay_textures: ["venus_cloud.jpg"],
        satellites: []
    },
    {
        id: "earth",
        type: "planet",
        parent: "",
        radius: 6371,
        distance: 149000000,
        color: "blue",
        axis: 23.4,
        orbit_duration: 365.26,
        rotate_duration: 1.0,
        texture: "earth.jpg",
        icon: "earth.png",
        overlay_textures: ["earth_cloud.jpg"],
        satellites: [
            {
                id: "moon",
                type: "satellite",
                parent: "earth",
                radius: 1737,
                distance: 384400,
                color: "gray",
                axis: 1.54,
                orbit_duration: 27.32,
                rotate_duration: 27.32, // Tidally locked
                texture: "moon.jpg",
                icon: "satellite.png"
            }
        ],
        artificial_satellites: [
            {
                id: "iss",
                type: "artificial_satellite",
                parent: "earth",
                radius: 0.0545, // ~54.5 meters radius in km
                distance: 6779, // Distance from Earth center in km (6371 km Earth radius + ~408 km altitude)
                color: "silver",
                axis: 51.64, // Orbital inclination in degrees
                orbit_duration: 0.0645, // ~92.9 minutes orbital period in days
                rotate_duration: 0.0645, // Earth-facing rotational alignment in days
                model: "/solar-system/models/iss.glb",
                icon: "artificial_satellite.png"
            }
        ]
    },
    {
        id: "mars",
        type: "planet",
        parent: "",
        radius: 3389.5,
        distance: 227900000,
        color: "red",
        axis: 25.19,
        orbit_duration: 686.98,
        rotate_duration: 1.03,
        texture: "mars.jpg",
        icon: "mars.png",
        satellites: [
            {
                id: "phobos",
                type: "satellite",
                parent: "mars",
                radius: 11.1,
                distance: 9377,
                color: "brown",
                axis: 0.01,
                orbit_duration: 0.32,
                rotate_duration: 0.32, // Tidally locked
                texture: "phobos.webp",
                icon: "satellite.png"
            },
            {
                id: "deimos",
                type: "satellite",
                parent: "mars",
                radius: 6.2,
                distance: 23460,
                color: "tan",
                axis: 0.93,
                orbit_duration: 1.26,
                rotate_duration: 1.26, // Tidally locked
                texture: "deimos.webp",
                icon: "satellite.png"
            }
        ]
    },
    {
        id: "jupiter",
        type: "planet",
        parent: "",
        radius: 69911,
        distance: 778500000,
        color: "khaki",
        axis: 3.13,
        orbit_duration: 4332.59,
        rotate_duration: 0.41, // 9.9 hours
        texture: "jupiter.jpg",
        icon: "jupiter.png",
        satellites: [
            {
                id: "amalthea",
                type: "satellite",
                parent: "jupiter",
                radius: 83.5,
                distance: 181400,
                color: "red",
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
                color: "gray",
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
                color: "yellow",
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
                color: "lightgray",
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
                color: "gray",
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
                color: "darkgray",
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
                color: "gray",
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
                color: "gray",
                axis: 0,
                orbit_duration: 259.64,
                rotate_duration: 0.5, // Tidally locked
                texture: "elara.webp",
                icon: "satellite.png"
            }
        ]
    },
    {
        id: "saturn",
        type: "planet",
        parent: "",
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
        satellites: [
            {
                id: "mimas",
                type: "satellite",
                parent: "saturn",
                radius: 198.2,
                distance: 185539,
                color: "gray",
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
                color: "white",
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
                color: "lightgray",
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
                color: "gray",
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
                color: "lightgray",
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
                color: "orange",
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
                color: "darkgray",
                axis: 15.47,
                orbit_duration: 79.33,
                rotate_duration: 79.33, // Tidally locked
                texture: "iapetus.webp",
                icon: "satellite.png"
            }
        ]
    },
    {
        id: "uranus",
        type: "planet",
        parent: "",
        radius: 25362,
        distance: 2871000000,
        color: "lightblue",
        axis: 97.77,
        orbit_duration: 30688.5,
        rotate_duration: 0.72, // 17.2 hours
        texture: "uranus.jpg",
        icon: "uranus.png",
        satellites: [
            {
                id: "miranda",
                type: "satellite",
                parent: "uranus",
                radius: 235.8,
                distance: 129390,
                color: "gray",
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
                color: "lightgray",
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
                color: "darkgray",
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
                color: "gray",
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
                color: "gray",
                axis: 0.06,
                orbit_duration: 13.46,
                rotate_duration: 13.46, // Tidally locked
                texture: "oberon.webp",
                icon: "satellite.png"
            }
        ]
    },
    {
        id: "neptune",
        type: "planet",
        parent: "",
        radius: 24622,
        distance: 4495000000,
        color: "blue",
        axis: 28.32,
        orbit_duration: 60182,
        rotate_duration: 0.67, // 16.1 hours
        texture: "neptune.jpg",
        icon: "neptune.png",
        satellites: [
            {
                id: "proteus",
                type: "satellite",
                parent: "neptune",
                radius: 210,
                distance: 117647,
                color: "darkgray",
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
                color: "lightgray",
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
                color: "gray",
                axis: 7.09,
                orbit_duration: 360.14,
                rotate_duration: 0.48, // 11.5 hours
                texture: "nereid.webp",
                icon: "satellite.png"
            }
        ]
    },
    {
        id: "pluto",
        type: "planet",
        parent: "",
        radius: 1188.3,
        distance: 5906380000,
        color: "brown",
        axis: 122.5,
        orbit_duration: 90560,
        rotate_duration: 6.39, // Tidally locked with Charon
        texture: "pluto.webp",
        icon: "pluto.png",
        satellites: [
            {
                id: "charon",
                type: "satellite",
                parent: "pluto",
                radius: 606,
                distance: 19596,
                color: "gray",
                axis: 0,
                orbit_duration: 6.39,
                rotate_duration: 6.39, // Tidally locked
                icon: "satellite.png"
            },
            {
                id: "styx",
                type: "satellite",
                parent: "pluto",
                radius: 8,
                distance: 42656,
                color: "gray",
                axis: 0.81,
                orbit_duration: 20.16,
                rotate_duration: 1.35, // Chaotic
                icon: "satellite.png"
            },
            {
                id: "nix",
                type: "satellite",
                parent: "pluto",
                radius: 23,
                distance: 48694,
                color: "lightgray",
                axis: 0.13,
                orbit_duration: 24.85,
                rotate_duration: 1.83, // Chaotic / rapid
                icon: "satellite.png"
            },
            {
                id: "kerberos",
                type: "satellite",
                parent: "pluto",
                radius: 9,
                distance: 57783,
                color: "darkgray",
                axis: 0.39,
                orbit_duration: 32.17,
                rotate_duration: 5.33, // Chaotic
                icon: "satellite.png"
            },
            {
                id: "hydra",
                type: "satellite",
                parent: "pluto",
                radius: 27,
                distance: 64738,
                color: "lightgray",
                axis: 0.24,
                orbit_duration: 38.2,
                rotate_duration: 0.43, // Chaotic / rapid
                icon: "satellite.png"
            }
        ]
    }
]

export const sun: Star = {
    id: "sun",
    type: "star",
    parent: "",
    radius: 695700,
    color: "yellow",
    axis: 7.25, // obliquity to the ecliptic in degrees
    rotate_duration: 25.05, // equator sidereal rotation period in days
    texture: "sun.jpg",
    icon: "sun.png",
}

export const SCALE = 1000000
export const TIME_SCALE = 6