import { StarClass, type StarVariant, type Variant } from "@types"

interface Variants {
    [key: string]: (Variant | StarVariant)[]
}

export const variants: Variants = {
    sun: [
        {
            variant_id: "dyson_sphere",
            order: 1
        },
        {
            variant_id: "red_giant",
            order: 2,
            class: StarClass.RedGiant,
            radius: 695700 * 200,
            color: "#ff3300",
            intensity: 3000,
            gordilocks: {
                inner_radius: 4500000000,
                outer_radius: 7500000000,
            }
        },

    ],
    venus: [
        {
            variant_id: "ancient",
            order: -1,
            texture: "venus_ancient.jpg",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            landmarks: []
        },
        {
            variant_id: "terraform",
            order: 1,
            color: "#2b82c5",
            texture: "venus_terraform.jpg",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            icon: "earth.png",
            aurora: 1,
            landmarks: []
        }
    ],
    earth: [
        {
            variant_id: "65_mbc",
            order: -65,
            texture: "earth_0065.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "90_mbc",
            order: -90,
            texture: "earth_0090.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "105_mbc",
            order: -105,
            texture: "earth_0105.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "120_mbc",
            order: -120,
            texture: "earth_0120.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "150_mbc",
            order: -150,
            texture: "earth_0150.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "170_mbc",
            order: -170,
            texture: "earth_0170.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "200_mbc",
            order: -200,
            texture: "earth_0200.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "220_mbc",
            order: -220,
            texture: "earth_0220.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "240_mbc",
            order: -240,
            texture: "earth_0240.jpg",
            texture_hd: undefined,
            night_texture: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
    ],
    moon: [
        {
            variant_id: "theia",
            order: -4500,
            radius: 3390,
            rotate_duration: 14.0,
            texture: "theia.jpg",
            texture_hd: undefined,
            landmarks: []
        },
    ],
    mars: [
        {
            variant_id: "terraform",
            order: 1,
            texture: "mars_terraform.ktx2",
            texture_hd: "mars_terraform_hd.ktx2",
            cloud_texture: "earth_cloud.ktx2",
            cloud_opacity: 0.5,
            atmosphere: 0.5,
            aurora: 0.5
        },
        {
            variant_id: "terraform_2",
            order: 2,
            color: "#2b82c5",
            texture: "mars_terraform_2.ktx2",
            texture_hd: "mars_terraform_2_hd.ktx2",
            cloud_texture: "earth_cloud.ktx2",
            icon: "earth.png",
            atmosphere: 1,
            aurora: 1
        },
        {
            variant_id: "terraform_3",
            order: 3,
            color: "#2b82c5",
            texture: "mars_terraform_3.ktx2",
            texture_hd: undefined,
            night_texture: "mars_night.ktx2",
            night_opacity: 0.25,
            cloud_texture: "earth_cloud.ktx2",
            icon: "earth.png",
            atmosphere: 1,
            aurora: 1
        }
    ]
}