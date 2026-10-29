"use client"

import { AlertTriangleIcon, InfoIcon, RefreshCwIcon } from "lucide-react"
import { getTableConfig } from "@/lib/tables"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { MAX_ROWS, useTableData } from "@/hooks/use-table-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/dashboard/data-table"
import { NotConfiguredMessage, StateMessage } from "@/components/dashboard/state-message"

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando registros">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="flex flex-col gap-px overflow-hidden rounded-xl border">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-10 rounded-none" />
        ))}
      </div>
    </div>
  )
}

export function TableView({ tableName }: { tableName: string }) {
  const config = getTableConfig(tableName)
  const { data, error, isLoading, isValidating, mutate } = useTableData(tableName)

  if (!config) return null
  const Icon = config.icon
  const isTruncated = data ? data.total > data.rows.length : false

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-balance">{config.label}</h1>
              <Badge variant="secondary" className="font-mono">
                {config.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        {isSupabaseConfigured && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            disabled={isValidating}
          >
            <RefreshCwIcon className={isValidating ? "animate-spin" : undefined} />
            Actualizar
          </Button>
        )}
      </div>

      {!isSupabaseConfigured ? (
        <NotConfiguredMessage />
      ) : isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <StateMessage
          icon={AlertTriangleIcon}
          tone="error"
          title="No se pudieron cargar los datos"
          description={error.message}
        />
      ) : data && data.rows.length > 0 ? (
        <>
          {isTruncated && (
            <div className="flex items-start gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              <InfoIcon className="mt-0.5 size-4 shrink-0" />
              <p>
                Mostrando los primeros {MAX_ROWS.toLocaleString("es-CO")} de{" "}
                <span className="font-medium text-foreground">
                  {data.total.toLocaleString("es-CO")}
                </span>{" "}
                registros. La búsqueda, los filtros y la paginación se aplican sobre esta muestra.
              </p>
            </div>
          )}
          <DataTable key={tableName} rows={data.rows} quickFilters={config.quickFilters} />
        </>
      ) : (
        <StateMessage
          icon={InfoIcon}
          title="Tabla vacía"
          description="Esta tabla no tiene registros visibles con las credenciales actuales."
        />
      )}
    </div>
  )
}
