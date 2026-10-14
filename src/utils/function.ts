import { Camera, MathUtils, Object3D, Vector3 } from "three"
import { solar_system, alpha_centauri, trappist_1, lich, toi_700, copernicus, universes, universe_ids } from "@constants"
import { useEffect, useMemo, useRef, useState } from "react";
import type { Belt, CelestialObject, Landmark, Planet, Satellite, Star } from "@types";
import { useLocation } from "react-router";
import { useControlStore } from "@state";

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
    // sagittarius_a,
    solar_system,
    alpha_centauri,
    "trappist-1": trappist_1,
    lich,
    "toi-700": toi_700,
    copernicus
}

export const useCelestial = () => {
    const { pathname } = useLocation()
    const targetPos = useRef(new Vector3())

    const { focus, variant } = useControlStore()
    const currentUniverse = pathname.split("/")[1]

    const objects: (CelestialObject | Belt)[] = []

    universe_ids.forEach(universe => {
        if (universe === "milky_way") return
        if (universe === currentUniverse) {
            const keys = Object.keys(universeMapping[currentUniverse])
            keys.filter(key => key !== "landmarks").forEach(key => {
                if (key === "planets" && focus === "sun" && variant === "red_giant") {
                    return objects.push(...solar_system.planets.slice(3) as Planet[])
                }

                objects.push(...(universeMapping[currentUniverse][key] as (CelestialObject | Belt)[]))
            })

        }
    })

    const getFeaturedObjects = (count = 10) => {
        const objects: CelestialObject[] = []

        universe_ids.forEach(universe => {
            if (universe === "milky_way") return
            const keys = Object.keys(universeMapping[universe])
            keys.filter(key => !["belts", "landmarks"].includes(key)).forEach(key => {
                objects.push(...(universeMapping[universe][key] as (CelestialObject)[]))
            })
        })

        return randomItems(objects, count)


    }

    const getObjectById = (id: string) => {
        return objects.find((object) => object.id === id)
    }

    const isFocused = (id: string) => {
        if (!focus) return false
        return focus === id || (getObjectById(focus) as CelestialObject)?.parent === id
    }

    const getObjectsByType = (type: string) => {
        return objects.filter((object) => "type" in object && object.type === type)
    }

    const getLandmark = (id: string) => {
        return solar_system.landmarks.find((object) => object.id === id)
    }

    const getCameraDistance = (camera: Camera, object: Object3D, targetRef?: { current: Vector3 }) => {
        object.getWorldPosition(targetRef?.current ?? targetPos.current)
        return camera.position.distanceTo(targetRef?.current ?? targetPos.current)
    }

    const getUniverse = () => getUniverseById(currentUniverse)

    return { objects, getObjectById, getObjectsByType, getLandmark, getCameraDistance, getUniverse, getFeaturedObjects, isFocused }
}

export const useVariant = (data: Star | Planet | Satellite) => {
    const { variant } = useControlStore()

    return useMemo(() => {
        if (data && data.variants && variant) {
            const variantData = data.variants?.find((v) => v.variant_id === variant)
            if (variantData) return { ...data, ...variantData }
        }

        return data
    }, [data, variant])
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

export const randomItems = (arr: CelestialObject[], count: number) => {
    // Create a shallow copy to avoid mutating the original array
    const shuffled = [...arr];

    // Fisher-Yates shuffle algorithm (optimized to only shuffle what we need)
    for (let i = shuffled.length - 1; i > shuffled.length - 1 - count; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the last N elements
    return shuffled.slice(-count);
}

export const timeFormat = (value: number) => {
    if (value === Infinity) {
        return "∞"
    } else if (value > 730) {
        const year = Math.floor(value / 365)
        const day = Math.round((value / 365 - year) * 365)

        if (year) return `${year.toLocaleString()} years ${day ? day + " days" : ""}`
        return `${year} years`
    } else if (value <= 0.1) {
        const minute = Math.round((value * 24 * 60))

        return `${minute} minutes`
    } else if (value <= 2) {
        const hour = Math.floor(value * 24)
        const minute = Math.round((value * 24 - hour) * 60)

        if (minute) return `${hour} hours ${minute ? minute + " minutes" : ""}`
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

export const timelineFormat = (value: number) => {
    const absValue = Math.abs(value)
    const suffix = value >= 0 ? "from now" : "ago"

    if (absValue >= 1000000000) {
        const billion = Math.round(absValue / 1000000000)
        return `${billion.toLocaleString()} billion year${billion > 1 ? "s" : ""} ${suffix}`
    } else if (absValue >= 1000000) {
        const million = Math.round(absValue / 1000000)
        return `${million.toLocaleString()} million year${million > 1 ? "s" : ""} ${suffix}`
    } else {
        return `${absValue.toLocaleString()} year${absValue !== 1 ? "s" : ""} ${suffix}`
    }
}

export const userDataFormat = (data: CelestialObject) => {
    return {
        type: data.type,
        radius: data.radius
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

export const seo = ({ title, description }: { title?: string, description?: string }) => {
    const titlePage = title ? `${title} | Bimasakti` : "Bimasakti"
    const descPage = description || "Bimasakti — Explore the Milky Way"

    return [
        { title: titlePage },
        {
            name: "description",
            content: descPage,
        },
        {
            name: "keywords",
            content: "milky way, galaxy, space, astronomy, solar system",
        },
        {
            property: "og:title",
            content: titlePage,
        },
        {
            property: "og:description",
            content: descPage,
        },
        {
            property: "og:type",
            content: "website",
        },
    ];
}

export enum Controls {
    up = "up",
    down = "down",
    left = "left",
    right = "right",
    q = "q",
    e = "e",
    z = "z",
    x = "x",
    c = "c",
    space = "space",
}

export const keyboardMap = [
    { name: Controls.up, keys: ["KeyW", "ArrowUp"] },
    { name: Controls.down, keys: ["KeyS", "ArrowDown"] },
    { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
    { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
    { name: Controls.q, keys: ["KeyQ"] },
    { name: Controls.e, keys: ["KeyE"] },
    { name: Controls.z, keys: ["KeyZ"] },
    { name: Controls.x, keys: ["KeyX"] },
    { name: Controls.c, keys: ["KeyC"] },
    { name: Controls.space, keys: ["Space"] },
]