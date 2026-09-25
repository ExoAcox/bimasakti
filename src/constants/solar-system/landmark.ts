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
        longitude: 42.4453,
        reverse: true
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
        longitude: 6.8652,
        reverse: true,
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
        longitude: 21.7587,
        reverse: true
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
        longitude: -116.5000,
        reverse: true
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
        id: "atlantic_ocean",
        parent: "earth",
        latitude: 0.0,
        longitude: -30.0
    },
    {
        id: "pacific_ocean",
        parent: "earth",
        latitude: 0.0,
        longitude: -160.0
    },
    {
        id: "indian_ocean",
        parent: "earth",
        latitude: -20.0,
        longitude: 80.0
    },
    {
        id: "mediterranean_sea",
        parent: "earth",
        latitude: 35.0,
        longitude: 18.0
    },
    {
        id: "baltic_sea",
        parent: "earth",
        latitude: 58.0,
        longitude: 20.0
    },
    {
        id: "black_sea",
        parent: "earth",
        latitude: 43.4130,
        longitude: 34.2993,
        reverse: true
    },
    {
        id: "red_sea",
        parent: "earth",
        latitude: 20.2802,
        longitude: 38.5126
    },
    {
        id: "persian_gulf",
        parent: "earth",
        latitude: 26.8206,
        longitude: 50.8524
    },
    {
        id: "gulf_of_mexico",
        parent: "earth",
        latitude: 25.0,
        longitude: -90.0
    },
    {
        id: "greenland",
        parent: "earth",
        latitude: 72.0,
        longitude: -40.0
    },
    {
        id: "antarctic_desert",
        parent: "earth",
        latitude: -80.8628,
        longitude: 70.0000
    },
    {
        id: "great_barrier_reef",
        parent: "earth",
        latitude: -18.2871,
        longitude: 147.6992
    },
    {
        id: "himalaya_mountains",
        parent: "earth",
        latitude: 30.0,
        longitude: 84.0,
        reverse: true
    },
    {
        id: "alps_mountains",
        parent: "earth",
        latitude: 46.5,
        longitude: 10.0
    },
    {
        id: "andes_mountains",
        parent: "earth",
        latitude: -21.0,
        longitude: -69.0
    },
    {
        id: "rocky_mountains",
        parent: "earth",
        latitude: 44.0,
        longitude: -110.0
    },
    {
        id: "caucasus_mountains",
        parent: "earth",
        latitude: 42.0,
        longitude: 45.0
    },
    {
        id: "atlas_mountains",
        parent: "earth",
        latitude: 31.5,
        longitude: -7.0
    },
    {
        id: "ural_mountains",
        parent: "earth",
        latitude: 60.0,
        longitude: 60.0
    },
    {
        id: "lake_victoria",
        parent: "earth",
        latitude: -1.0,
        longitude: 33.0,
        reverse: true
    },
    {
        id: "zagros_mountains",
        parent: "earth",
        latitude: 33.5,
        longitude: 48.5
    },

    // Mars
    {
        id: "mount_olympus",
        parent: "mars",
        latitude: 18.65,
        longitude: -133.8
    },
    {
        id: "elysium_mons",
        parent: "mars",
        latitude: 25.0,
        longitude: 147.2
    },
    {
        id: "valles_marineris",
        parent: "mars",
        latitude: -10.3,
        longitude: -72.2
    },
    {
        id: "gale_crater",
        parent: "mars",
        latitude: -4.58,
        longitude: 138.14,
        object: {
            name: "Curiosity Rover",
            icon: "rover.png"
        }
    },
    {
        id: "jezero_crater",
        parent: "mars",
        latitude: 13.38,
        longitude: 85.58,
        object: {
            name: "Perseverance Rover",
            icon: "rover.png"
        }
    },
    {
        id: "perseverance_valley",
        parent: "mars",
        latitude: -14.47,
        longitude: -2.33,
        object: {
            name: "Opportunity Rover",
            icon: "rover.png"
        }
    },
    {
        id: "hellas_planitia",
        parent: "mars",
        latitude: -42.4,
        longitude: 70.5
    },
    {
        id: "ascraeus_mons",
        parent: "mars",
        latitude: 11.92,
        longitude: -104.08
    },
    {
        id: "pavonis_mons",
        parent: "mars",
        latitude: 1.4,
        longitude: -113.0
    },
    {
        id: "arsia_mons",
        parent: "mars",
        latitude: -8.4,
        longitude: -120.95
    },
    {
        id: "alba_mons",
        parent: "mars",
        latitude: 40.5,
        longitude: -110.0
    },
    {
        id: "medusa_fossae",
        parent: "mars",
        latitude: -2.0,
        longitude: -160.0
    },
    {
        id: "nili_fossae",
        parent: "mars",
        latitude: 22.0,
        longitude: 76.8
    },
    {
        id: "ghost_dunes",
        parent: "mars",
        latitude: -7.0,
        longitude: -94.0
    },
    {
        id: "meridiani_planum",
        parent: "mars",
        latitude: 0.2,
        longitude: -2.5
    },
    {
        id: "hale_crater",
        parent: "mars",
        latitude: -35.7,
        longitude: -36.6
    },
    {
        id: "aram_chaos",
        parent: "mars",
        latitude: 2.6,
        longitude: -21.5
    },
    {
        id: "aurorae_chaos",
        parent: "mars",
        latitude: -8.9,
        longitude: -35.2
    },
    {
        id: "aureum_chaos",
        parent: "mars",
        latitude: -4.4,
        longitude: -27.0
    },
    {
        id: "planum_boreum",
        parent: "mars",
        latitude: 88.0,
        longitude: 15.0
    },
    {
        id: "planum_australe",
        parent: "mars",
        latitude: -86.8,
        longitude: 0.0
    },
    {
        id: "utopia_planitia",
        parent: "mars",
        latitude: 46.7,
        longitude: 117.5
    },

    // Jupiter
    {
        id: "giant_red_spot",
        parent: "jupiter",
        latitude: -22.0,
        longitude: -45.0
    },

    // Saturn
    {
        id: "saturn_hexagon",
        parent: "saturn",
        latitude: 90.0,
        longitude: 0.0
    },

    // Neptune
    {
        id: "great_dark_spot",
        parent: "neptune",
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
        id: "mare_imbrium",
        parent: "moon",
        latitude: 32.8,
        longitude: -15.6
    },
    {
        id: "plato_crater",
        parent: "moon",
        latitude: 51.6,
        longitude: -9.3,
        reverse: true
    },
    {
        id: "montes_apenninus",
        parent: "moon",
        latitude: 18.9,
        longitude: -3.7,
        reverse: true
    },
    {
        id: "mare_serenitatis",
        parent: "moon",
        latitude: 28.0,
        longitude: 17.5
    },
    {
        id: "mare_tranquillitatis",
        parent: "moon",
        latitude: 8.5,
        longitude: 31.4
    },
    {
        id: "mare_crisium",
        parent: "moon",
        latitude: 17.0,
        longitude: 59.1
    },
    {
        id: "mare_fecunditatis",
        parent: "moon",
        latitude: -7.8,
        longitude: 51.3
    },
    {
        id: "mare_nectaris",
        parent: "moon",
        latitude: -15.2,
        longitude: 35.5
    },
    {
        id: "mare_vaporum",
        parent: "moon",
        latitude: 13.3,
        longitude: 3.6
    },
    {
        id: "mare_nubium",
        parent: "moon",
        latitude: -21.3,
        longitude: -16.6
    },
    {
        id: "langrenus_crater",
        parent: "moon",
        latitude: -8.9,
        longitude: 61.1
    },
    {
        id: "stevinus_crater",
        parent: "moon",
        latitude: -32.5,
        longitude: 54.2
    },
    {
        id: "mare_humorum",
        parent: "moon",
        latitude: -24.4,
        longitude: -38.6
    },
    {
        id: "mare_frigoris",
        parent: "moon",
        latitude: 57,
        longitude: 1.4
    },
    {
        id: "oceanus_procellarum",
        parent: "moon",
        latitude: 17.4,
        longitude: -57.4
    },
    {
        id: "aristarchus_crater",
        parent: "moon",
        latitude: 23.7,
        longitude: -47.4
    },
    {
        id: "kepler_crater",
        parent: "moon",
        latitude: 8.1,
        longitude: -38.0
    },
    {
        id: "mare_cognitum",
        parent: "moon",
        latitude: -10.5,
        longitude: -22.3
    },
    {
        id: "mare_insularum",
        parent: "moon",
        latitude: 7.5,
        longitude: -30.9
    },
    {
        id: "zeeman_crater",
        parent: "moon",
        latitude: -75.2,
        longitude: -134.8
    },
    {
        id: "tsiolkovskiy_crater",
        parent: "moon",
        latitude: -20.4,
        longitude: 129.1
    },
    {
        id: "mouton_mons",
        parent: "moon",
        latitude: -85.4,
        longitude: 31.7
    },
    {
        id: "south_pole_aitken",
        parent: "moon",
        latitude: -53.0,
        longitude: 169.0
    },
    {
        id: "mare_orientale",
        parent: "moon",
        latitude: -19.4,
        longitude: -92.8
    },
    {
        id: "mare_smythii",
        parent: "moon",
        latitude: -1.3,
        longitude: 87.5
    },
    {
        id: "mare_marginis",
        parent: "moon",
        latitude: 13.3,
        longitude: 86.1
    },

    // Venus
    {
        id: "maat_mons",
        parent: "venus",
        latitude: 0.9,
        longitude: 194.5
    },
    {
        id: "ishtar_terra",
        parent: "venus",
        latitude: 70.4,
        longitude: 27.5
    },
    {
        id: "aphrodite_terra",
        parent: "venus",
        latitude: -5.8,
        longitude: 100.0
    },
    {
        id: "beta_regio",
        parent: "venus",
        latitude: 25.3,
        longitude: 282.8
    },
    {
        id: "maxwell_montes",
        parent: "venus",
        latitude: 65.2,
        longitude: 3.3
    },

    // Mercury
    {
        id: "van_eyck_crater",
        parent: "mercury",
        latitude: 43.2,
        longitude: 159.4
    },
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