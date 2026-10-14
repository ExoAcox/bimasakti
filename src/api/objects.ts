import { getDb, parseJson } from "../server/db.server"
import type { CelestialObjectRow, Gordilocks } from "../server/types"
import type { Ring } from "@types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    try {
        const url = new URL(request.url)
        const universe = url.searchParams.get("universe")
        const type = url.searchParams.get("type")
        const parent = url.searchParams.get("parent")

        const db = getDb()
        let query = "SELECT * FROM celestial_objects WHERE 1=1"
        const params: (string | number)[] = []

        if (universe) {
            query += " AND universe_id = ?"
            params.push(universe)
        }
        if (type) {
            query += " AND type = ?"
            params.push(type)
        }
        if (parent) {
            query += " AND parent_id = ?"
            params.push(parent)
        }

        query += " ORDER BY order_index ASC"

        const rows = db.prepare(query).all(...params) as CelestialObjectRow[]

        const objects = rows.map(obj => ({
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

        return Response.json({
            success: true,
            total: objects.length,
            filters: { universe, type, parent },
            data: objects
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json({ success: false, error: message }, { status: 500 })
    }
}
