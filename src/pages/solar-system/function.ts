import { MathUtils } from "three"
import { artificialSatellite, dwarfPlanets, planets, satellites, sun, stars_ac, planets_ac } from "./constants"

export const randomNumber = () => {
    const seed = Math.random()
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export const timeFormat = (value: number) => {
    if (value <= 2) {
        const hour = Math.floor(value * 24)
        const minute = Math.round((value * 24 - hour) * 60)

        if (minute) return `${hour} hours ${minute} minutes`
        return `${hour} hours`
    } else {
        // const day = Math.floor(value * 24)
        // const remain = Math.round(value % 24)

        // if (day > 0 && remain > 0) {
        //     return `${day} days ${remain} hours`
        // } else if (day > 0) {
        //     return `${day} days`
        // } else if (remain > 0) {
        //     return `${remain} hours`
        // }

        return `${value} days`
    }
}

export const lengthFormat = (value: number) => {
    if (value < 1) {
        return `${(value * 1000)?.toLocaleString()} m`
    } else {
        return `${value?.toLocaleString()} km`
    }
}

export const getAllObjects = () => {
    return [sun, ...planets, ...dwarfPlanets, ...satellites, ...artificialSatellite, ...stars_ac, ...planets_ac]
}

export const getObjectById = (id: string, type?: string) => {
    const allObjects = getAllObjects()

    return allObjects.filter((object) => {
        if (type) {
            return object.type === type
        } else {
            return true
        }
    }).find((object) => object.id === id)
}

export const getInitialRotation = () => {
    const deg = randomNumber() * 360
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