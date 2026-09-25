import type { Variant } from "@types"

interface Variants {
    [key: string]: Variant[]
}

export const variants: Variants = {
    venus: [
        {
            variant_id: "ancient",
            texture: "venus_ancient.jpg",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            landmarks: []
        },
        {
            variant_id: "terraform",
            texture: "venus_terraform.jpg",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2",
            landmarks: []
        }
    ],
    earth: [
        {
            variant_id: "65_mbc",
            texture: "earth_0065.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "90_mbc",
            texture: "earth_0090.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "105_mbc",
            texture: "earth_0105.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "120_mbc",
            texture: "earth_0120.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "150_mbc",
            texture: "earth_0150.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "170_mbc",
            texture: "earth_0170.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "200_mbc",
            texture: "earth_0200.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "220_mbc",
            texture: "earth_0220.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
        {
            variant_id: "240_mbc",
            texture: "earth_0240.jpg",
            texture_hd: undefined,
            artificial_satellites: [],
            landmarks: [],
        },
    ],
    mars: [
        {
            variant_id: "terraform",
            texture: "mars_terraform.png",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2"
        },
        {
            variant_id: "terraform_2",
            texture: "mars_terraform_2.png",
            texture_hd: undefined,
            cloud_texture: "earth_cloud.ktx2"
        }
    ]
}