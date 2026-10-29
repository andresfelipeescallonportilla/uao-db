import { NextResponse } from "next/server"
import { isDatabaseConfigured, query } from "@/lib/db"

export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ status: "not_configured" })
  }

  try {
    const [{ database }] = await query<{ database: string }>("select current_database() as database")
    return NextResponse.json({ status: "connected", database })
  } catch (error) {
    console.error("[api/health]", error)
    return NextResponse.json({ status: "error" })
  }
}
