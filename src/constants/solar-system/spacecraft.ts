import { type SpaceCraft, SpaceCraftClass } from "@types"

export const spacecraft: SpaceCraft[] = [
    {
        id: "iss",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Station,
        parent: "earth",
        agencies: ["nasa", "esa", "jaxa", "csa", "roscosmos"],
        rotation: [0, 0, -90],
        radius: 0.0545,
        distance: 6779,
        color: "#c0c0c0",
        axis: 51.64,
        orbit_duration: 0.0645,
        rotate_duration: 0.0645,
        model: "iss.glb",
        icon: "iss.png"
    },
    {
        id: "tiangong",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Station,
        parent: "earth",
        agencies: ["cnsa"],
        rotation: [0, 45, -90],
        radius: 0.055,
        distance: 6761, // ~390km altitude
        color: "#c8c8d0",
        axis: 41.5,
        orbit_duration: 0.064,
        rotate_duration: 0.064,
        model: "tiangong.glb",
        icon: "iss.png"
    },
    {
        id: "hubble",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Telescope,
        parent: "earth",
        agencies: ["nasa", "esa"],
        radius: 0.0066,
        distance: 6911,
        color: "#c0c0c0",
        axis: 28.5,
        orbit_duration: 0.066,
        rotate_duration: 0.066,
        model: "hubble.glb",
        icon: "telescope.png"
    },
    {
        id: "jwst",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Telescope,
        parent: "earth",
        agencies: ["nasa", "esa", "csa"],
        radius: 0.01,
        distance: 1500000,
        color: "#e5b839",
        axis: 5.0,
        orbit_duration: 0,
        rotate_duration: 0,
        model: "jwst.glb",
        icon: "telescope.png"
    },
    {
        id: "lro",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "moon",
        agencies: ["nasa"],
        radius: 0.003,
        distance: 1787,
        color: "#dcdcdc",
        axis: 85.0,
        orbit_duration: 0.083,
        rotate_duration: 0.083,
        model: "lro.glb",
        icon: "iss.png"
    },
    {
        id: "exomars",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "mars",
        agencies: ["esa", "roscosmos"],
        radius: 0.0035,
        distance: 3790, // ~400km altitude above Mars
        color: "#d4af37",
        axis: 74.0,
        orbit_duration: 0.17,
        rotate_duration: 0.17,
        model: "exomars.glb",
        icon: "iss.png"
    },
    {
        id: "maven",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "mars",
        agencies: ["nasa"],
        radius: 0.0057,
        distance: 3540,
        color: "#b0c4de",
        axis: 75.0,
        orbit_duration: 0.188,
        rotate_duration: 0.188,
        model: "maven.glb",
        icon: "iss.png"
    },
    {
        id: "mro",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "mars",
        agencies: ["nasa"],
        radius: 0.0068,
        distance: 3640,
        color: "#c0c0c0",
        axis: 93.0,
        orbit_duration: 0.078,
        rotate_duration: 0.078,
        model: "mro.glb",
        icon: "iss.png"
    },
    {
        id: "odyssey",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "mars",
        agencies: ["nasa"],
        radius: 0.0022,
        distance: 3790,
        color: "#a9a9a9",
        axis: 93.1,
        orbit_duration: 0.083,
        rotate_duration: 0.083,
        model: "odyssey.glb",
        icon: "iss.png"
    },
    {
        id: "juno",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "jupiter",
        agencies: ["nasa"],
        radius: 0.01,
        distance: 420000,
        color: "#a9a9a9",
        axis: 90.0,
        orbit_duration: 53.0,
        rotate_duration: 53.0,
        model: "juno.glb",
        icon: "iss.png"
    },
    {
        id: "parker_solar",
        type: "spacecraft-orbiter",
        class: SpaceCraftClass.Orbiter,
        parent: "sun",
        agencies: ["nasa"],
        radius: 0.003,
        distance: 6900000,
        color: "#e0e0e0",
        axis: 3.4,
        orbit_duration: 88.0,
        rotate_duration: 88.0,
        model: "parker_solar.glb",
        icon: "iss.png"
    },
    {
        id: "voyager_1",
        type: "spacecraft-flyby",
        class: SpaceCraftClass.FlyBy,
        parent: "earth",
        rotation: [0, -90, 0],
        agencies: ["nasa"],
        radius: 0.0037, // ~3.7m high-gain antenna dish radius (in km)
        distance: 24250000000, // ~24.25 billion km from Earth (~162 AU)
        color: "#ffd700",
        axis: 35.0, // ~35° north trajectory out of ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "voyager.glb",
        icon: "iss.png"
    },
    {
        id: "voyager_2",
        type: "spacecraft-flyby",
        class: SpaceCraftClass.FlyBy,
        parent: "earth",
        rotation: [0, -90, 0],
        agencies: ["nasa"],
        radius: 0.0037, // ~3.7m high-gain antenna dish radius (in km)
        distance: 20300000000, // ~20.3 billion km from Earth (~136 AU)
        color: "#c0c0c0",
        axis: -48.0, // ~48° south trajectory out of ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "voyager.glb",
        icon: "iss.png"
    },
    {
        id: "new_horizons",
        type: "spacecraft-flyby",
        class: SpaceCraftClass.FlyBy,
        parent: "earth",
        rotation: [0, -90, 0],
        agencies: ["nasa"],
        radius: 0.0025, // ~2.5m spacecraft dimension (in km)
        distance: 8800000000, // ~8.8 billion km from Earth (~58.8 AU)
        color: "#e5b839", // Gold thermal blanket color
        axis: 2.45, // ~2.45° trajectory inclination relative to ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "new_horizons.glb",
        icon: "iss.png"
    }
]

export default spacecraft
