import { SpaceCraftClass, type SpaceCraft } from "@types"

export const space_craft: SpaceCraft[] = [
    {
        id: "iss",
        type: "space_craft",
        parent: "earth",
        class: SpaceCraftClass.Station,
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
        id: "voyager_1",
        type: "space_craft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
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
        type: "space_craft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
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
        type: "space_craft",
        parent: "earth",
        class: SpaceCraftClass.FlyBy,
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

export default space_craft
