import { getDb, parseJson } from "../server/db.server"
import type { UniverseRow } from "../server/types"
import type { Universe } from "@types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    try {
        const db = getDb()
        const rows = db.prepare("SELECT * FROM universes ORDER BY order_index ASC").all() as UniverseRow[]

        const universes = rows.map(u => ({
            id: u.id,
            image: u.image,
            position: [u.position_x, u.position_y, u.position_z] as [number, number, number],
            minDistance: u.min_distance,
            maxDistance: u.max_distance,
            cameraPosition: [u.camera_x, u.camera_y, u.camera_z] as [number, number, number],
            labelPosition: u.label_position,
            defaultFocus: u.default_focus ?? undefined,
            assetCount: u.asset_count,
            mobile: parseJson<Partial<Universe>>(u.mobile, {})
        }))

        return Response.json({
            success: true,
            total: universes.length,
            data: universes
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json(
            { success: false, error: message },
            { status: 500 }
        )
    }
}
