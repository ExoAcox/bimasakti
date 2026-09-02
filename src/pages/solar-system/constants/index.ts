import type { Belt } from "../types"

export * from "../types"
export * from "./satellite"
export * from "./planet"
export * from "./star"


export const belts: Belt[] = [
    {
        id: "asteriod",
        type: "belt",
        min_size: 100,
        max_size: 300,
        inner_radius: 329000000,
        outer_radius: 478000000,
        height: 150000000
    }
]

export const SCALE = 1000000
export const TIME_SCALE = 6
