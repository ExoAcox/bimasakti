import type { Universe } from "@types"

import solar_system from "./solar-system"
import alpha_centauri from "./alpha-centauri"
import sagittarius_a from "./sagittarius-a"
import trappist_1 from "./trappist-1"

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
        stars: []

    },
    {
        id: "sagittarius_a",
        position: [0, 0, 0],
        minDistance: 0.000001,
        maxDistance: 30000,
        cameraPosition: [3, 3, 3],
        labelPosition: "top",
        get stars() {
            return solar_system.stars
        }
    },
    {
        id: "solar_system",
        position: [0.038105392881217164, -2.745814737039023, 0.7172299984047412],
        minDistance: 0.000001,
        maxDistance: 40000,
        cameraPosition: [3, 3, 3],
        labelPosition: "right",
        defaultFocus: "sun",
        get stars() {
            return solar_system.stars
        }
    },
    {
        id: "alpha_centauri",
        position: [0.0881, -2.6958, 0.7172], // [0.0383, -2.7455, 0.7169]
        minDistance: 0.001,
        maxDistance: 5000000,
        cameraPosition: [0, 3000, 5000],
        labelPosition: "top",
        get stars() {
            return alpha_centauri.stars
        }
    },
    {
        id: "trappist-1",
        position: [0.1, -2.5, 0.7],
        minDistance: 0.001,
        maxDistance: 40,
        cameraPosition: [0.3, 0.3, 0.3],
        labelPosition: "bottom",
        defaultFocus: "trappist-1",
        get stars() {
            return trappist_1.stars
        }
    }
]

export { universes, solar_system, alpha_centauri, sagittarius_a, trappist_1 }
