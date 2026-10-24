import type { Universe } from "@types"

import solar_system from "./solar-system"
import alpha_centauri from "./alpha-centauri"
import sagittarius_a from "./sagittarius-a"
import trappist_1 from "./trappist-1"
import lich from "./lich"
import toi_700 from "./toi-700"
import copernicus from "./copernicus"
import kepler_32 from "./kepler-32"
import wasp_47 from "./wasp-47"
import rho_coronae_borealis from "./rho_coronae_borealis"
import nu_scorpii from "./nu_scorpii"
import hd_110067 from "./hd_110067"
import cervantes from "./cervantes"

export const SCALE = 1e+5
export const TIME_SCALE = 3
export const INTENSITY_SCALE = 1e+14

export const LOWREST_SCALE = 3e+7
export const SHIP_SCALE = 0.05 / SCALE

export const AU_SCALE = 149000000

const universes: Universe[] = [
    {
        id: "milky_way",
        image: "milky_way.webp",
        position: [0, 0, 0],
        minDistance: 10,
        maxDistance: 30,
        cameraPosition: [-2, -12, -5],
        labelPosition: "top",
        assetCount: 3,
        stars: [],
        mobile: {
            cameraPosition: [-2, -20, -5]
        }
    },
    // {
    //     id: "sagittarius_a",
    //     image: "sagittarius_a.jpg",
    //     position: [0, 0, 0],
    //     minDistance: 1e-6,
    //     maxDistance: 25000,
    //     cameraPosition: [200, 100, 500],
    //     labelPosition: "top",
    //     assetCount: 1,
    //     stars: [],
    //     mobile: {}
    // },
    {
        id: "solar_system",
        image: "solar_system.webp",
        position: [0.038105392881217164, -2.745814737039023, 0.7172299984047412],
        minDistance: 3e-7,
        maxDistance: 400000,
        cameraPosition: [1000, 1000, 1000],
        labelPosition: "right",
        defaultFocus: "sun",
        assetCount: 59,
        stars: solar_system.stars,
        mobile: {}
    },
    {
        id: "alpha_centauri",
        image: "alpha_centauri.webp",
        position: [0.0881, -2.6958, 0.7172],
        minDistance: 0.01,
        maxDistance: 60000000,
        cameraPosition: [10, 30000, 50000],
        labelPosition: "top",
        assetCount: 6,
        stars: alpha_centauri.stars,
        mobile: {}
    },
    {
        id: "trappist-1",
        image: "trappist-1.webp",
        position: [0.1, -2.5, 0.7],
        minDistance: 0.1,
        maxDistance: 300,
        cameraPosition: [30, 30, 30],
        labelPosition: "bottom",
        defaultFocus: "trappist-1",
        assetCount: 12,
        stars: trappist_1.stars,
        mobile: {}
    },
    {
        id: "lich",
        image: "lich.webp",
        position: [0.14, -2.4, 0.75],
        minDistance: 0.1,
        maxDistance: 3000,
        cameraPosition: [2, 2, 2],
        labelPosition: "left",
        defaultFocus: "lich",
        assetCount: 4,
        stars: lich.stars,
        mobile: {}
    },
    {
        id: "toi-700",
        image: "toi-700.webp",
        position: [0.12, -2.65, 0.68],
        minDistance: 0.1,
        maxDistance: 1500,
        cameraPosition: [100, 100, 100],
        labelPosition: "left",
        defaultFocus: "toi-700",
        assetCount: 8,
        stars: toi_700.stars,
        mobile: {}
    },
    {
        id: "copernicus",
        image: "copernicus.webp",
        position: [0.06, -2.6, 0.73],
        minDistance: 0.1,
        maxDistance: 2000000,
        cameraPosition: [150, 150, 150],
        labelPosition: "bottom",
        defaultFocus: "copernicus",
        assetCount: 7,
        stars: copernicus.stars,
        mobile: {}
    },
    {
        id: "kepler-32",
        image: "kepler-32.webp",
        position: [0.08, -2.55, 0.72],
        minDistance: 0.1,
        maxDistance: 1200,
        cameraPosition: [60, 60, 60],
        labelPosition: "top",
        defaultFocus: "kepler-32",
        assetCount: 6,
        stars: kepler_32.stars,
        mobile: {}
    },
    {
        id: "wasp-47",
        image: "wasp-47.webp",
        position: [0.045, -2.62, 0.70],
        minDistance: 0.1,
        maxDistance: 50000,
        cameraPosition: [150, 150, 150],
        labelPosition: "bottom",
        defaultFocus: "wasp-47",
        assetCount: 5,
        stars: wasp_47.stars,
        mobile: {}
    },
    {
        id: "rho_coronae_borealis",
        image: "rho_coronae_borealis.webp",
        position: [0.07, -2.68, 0.74],
        minDistance: 0.1,
        maxDistance: 20000,
        cameraPosition: [120, 120, 120],
        labelPosition: "top",
        defaultFocus: "rho_coronae_borealis",
        assetCount: 5,
        stars: rho_coronae_borealis.stars,
        mobile: {}
    },
    {
        id: "nu_scorpii",
        image: "nu_scorpii.webp",
        position: [0.055, -2.72, 0.71],
        minDistance: 0.01,
        maxDistance: 60000000,
        cameraPosition: [300, 300, 300],
        labelPosition: "top",
        defaultFocus: "nu_scorpii_aa",
        assetCount: 7,
        stars: nu_scorpii.stars,
        mobile: {}
    },
    {
        id: "hd_110067",
        image: "hd_110067.webp",
        position: [0.065, -2.58, 0.69],
        minDistance: 0.1,
        maxDistance: 35000,
        cameraPosition: [160, 160, 160],
        labelPosition: "bottom",
        defaultFocus: "hd_110067",
        assetCount: 7,
        stars: hd_110067.stars,
        mobile: {}
    },
    {
        id: "cervantes",
        image: "cervantes.webp",
        position: [0.052, -2.66, 0.72],
        minDistance: 0.1,
        maxDistance: 6000000,
        cameraPosition: [350, 350, 350],
        labelPosition: "left",
        defaultFocus: "cervantes",
        assetCount: 8,
        stars: cervantes.stars,
        mobile: {}
    }
]

const universe_ids = universes.map(universe => universe.id)

export { universes, universe_ids, solar_system, alpha_centauri, sagittarius_a, trappist_1, lich, toi_700, copernicus, kepler_32, wasp_47, rho_coronae_borealis, nu_scorpii, hd_110067, cervantes }
