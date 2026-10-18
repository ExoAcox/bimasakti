import { StarClass, type Star } from "@types"

export const stars: Star[] = [
    {
        id: "nu_scorpii_aa",
        type: "star",
        class: StarClass.BlueSubgiant,
        parent: "",
        radius: 3130000,
        distance: 0,
        intensity: 2500,
        color: "#77aaff",
        axis: 6.5,
        rotate_duration: 2.1,
        orbit_duration: 0,
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_ab",
        type: "star",
        class: StarClass.Blue,
        parent: "nu_scorpii_aa",
        radius: 1740000,
        distance: 16500000, // ~0.11 AU
        intensity: 900,
        color: "#88bbff",
        axis: 5.0,
        rotate_duration: 1.8,
        orbit_duration: 5.55, // ~5.55 days
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_ac",
        type: "star",
        class: StarClass.Blue,
        parent: "nu_scorpii_aa",
        radius: 1600000,
        distance: 842000000, // ~5.63 AU
        intensity: 650,
        color: "#99ccff",
        axis: 7.0,
        rotate_duration: 2.5,
        orbit_duration: 3031, // ~8.3 years
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_b",
        type: "star",
        class: StarClass.Blue,
        parent: "nu_scorpii_aa",
        radius: 1800000,
        distance: 30000000000, // ~201 AU
        intensity: 500,
        color: "#aaccff",
        axis: 8.0,
        rotate_duration: 3.0,
        orbit_duration: 246500, // ~675 years
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_c",
        type: "star",
        class: StarClass.BlueSubgiant,
        parent: "nu_scorpii_aa",
        radius: 1670000,
        distance: 820000000000, // ~5,480 AU (separation between AB and CD pairs)
        intensity: 450,
        color: "#99ccff",
        axis: 6.0,
        rotate_duration: 2.8,
        orbit_duration: 38350000, // ~105,000 years
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_da",
        type: "star",
        class: StarClass.Blue,
        parent: "nu_scorpii_c",
        radius: 1600000,
        distance: 45000000000, // ~300 AU from C
        intensity: 400,
        color: "#88bbff",
        axis: 5.5,
        rotate_duration: 2.2,
        orbit_duration: 1130000, // ~3,100 years
        icon: "blue_star.png",
        planets: []
    },
    {
        id: "nu_scorpii_db",
        type: "star",
        class: StarClass.Blue,
        parent: "nu_scorpii_da",
        radius: 1400000,
        distance: 22500000, // ~0.15 AU from Da
        intensity: 350,
        color: "#aaddff",
        axis: 5.0,
        rotate_duration: 1.5,
        orbit_duration: 8.2, // ~8.2 days
        icon: "blue_star.png",
        planets: []
    }
]
