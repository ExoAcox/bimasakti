import type { Universe } from "@types"

import solar_system from "./solar-system"
import alpha_centauri from "./alpha-centauri"
import sagittarius_a from "./sagittarius-a"
import trappist_1 from "./trappist-1"
import lich from "./lich"

export const SCALE = 1000000
export const TIME_SCALE = 6
export const INTENSITY_SCALE = 100000000000000

const universes: Universe[] = [
    {
        id: "milky_way",
        position: [0, 0, 0],
        minDistance: 10,
        maxDistance: 30,
        cameraPosition: [2, -12, 5],
        labelPosition: "top",
        stars: [],
        mobile: {
            cameraPosition: [2, -20, 5]
        }

    },
    {
        id: "sagittarius_a",
        position: [0, 0, 0],
        minDistance: 0.000001,
        maxDistance: 25000,
        cameraPosition: [200, 100, 500],
        labelPosition: "top",
        stars: [],
        mobile: {}
    },
    {
        id: "solar_system",
        position: [0.038105392881217164, -2.745814737039023, 0.7172299984047412],
        minDistance: 0.000001,
        maxDistance: 40000,
        cameraPosition: [3, 3, 3],
        labelPosition: "right",
        defaultFocus: "sun",
        stars: solar_system.stars,
        mobile: {}
    },
    {
        id: "alpha_centauri",
        position: [0.0881, -2.6958, 0.7172], // [0.0383, -2.7455, 0.7169]
        minDistance: 0.001,
        maxDistance: 5000000,
        cameraPosition: [0, 3000, 5000],
        labelPosition: "top",
        stars: alpha_centauri.stars,
        mobile: {}
    },
    {
        id: "trappist-1",
        position: [0.1, -2.5, 0.7],
        minDistance: 0.001,
        maxDistance: 30,
        cameraPosition: [0.3, 0.3, 0.3],
        labelPosition: "bottom",
        defaultFocus: "trappist-1",
        stars: trappist_1.stars,
        mobile: {}
    },
    {
        id: "lich",
        position: [0.14, -2.4, 0.75],
        minDistance: 0.001,
        maxDistance: 300,
        cameraPosition: [0.1, 0.1, 0.1],
        labelPosition: "left",
        defaultFocus: "lich",
        stars: lich.stars,
        mobile: {}
    }
]

export { universes, solar_system, alpha_centauri, sagittarius_a, trappist_1, lich }
