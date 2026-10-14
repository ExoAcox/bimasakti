import { getDb, parseJson } from "../server/db.server"
import type { BeltRow, CelestialObjectRow, Gordilocks, UniverseRow } from "../server/types"
import type { Ring, Universe } from "@types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ params, request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    const { id } = params
    if (!id) {
        return Response.json({ success: false, error: "Missing universe id" }, { status: 400 })
    }

    try {
        const db = getDb()

        // 1. Get Universe
        const universe = db.prepare("SELECT * FROM universes WHERE id = ?").get(id) as UniverseRow | undefined
        if (!universe) {
            return Response.json({ success: false, error: `Universe '${id}' not found` }, { status: 404 })
        }

        // 2. Get celestial objects for this universe
        const rawObjects = db.prepare(`
            SELECT * FROM celestial_objects 
            WHERE universe_id = ? 
            ORDER BY order_index ASC
        `).all(id) as CelestialObjectRow[]

        const objects = rawObjects.map(obj => ({
            id: obj.id,
            parent: obj.parent_id,
            type: obj.type,
            class: obj.class ?? undefined,
            radius: obj.radius,
            distance: obj.distance,
            longest_distance: obj.longest_distance ?? undefined,
            color: obj.color,
            axis: obj.axis,
            orbit_duration: obj.orbit_duration,
            rotate_duration: obj.rotate_duration,
            min_zoom: obj.min_zoom ?? undefined,
            rotation: parseJson<[number, number, number]>(obj.rotation),
            texture: obj.texture ?? undefined,
            texture_hd: obj.texture_hd ?? undefined,
            night_texture: obj.night_texture ?? undefined,
            cloud_texture: obj.cloud_texture ?? undefined,
            topography_texture: obj.topography_texture ?? undefined,
            atmosphere: obj.atmosphere ?? undefined,
            aurora: obj.aurora ?? undefined,
            intensity: obj.intensity ?? undefined,
            gordilocks: parseJson<Gordilocks>(obj.gordilocks),
            ring: parseJson<Ring>(obj.ring),
            model: obj.model ?? undefined,
            icon: obj.icon ?? undefined,
            agencies: parseJson<string[]>(obj.agencies)
        }))

        // 3. Get Belts if any
        const belts = db.prepare("SELECT * FROM belts WHERE universe_id = ?").all(id) as BeltRow[]

        return Response.json({
            success: true,
            data: {
                id: universe.id,
                image: universe.image,
                position: [universe.position_x, universe.position_y, universe.position_z] as [number, number, number],
                minDistance: universe.min_distance,
                maxDistance: universe.max_distance,
                cameraPosition: [universe.camera_x, universe.camera_y, universe.camera_z] as [number, number, number],
                labelPosition: universe.label_position,
                defaultFocus: universe.default_focus ?? undefined,
                assetCount: universe.asset_count,
                mobile: parseJson<Partial<Universe>>(universe.mobile, {}),
                objects,
                belts
            }
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json({ success: false, error: message }, { status: 500 })
    }
}
