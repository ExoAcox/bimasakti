import { MathUtils } from "three"
import { solar_system, alpha_centauri } from "@constants"
import { useContext } from "react";
import { ControlContext } from "@context";

export const useCelestial = () => {
    const { universe } = useContext(ControlContext)

    let objects = []
    if (universe === "solar-system") {
        const { stars, planets, dwarf_planets, satellites, artificial_satellites } = solar_system
        objects = [...stars, ...planets, ...dwarf_planets, ...satellites, ...artificial_satellites]
    }

    if (universe === "alpha-centauri") {
        const { stars, planets } = alpha_centauri
        objects = [...stars, ...planets]
    }

    const getObjectById = (id: string) => {
        return objects.find((object) => object.id === id)
    }

    const getObjectsByType = (type: string) => {
        return objects.filter((object) => object.type === type)
    }

    return { objects, getObjectById, getObjectsByType }
}

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