import { MathUtils } from "three"
import { planets, sun } from "./constant"

export const getObjectById = (id: string, type?: string) => {
    const allObjects = [sun, ...planets, ...planets.flatMap(planet => planet.satellites)]

    return allObjects.filter((object) => {
        if (type) {
            return object.type === type
        } else {
            return true
        }
    }).find((object) => object.id === id)
}


export const getParentPlanet = (id: string) => {
    return planets.find((planet) => planet.satellites.find((satellite) => satellite.id === id))
}

export const getInitialRotation = (id: string) => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const deg = Math.abs(hash) % 361
    return MathUtils.degToRad(deg)
}

export const calculateSatelliteDistance = (distance: number, scale: number, parentRadius: number, index: number) => {
    const rawVisualDistance = distance / scale;
    const visualPlanetRadius = parentRadius;

    const orbitGap = 0.25;
    const safeMinimumDistance = (visualPlanetRadius * 2.0) + (index * orbitGap);

    if (scale <= 1000000) {
        return Math.max(rawVisualDistance, safeMinimumDistance);
    }

    return Math.max(rawVisualDistance, safeMinimumDistance);
}