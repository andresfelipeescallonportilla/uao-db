import { NextResponse } from "next/server"
import { DatabaseNotConfiguredError, qualifiedTable, query } from "@/lib/db"
import { getTableConfig } from "@/lib/tables"

export const MAX_ROWS = 1000

export async function GET(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params

  if (!getTableConfig(table)) {
    return NextResponse.json({ error: "Tabla no encontrada." }, { status: 404 })
  }

  const countOnly = new URL(request.url).searchParams.get("count") === "1"

  try {
    const target = qualifiedTable(table)
    const [{ total }] = await query<{ total: number }>(`select count(*) as total from ${target}`)

    if (countOnly) return NextResponse.json({ total })

    const rows = await query(`select * from ${target} limit $1`, [MAX_ROWS])
    return NextResponse.json({ rows, total })
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return NextResponse.json({ error: error.message, code: "NOT_CONFIGURED" }, { status: 503 })
    }
    console.error(`[api/tables/${table}]`, error)
    const message = error instanceof Error ? error.message : "Error inesperado."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
