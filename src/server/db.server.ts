import Database from "better-sqlite3"
import path from "path"

let dbInstance: Database.Database | null = null

export const getDb = (): Database.Database => {
    if (!dbInstance) {
        const dbPath = path.resolve(process.cwd(), "src/server/bimasakti.db")
        dbInstance = new Database(dbPath, { readonly: true })
        dbInstance.pragma("foreign_keys = ON")
    }
    return dbInstance
}

export function parseJson<T>(val: string | null | undefined): T | undefined
export function parseJson<T>(val: string | null | undefined, fallback: T): T
export function parseJson<T>(val: string | null | undefined, fallback?: T): T | undefined {
    if (!val) return fallback
    try {
        return JSON.parse(val) as T
    } catch {
        return fallback
    }
}
