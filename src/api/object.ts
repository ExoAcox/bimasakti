import { getDb, parseJson } from "../server/db.server"
import type { CelestialObjectRow, Gordilocks, LandmarkRow, VariantRow } from "../server/types"
import type { Ring } from "@types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ params, request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    const { id } = params
    if (!id) {
        return Response.json({ success: false, error: "Missing object id" }, { status: 400 })
    }

    try {
        const db = getDb()

        // 1. Get the object itself
        const obj = db.prepare("SELECT * FROM celestial_objects WHERE id = ?").get(id) as CelestialObjectRow | undefined
        if (!obj) {
            return Response.json({ success: false, error: `Celestial object '${id}' not found` }, { status: 404 })
        }

        // 2. Get children satellites / spacecraft (where parent_id = id)
        const children = db.prepare(`
            SELECT * FROM celestial_objects 
            WHERE parent_id = ? 
            ORDER BY order_index ASC
        `).all(id) as CelestialObjectRow[]

        // 3. Get landmarks
        const landmarks = db.prepare(`
            SELECT * FROM landmarks 
            WHERE parent_id = ? 
            ORDER BY id ASC
        `).all(id) as LandmarkRow[]

        // 4. Get variants
        const rawVariants = db.prepare(`
            SELECT * FROM variants 
            WHERE parent_id = ? 
            ORDER BY order_val ASC
        `).all(id) as VariantRow[]

        const variants = rawVariants.map(v => ({
            variant_id: v.variant_id,
            order: v.order_val,
            class: v.class ?? undefined,
            radius: v.radius ?? undefined,
            color: v.color ?? undefined,
            intensity: v.intensity ?? undefined,
            gordilocks: parseJson<Gordilocks>(v.gordilocks),
            texture: v.texture ?? undefined,
            texture_hd: v.texture_hd ?? undefined,
            night_texture: v.night_texture ?? undefined,
            topography_texture: v.topography_texture ?? undefined,
            cloud_texture: v.cloud_texture ?? undefined,
            aurora: v.aurora ?? undefined,
            icon: v.icon ?? undefined,
            landmarks: parseJson<unknown[]>(v.landmarks),
            artificial_satellites: parseJson<unknown[]>(v.artificial_satellites)
        }))

        return Response.json({
            success: true,
            data: {
                id: obj.id,
                universe: obj.universe_id,
                parent: obj.parent_id,
                type: obj.type,
                class: obj.class ?? undefined,
                radius: obj.radius,
                distance: obj.distance,
                longest_distance: obj.longest_distance ?? undefined,
                color: obj.color,
                axis: obj.axis,
                tidalAxis: obj.tidal_axis ?? undefined,
                orbit_duration: obj.orbit_duration,
                rotate_duration: obj.rotate_duration,
                min_zoom: obj.min_zoom ?? undefined,
                rotation: parseJson<[number, number, number]>(obj.rotation),
                texture: obj.texture ?? undefined,
                texture_hd: obj.texture_hd ?? undefined,
                night_texture: obj.night_texture ?? undefined,
                night_texture_hd: obj.night_texture_hd ?? undefined,
                night_opacity: obj.night_opacity ?? undefined,
                cloud_texture: obj.cloud_texture ?? undefined,
                cloud_opacity: obj.cloud_opacity ?? undefined,
                topography_texture: obj.topography_texture ?? undefined,
                atmosphere: obj.atmosphere ?? undefined,
                aurora: obj.aurora ?? undefined,
                intensity: obj.intensity ?? undefined,
                gordilocks: parseJson<Gordilocks>(obj.gordilocks),
                ring: parseJson<Ring>(obj.ring),
                model: obj.model ?? undefined,
                icon: obj.icon ?? undefined,
                agencies: parseJson<string[]>(obj.agencies),
                children: children.map(c => ({
                    id: c.id,
                    type: c.type,
                    class: c.class ?? undefined,
                    radius: c.radius,
                    distance: c.distance,
                    color: c.color,
                    orbit_duration: c.orbit_duration,
                    icon: c.icon ?? undefined
                })),
                landmarks: landmarks.map(l => ({
                    id: l.id,
                    type: l.type,
                    name: l.name ?? undefined,
                    icon: l.icon ?? undefined,
                    latitude: l.latitude,
                    longitude: l.longitude,
                    reverse: l.reverse === 1
                })),
                variants
            }
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json({ success: false, error: message }, { status: 500 })
    }
}
