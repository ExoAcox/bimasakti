import { PlanetClass, type Planet } from "@types"

export const planets: Planet[] = [
    {
        id: "rho_coronae_borealis_e",
        type: "planet",
        class: PlanetClass.SuperEarth,
        parent: "rho_coronae_borealis",
        radius: 9800,
        distance: 15870000,
        color: "#d99468",
        axis: 3,
        orbit_duration: 12.904,
        rotate_duration: 12.904,
        texture: "rho_coronae_borealis_e.ktx2",
        texture_hd: "rho_coronae_borealis_e_hd.ktx2",
        cloud_texture: "rho_coronae_borealis_e_cloud.ktx2",
        cloud_texture_hd: "rho_coronae_borealis_e_cloud_hd.ktx2",
        cloud_opacity: 0.8,
        icon: "venus.png",
        satellites: []
    },
    {
        id: "rho_coronae_borealis_b",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "rho_coronae_borealis",
        radius: 76000,
        distance: 33580000,
        color: "#c88b4a",
        axis: 6,
        orbit_duration: 39.849,
        rotate_duration: 39.849,
        texture: "rho_coronae_borealis_b.ktx2",
        texture_hd: "rho_coronae_borealis_b_hd.ktx2",
        icon: "mercury.png",
        satellites: []
    },
    {
        id: "rho_coronae_borealis_c",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "rho_coronae_borealis",
        radius: 26000,
        distance: 62920000,
        color: "#5b88a5",
        axis: 9,
        orbit_duration: 102.0,
        rotate_duration: 102.0,
        texture: "rho_coronae_borealis_c.ktx2",
        texture_hd: "rho_coronae_borealis_c_hd.ktx2",
        icon: "neptune.png",
        satellites: []
    },
    {
        id: "rho_coronae_borealis_d",
        type: "planet",
        class: PlanetClass.GasGiant,
        parent: "rho_coronae_borealis",
        radius: 23500,
        distance: 122700000,
        color: "#4a6b82",
        axis: 12,
        orbit_duration: 282.0,
        rotate_duration: 282.0,
        texture: "rho_coronae_borealis_d.ktx2",
        texture_hd: "rho_coronae_borealis_d_hd.ktx2",
        icon: "saturn.png",
        ring: {
            inner_radius: 35000,
            outer_radius: 70000,
            texture: "rho_coronae_borealis_d_ring.png"
        },
        satellites: []
    }
]
