import "server-only"
import { Pool, types } from "pg"

// Return JSON-friendly values: int8/numeric as numbers, DATE as "YYYY-MM-DD" text.
types.setTypeParser(types.builtins.INT8, (value) => Number(value))
types.setTypeParser(types.builtins.NUMERIC, (value) => Number.parseFloat(value))
types.setTypeParser(types.builtins.DATE, (value) => value)

// DATABASE_URL is used locally (pgAdmin / PostgreSQL); POSTGRES_URL is injected by the Supabase integration on Vercel.
const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL

const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/
const schemaName = process.env.DATABASE_SCHEMA ?? "public"

export const isDatabaseConfigured = Boolean(connectionString)

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Falta la variable de entorno DATABASE_URL.")
  }
}

function buildPool(url: string) {
  const parsed = new URL(url)
  const sslMode = parsed.searchParams.get("sslmode")
  // pg treats sslmode=require as verify-full, which rejects Supabase's pooler certificate.
  parsed.searchParams.delete("sslmode")

  const useSsl =
    process.env.DATABASE_SSL === "true" ||
    (process.env.DATABASE_SSL !== "false" && sslMode !== null && sslMode !== "disable")

  return new Pool({
    connectionString: parsed.toString(),
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  })
}

const globalForDb = globalThis as unknown as { pgPool?: Pool }

function getPool() {
  if (!connectionString) throw new DatabaseNotConfiguredError()
  if (!globalForDb.pgPool) globalForDb.pgPool = buildPool(connectionString)
  return globalForDb.pgPool
}

export function qualifiedTable(table: string) {
  if (!IDENTIFIER.test(table) || !IDENTIFIER.test(schemaName)) {
    throw new Error("Nombre de tabla o esquema no válido.")
  }
  return `"${schemaName}"."${table}"`
}

export async function query<T extends Record<string, unknown>>(text: string, values: unknown[] = []) {
  const result = await getPool().query<T>(text, values)
  return result.rows
}
