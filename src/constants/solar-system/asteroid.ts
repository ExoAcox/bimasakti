import type { Asteroid } from "@types"
import { landmarks } from "./landmark"

export const asteroids: Asteroid[] = [
    {
        id: "vesta",
        type: "asteroid",
        parent: "sun",
        radius: 262.7,
        distance: 353400000,
        rotation: [90, 0, 0],
        color: "#9c9589",
        axis: 7.14,
        orbit_duration: 1325.4,
        rotate_duration: 0.22,
        model: "vesta.ply",
        texture: "vesta.ktx2",
        icon: "asteroid.png",
        get landmarks() {
            return landmarks.filter((landmark) => landmark.parent === this.id)
        }
    },
    {
        id: "pallas",
        type: "asteroid",
        parent: "sun",
        radius: 256,
        distance: 414400000,
        rotation: [90, 0, 0],
        color: "#a59d94",
        axis: 34.8,
        orbit_duration: 1686,
        rotate_duration: 0.3255,
        model: "pallas.ply",
        texture: "pallas.ktx2",
        icon: "asteroid.png"
    },
    {
        id: "eros",
        type: "asteroid",
        parent: "sun",
        radius: 8.4,
        distance: 218100000,
        color: "#bfa89b",
        axis: 89,
        orbit_duration: 643.2,
        rotate_duration: 0.2196,
        model: "eros.glb",
        icon: "asteroid.png"
    },
    {
        id: "itokawa",
        type: "asteroid",
        parent: "sun",
        radius: 0.165,
        distance: 198100000,
        color: "#a8a29a",
        axis: 178,
        orbit_duration: 556.4,
        rotate_duration: 0.5055,
        model: "itokawa.glb",
        icon: "asteroid.png"
    },
    {
        id: "arrokoth",
        type: "asteroid",
        parent: "sun",
        radius: 9.9,
        distance: 6377000000,
        longest_distance: 6961000000,
        rotation: [90, 0, 0],
        color: "#a65e4e",
        axis: 2.45,
        orbit_duration: 108735,
        rotate_duration: 0.663,
        model: "arrokoth.ply",
        texture: "arrokoth.ktx2",
        icon: "asteroid.png"
    },
]