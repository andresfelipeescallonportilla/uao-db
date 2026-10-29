"use client"

import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { TABLES, type TableConfig } from "@/lib/tables"
import { useDatabaseHealth, useTableCount } from "@/hooks/use-table-data"
import { Skeleton } from "@/components/ui/skeleton"
import { NotConfiguredMessage } from "@/components/dashboard/state-message"

function TableCard({ table }: { table: TableConfig }) {
  const { data: count, error, isLoading } = useTableCount(table.name)
  const Icon = table.icon

  return (
    <Link
      href={`/tables/${table.name}`}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors outline-none hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">{table.label}</h2>
        <p className="text-sm text-muted-foreground">{table.description}</p>
      </div>
      <div className="mt-auto flex items-baseline justify-between border-t pt-4">
        <span className="font-mono text-xs text-muted-foreground">{table.name}</span>
        {isLoading ? (
          <Skeleton className="h-5 w-16" />
        ) : error ? (
          <span className="text-sm text-destructive">Error</span>
        ) : (
          <span className="text-lg font-semibold tabular-nums">
            {(count ?? 0).toLocaleString("es-CO")}
          </span>
        )}
      </div>
    </Link>
  )
}

export function TablesOverview() {
  const { data: health } = useDatabaseHealth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Resumen</h1>
        <p className="text-sm text-muted-foreground">
          Selecciona una tabla para explorar sus registros.
        </p>
      </div>
      {health?.status !== "not_configured" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TABLES.map((table) => (
            <TableCard key={table.name} table={table} />
          ))}
        </div>
      ) : (
        <NotConfiguredMessage />
      )}
    </div>
  )
}
