import { planets } from "./constant"

export const getPlanetById = (id: string) => {
    return planets.find((planet) => planet.id === id)
}

export const getSatelliteById = (id: string) => {
    const planet = planets.find((planet) => planet.satellites.find((satellite) => satellite.id === id))
    const satellite = planet?.satellites.find((satellite) => satellite.id === id)
    return satellite
}