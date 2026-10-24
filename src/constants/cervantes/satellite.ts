import type { Satellite } from "@types"

export const satellites: Satellite[] = [
    {
        id: "campeador",
        type: "satellite",
        parent: "rocinante",
        radius: 3628,
        distance: 421600,
        color: "#c2a586",
        axis: 0.72,
        orbit_duration: 1.368,
        rotate_duration: 1.368,
        texture: "campeador.ktx2",
        cloud_texture: "campeador_cloud.ktx2",
        icon: "mercury.png"
    },
    {
        id: "delamancha",
        type: "satellite",
        parent: "quijote",
        radius: 5378.14,
        distance: 802685,
        color: "#2d7890",
        axis: 0.01,
        orbit_duration: 3.594,
        rotate_duration: 3.594,
        texture: "delamancha.ktx2",
        cloud_texture: "delamancha_cloud.ktx2",
        icon: "earth.png"
    },
    {
        id: "panza",
        type: "satellite",
        parent: "sancho",
        radius: 2128,
        distance: 503247,
        color: "#a6acb5",
        axis: 0.33,
        orbit_duration: 1.266,
        rotate_duration: 1.266,
        texture: "panza.ktx2",
        icon: "moon.png"
    }
]
