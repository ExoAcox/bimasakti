import { Camera, MathUtils, Object3D, Vector3 } from "three"
import { solar_system, alpha_centauri, universes } from "@constants"
import { useRef } from "react";
import { useControlStore } from "@state";

export const getUniverseById = (id: string) => {
    return universes.find(universe => universe.id === id)
}

export const useCelestial = () => {
    const universe = useControlStore((state) => state.universe)
    const targetPos = useRef(new Vector3())

    let objects = []
    if (universe === "solar_system") {
        const { stars, planets, dwarf_planets, satellites, artificial_satellites } = solar_system
        objects = [...stars, ...planets, ...dwarf_planets, ...satellites, ...artificial_satellites]
    }

    if (universe === "alpha_centauri") {
        const { stars, planets } = alpha_centauri
        objects = [...stars, ...planets]
    }

    const getObjectById = (id: string) => {
        return objects.find((object) => object.id === id)
    }

    const getObjectsByType = (type: string) => {
        return objects.filter((object) => object.type === type)
    }

    const getCameraDistance = (camera: Camera, object: Object3D, targetRef?: { current: Vector3 }) => {
        object.getWorldPosition(targetRef?.current ?? targetPos.current)
        return camera.position.distanceTo(targetRef?.current ?? targetPos.current)
    }

    const getCurrentUniverse = () => getUniverseById(universe)

    return { objects, getObjectById, getObjectsByType, getCameraDistance, getCurrentUniverse }
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

export const classPosition = (position: "top" | "bottom" | "left" | "right") => {
    let root = ""
    let parent = ""
    let line = ""

    if (position === "top") {
        root = "-translate-x-1/2 -translate-y-full"
        parent = "flex-col items-center"
        line = "h-3 w-px"
    }

    if (position === "bottom") {
        root = "-translate-x-1/2 translate-y-full"
        parent = "flex-col-reverse items-center"
        line = "h-3 w-px"
    }

    if (position === "right") {
        root = "-translate-y-1/2"
        parent = "flex-row-reverse items-center"
        line = "h-px w-3"
    }

    if (position === "left") {
        root = "-translate-x-full translate-y-1/2"
        parent = "flex-row items-center"
        line = "h-px w-3"
    }

    return { root, parent, line }
}