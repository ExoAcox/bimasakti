import { SpaceCraftClass, type SpaceCraft } from "@types"

export const spacecraft: SpaceCraft[] = [
    {
        id: "iss",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.Station,
        agencies: ["nasa", "esa", "jaxa", "csa", "roscosmos"],
        rotation: [0, 0, -90],
        radius: 0.0545, // ~54.5 meters radius in km
        distance: 6779, // Distance from Earth center in km (6371 km Earth radius + ~408 km altitude)
        color: "#c0c0c0",
        axis: 51.64, // Orbital inclination in degrees
        orbit_duration: 0.0645, // ~92.9 minutes orbital period in days
        rotate_duration: 0.0645, // Earth-facing rotational alignment in days
        model: "iss.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "hubble",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.Telescope,
        agencies: ["nasa", "esa"],
        radius: 0.0066, // ~13.2m length (in km)
        distance: 6911, // ~540 km altitude
        color: "#c0c0c0",
        axis: 28.5,
        orbit_duration: 0.066,
        rotate_duration: 0.066,
        model: "hubble.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "jswt",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.Telescope,
        agencies: ["nasa", "esa", "csa"],
        radius: 0.01, // ~20m sunshield dimension (in km)
        distance: 1500000, // ~1.5 million km at Sun-Earth L2
        color: "#e5b839",
        axis: 5.0,
        orbit_duration: 180,
        rotate_duration: 180,
        model: "jswt.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "lro",
        type: "spacecraft",
        parent: "moon",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.003,
        distance: 1787, // ~50 km altitude above Moon surface (1737 km Moon radius)
        color: "#dcdcdc",
        axis: 85.0,
        orbit_duration: 0.083,
        rotate_duration: 0.083,
        model: "lro.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "exomars",
        type: "spacecraft",
        parent: "mars",
        class: SpaceCraftClass.Orbiter,
        agencies: ["esa", "roscosmos"],
        radius: 0.0035,
        distance: 3790, // ~400km altitude above Mars
        color: "#d4af37",
        axis: 74.0,
        orbit_duration: 0.17,
        rotate_duration: 0.17,
        model: "exomars.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "maven",
        type: "spacecraft",
        parent: "mars",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.0057,
        distance: 3540,
        color: "#b0c4de",
        axis: 75.0,
        orbit_duration: 0.188,
        rotate_duration: 0.188,
        model: "maven.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "mro",
        type: "spacecraft",
        parent: "mars",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.0068,
        distance: 3640,
        color: "#c0c0c0",
        axis: 93.0,
        orbit_duration: 0.078,
        rotate_duration: 0.078,
        model: "mro.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "odyssey",
        type: "spacecraft",
        parent: "mars",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.0022,
        distance: 3790,
        color: "#a9a9a9",
        axis: 93.1,
        orbit_duration: 0.083,
        rotate_duration: 0.083,
        model: "odyssey.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "juno",
        type: "spacecraft",
        parent: "jupiter",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.01,
        distance: 420000,
        color: "#a9a9a9",
        axis: 90.0,
        orbit_duration: 53.0,
        rotate_duration: 53.0,
        model: "juno.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "parker_solar",
        type: "spacecraft",
        parent: "sun",
        class: SpaceCraftClass.Orbiter,
        agencies: ["nasa"],
        radius: 0.003,
        distance: 6900000,
        color: "#e0e0e0",
        axis: 3.4,
        orbit_duration: 88.0,
        rotate_duration: 88.0,
        model: "parker_solar.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "voyager_1",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
        agencies: ["nasa"],
        radius: 0.0037, // ~3.7m high-gain antenna dish radius (in km)
        distance: 24250000000, // ~24.25 billion km from Earth (~162 AU)
        color: "#ffd700",
        axis: 35.0, // ~35° north trajectory out of ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "voyager.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "voyager_2",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
        agencies: ["nasa"],
        radius: 0.0037, // ~3.7m high-gain antenna dish radius (in km)
        distance: 20300000000, // ~20.3 billion km from Earth (~136 AU)
        color: "#c0c0c0",
        axis: -48.0, // ~48° south trajectory out of ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "voyager.glb",
        icon: "artificial_satellite.png"
    },
    {
        id: "new_horizons",
        type: "spacecraft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
        agencies: ["nasa"],
        radius: 0.0025, // ~2.5m spacecraft dimension (in km)
        distance: 8800000000, // ~8.8 billion km from Earth (~58.8 AU)
        color: "#e5b839", // Gold thermal blanket color
        axis: 2.45, // ~2.45° trajectory inclination relative to ecliptic
        orbit_duration: 0,
        rotate_duration: 0,
        model: "new_horizons.glb",
        icon: "artificial_satellite.png"
    }
]

export default spacecraft
