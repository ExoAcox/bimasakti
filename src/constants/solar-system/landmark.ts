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
        id: "mount_aconcagua",
        parent: "earth",
        latitude: -32.6532,
        longitude: -70.0109
    },
    {
        id: "mount_denali",
        parent: "earth",
        latitude: 63.0692,
        longitude: -151.0070
    },
    {
        id: "mount_kilimanjaro",
        parent: "earth",
        latitude: -3.0674,
        longitude: 37.3556
    },
    {
        id: "mount_elbrus",
        parent: "earth",
        latitude: 43.3499,
        longitude: 42.4453
    },
    {
        id: "mount_vinson",
        parent: "earth",
        latitude: -78.5254,
        longitude: -85.6171
    },
    {
        id: "mount_cartenz",
        parent: "earth",
        latitude: -4.0789,
        longitude: 137.1583
    },
    {
        id: "mount_k2",
        parent: "earth",
        latitude: 35.8808,
        longitude: 76.5158
    },
    {
        id: "mont_blanc",
        parent: "earth",
        latitude: 45.8326,
        longitude: 6.8652
    },
    {
        id: "mauna_loa",
        parent: "earth",
        latitude: 19.4756,
        longitude: -155.6054
    },
    {
        id: "victoria_falls",
        parent: "earth",
        latitude: -17.9244,
        longitude: 25.8572
    },
    {
        id: "niagara_falls",
        parent: "earth",
        latitude: 43.0962,
        longitude: -79.0377
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
        id: "congo_rainforest",
        parent: "earth",
        latitude: -0.2280,
        longitude: 21.7587
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
        longitude: 10.6628
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
        id: "patagonian_desert",
        parent: "earth",
        latitude: -41.3200,
        longitude: -69.3200
    },
    {
        id: "atacama_desert",
        parent: "earth",
        latitude: -23.8634,
        longitude: -69.1328
    },
    {
        id: "gobi_desert",
        parent: "earth",
        latitude: 42.5900,
        longitude: 103.4300
    },
    {
        id: "arabian_desert",
        parent: "earth",
        latitude: 23.4162,
        longitude: 46.8969
    },
    {
        id: "great_basin_desert",
        parent: "earth",
        latitude: 39.5000,
        longitude: -116.5000
    },
    {
        id: "kalahari_desert",
        parent: "earth",
        latitude: -25.5920,
        longitude: 21.0937
    },
    {
        id: "great_victoria_desert",
        parent: "earth",
        latitude: -28.1522,
        longitude: 129.2566
    },
    {
        id: "caspian_sea",
        parent: "earth",
        latitude: 41.9352,
        longitude: 50.6689
    },
    {
        id: "dead_sea",
        parent: "earth",
        latitude: 31.5590,
        longitude: 35.4732
    },
    {
        id: "mcmurdo_dry_valleys",
        parent: "earth",
        latitude: -77.4700,
        longitude: 162.5000
    },
    {
        id: "antarctic_desert",
        parent: "earth",
        latitude: -80.8628,
        longitude: 70.0000
    },
    {
        id: "mawsynram",
        parent: "earth",
        latitude: 25.2975,
        longitude: 91.5826
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