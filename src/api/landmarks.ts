import { getDb } from "../server/db.server"
import type { LandmarkRow } from "../server/types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    try {
        const url = new URL(request.url)
        const parent = url.searchParams.get("parent")

        const db = getDb()
        let query = "SELECT * FROM landmarks"
        const params: string[] = []

        if (parent) {
            query += " WHERE parent_id = ?"
            params.push(parent)
        }

        query += " ORDER BY id ASC"

        const rows = db.prepare(query).all(...params) as LandmarkRow[]

        const landmarks = rows.map(l => ({
            id: l.id,
            parent: l.parent_id,
            type: l.type,
            name: l.name ?? undefined,
            icon: l.icon ?? undefined,
            latitude: l.latitude,
            longitude: l.longitude,
            reverse: l.reverse === 1
        }))

        return Response.json({
            success: true,
            total: landmarks.length,
            parent: parent || "all",
            data: landmarks
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json({ success: false, error: message }, { status: 500 })
    }
}
