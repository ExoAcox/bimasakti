import type { Landmark } from "@types"

export const landmarks: Landmark[] = [
    // Earth
    {
        id: "mount_everest",
        parent: "earth",
        latitude: 27.9881,
        longitude: 86.9250
    },
    {
        id: "point_nemo",
        parent: "earth",
        latitude: -48.8767,
        longitude: -123.3933
    },
    {
        id: "amazon_rainforest",
        parent: "earth",
        latitude: -3.4653,
        longitude: -62.2159
    },
    {
        id: "chicxulub_crater",
        parent: "earth",
        latitude: 21.4000,
        longitude: -89.5000
    },
    {
        id: "sahara_desert",
        parent: "earth",
        latitude: 23.4162,
        longitude: 25.6628
    },
    {
        id: "nile_river",
        parent: "earth",
        latitude: 24.0889,
        longitude: 32.8998
    },
    {
        id: "grand_canyon",
        parent: "earth",
        latitude: 36.1069,
        longitude: -112.1129
    },
    {
        id: "mariana_trench",
        parent: "earth",
        latitude: 11.3493,
        longitude: 142.1996
    },
    {
        id: "great_barrier_reef",
        parent: "earth",
        latitude: -18.2871,
        longitude: 147.6992
    },

    // Mars
    {
        id: "mount_olympus",
        parent: "mars",
        latitude: 18.65,
        longitude: -133.8
    },
    {
        id: "valles_marineris",
        parent: "mars",
        latitude: -13.9,
        longitude: -69.2
    },
    {
        id: "gale_crater",
        parent: "mars",
        latitude: -4.58,
        longitude: 137.44
    },
    {
        id: "jezero_crater",
        parent: "mars",
        latitude: 18.38,
        longitude: 77.58
    },
    {
        id: "hellas_planitia",
        parent: "mars",
        latitude: -42.4,
        longitude: 70.5
    },

    // Jupiter
    {
        id: "giant_red_spot",
        parent: "jupiter",
        latitude: -22.0,
        longitude: -45.0
    },

    // Moon
    {
        id: "tranquility_base",
        parent: "moon",
        latitude: 0.674,
        longitude: 23.473
    },
    {
        id: "tycho_crater",
        parent: "moon",
        latitude: -43.31,
        longitude: -11.36
    },
    {
        id: "copernicus_crater",
        parent: "moon",
        latitude: 9.62,
        longitude: -20.08
    },
    {
        id: "south_pole_aitken",
        parent: "moon",
        latitude: -53.0,
        longitude: 169.0
    },

    // Venus
    {
        id: "maat_mons",
        parent: "venus",
        latitude: 0.5,
        longitude: 194.3
    },
    {
        id: "ishtar_terra",
        parent: "venus",
        latitude: 70.4,
        longitude: 27.5
    },

    // Mercury
    {
        id: "caloris_basin",
        parent: "mercury",
        latitude: 30.5,
        longitude: 189.8
    },

    // Pluto
    {
        id: "tombaugh_regio",
        parent: "pluto",
        latitude: 19.5,
        longitude: 158.5
    },

    // Ceres
    {
        id: "occator_crater",
        parent: "ceres",
        latitude: 19.8,
        longitude: 239.3
    }
]