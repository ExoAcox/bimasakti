import solar_system from "./solar-system"
import alpha_centauri from "./alpha-centauri"
import type { Universe } from "@types"
import { AlphaCentauri, MilkyWay, SolarSystem } from "@scenes"

export const SCALE = 1000000
export const TIME_SCALE = 6

const universes: Universe[] = [
    {
        id: "milky_way",
        component: <MilkyWay />,
        position: [0, 0, 0],
        minDistance: 10,
        maxDistance: 30,
        cameraPosition: [2, -10, 5],
        labelPosition: "top",
        stars: []

    },
    {
        id: "solar_system",
        component: <SolarSystem />,
        position: [0.038105392881217164, -2.745814737039023, 0.7172299984047412],
        minDistance: 1,
        maxDistance: 20000,
        cameraPosition: [3, 3, 3],
        labelPosition: "right",
        get stars() {
            return solar_system.stars
        }
    },
    {
        id: "alpha_centauri",
        component: <AlphaCentauri />,
        position: [0.0881, -2.6958, 0.7172], // [0.0383, -2.7455, 0.7169]
        minDistance: 1,
        maxDistance: 4000000,
        cameraPosition: [0, 3000, 5000],
        labelPosition: "top",
        get stars() {
            return alpha_centauri.stars
        }
    }
]

export { universes, solar_system, alpha_centauri }