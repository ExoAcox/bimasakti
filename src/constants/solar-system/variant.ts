import type { Variant } from "@types"

interface Variants {
    [key: string]: Variant[]
}

export const variants: Variants = {
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
            texture: "venus_terraform.jpg",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            landmarks: []
        }
    ],
    earth: [
        {
            variant_id: "65_mbc",
            order: -1,
            texture: "earth_0065.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "90_mbc",
            order: -2,
            texture: "earth_0090.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "105_mbc",
            order: -3,
            texture: "earth_0105.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "120_mbc",
            order: -4,
            texture: "earth_0120.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "150_mbc",
            order: -5,
            texture: "earth_0150.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "170_mbc",
            order: -6,
            texture: "earth_0170.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "200_mbc",
            order: -7,
            texture: "earth_0200.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "220_mbc",
            order: -8,
            texture: "earth_0220.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "240_mbc",
            order: -9,
            texture: "earth_0240.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
    ],
    mars: [
        {
            variant_id: "terraform",
            order: 1,
            texture: "mars_terraform.png",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            cloud_opacity: 0.5,
            aurora: 0.5
        },
        {
            variant_id: "terraform_2",
            order: 2,
            color: "#2b82c5",
            texture: "mars_terraform_2.png",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            atmosphere: 1,
            aurora: 1
        }
    ]
}