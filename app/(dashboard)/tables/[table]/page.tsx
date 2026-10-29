import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TABLES, getTableConfig } from "@/lib/tables"
import { TableView } from "@/components/dashboard/table-view"

type PageProps = { params: Promise<{ table: string }> }

export function generateStaticParams() {
  return TABLES.map((table) => ({ table: table.name }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { table } = await params
  const config = getTableConfig(table)
  return { title: config ? `${config.label} · UAO Data` : "Tabla no encontrada" }
}

export default async function TablePage({ params }: PageProps) {
  const { table } = await params
  if (!getTableConfig(table)) notFound()
  return <TableView tableName={table} />
}
