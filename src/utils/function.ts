import { Camera, MathUtils, Object3D, Vector3 } from "three"
import { solar_system, alpha_centauri, trappist_1, sagittarius_a, lich, universes, universe_ids } from "@constants"
import { useEffect, useRef, useState } from "react";
import type { Belt, CelestialObject, Landmark } from "@types";
import { useLocation } from "react-router";

export const getUniverseById = (id: string) => {
    const universe = universes.find(universe => universe.id === id)
    return universe ?? universes[0]
}

type UniverseMapping = {
    [key: string]: {
        [key: string]: (CelestialObject | Belt | Landmark)[]
    }
};

const universeMapping: UniverseMapping = {
    sagittarius_a,
    solar_system,
    alpha_centauri,
    "trappist-1": trappist_1,
    lich
}

export const useCelestial = () => {
    const { pathname } = useLocation()
    const targetPos = useRef(new Vector3())

    const currentUniverse = pathname.split("/")[1]

    const objects: (CelestialObject | Belt | Landmark)[] = []

    universe_ids.forEach(universe => {
        if (universe === currentUniverse) {
            const keys = Object.keys(universeMapping[currentUniverse])
            keys.forEach(key => {
                objects.push(...(universeMapping[currentUniverse][key] as (CelestialObject | Belt | Landmark)[]))
            })

        }
    })

    const getObjectById = (id: string) => {
        return objects.find((object) => object.id === id)
    }

    const getObjectsByType = (type: string) => {
        return objects.filter((object) => "type" in object && object.type === type)
    }

    const getCameraDistance = (camera: Camera, object: Object3D, targetRef?: { current: Vector3 }) => {
        object.getWorldPosition(targetRef?.current ?? targetPos.current)
        return camera.position.distanceTo(targetRef?.current ?? targetPos.current)
    }

    const getUniverse = () => getUniverseById(currentUniverse)

    return { objects, getObjectById, getObjectsByType, getCameraDistance, getUniverse }
}


export function useMobile(breakpoint = 768) {
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobile(mediaQuery.matches);

        const handleOnChange = (e: MediaQueryListEvent) => {
            setMobile(e.matches);
        };

        mediaQuery.addEventListener("change", handleOnChange);
        return () => mediaQuery.removeEventListener("change", handleOnChange);
    }, [breakpoint]);

    return isMobile;
}


export const randomNumber = () => {
    const seed = Math.random()
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export const timeFormat = (value: number) => {
    if (value === Infinity) {
        return "∞"
    } else if (value > 730) {
        const year = Math.floor(value / 365)
        const day = Math.round((value / 365 - year) * 365)

        if (year) return `${year} years ${day} days`
        return `${year} years`
    } else if (value <= 0.1) {
        const minute = Math.round((value * 24 * 60))

        return `${minute} minutes`
    } else if (value <= 2) {
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

export const latLngToVector3 = (
    lat: number,
    lon: number,
    lonOffset: number = 0
): Vector3 => {
    const latRad = MathUtils.degToRad(lat)
    const lonRad = MathUtils.degToRad(lon + lonOffset)

    const y = 1.01 * Math.sin(latRad)
    const horizRadius = 1.01 * Math.cos(latRad)

    // Three.js SphereGeometry equirectangular UV texture alignment:
    // lon = 0° (Prime Meridian) -> +X
    // lon = +90° E (Asia / Himalayas) -> -Z
    // lon = -90° W (Americas / Mexico) -> +Z
    const x = horizRadius * Math.cos(lonRad)
    const z = -horizRadius * Math.sin(lonRad)

    return new Vector3(x, y, z)
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

export const seo = ({ title, description }: { title: string, description: string }) => {
    return [
        { title: `${title} | Bimasakti` },
        {
            name: "description",
            content: description,
        },
        {
            name: "keywords",
            content: "milky way, galaxy, space, astronomy, solar system",
        },
        {
            property: "og:title",
            content: `${title} | Bimasakti`,
        },
        {
            property: "og:description",
            content: description,
        },
        {
            property: "og:type",
            content: "website",
        },
    ];
}