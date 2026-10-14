import { getDb } from "../server/db.server"
import type { NationRow } from "../server/types"
import type { LoaderFunctionArgs } from "react-router"

export async function loader({ request }: LoaderFunctionArgs) {
    if (request.method !== "GET") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    try {
        const db = getDb()
        const nations = db.prepare("SELECT id, latitude, longitude FROM nations ORDER BY id ASC").all() as NationRow[]

        return Response.json({
            success: true,
            total: nations.length,
            data: nations
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred"
        return Response.json({ success: false, error: message }, { status: 500 })
    }
}
