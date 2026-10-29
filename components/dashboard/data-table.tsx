"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchXIcon } from "lucide-react"
import { humanizeColumn } from "@/lib/tables"
import type { Row } from "@/hooks/use-table-data"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar, ALL_VALUES } from "@/components/dashboard/data-table-toolbar"
import { DataTablePagination } from "@/components/dashboard/data-table-pagination"
import { StateMessage } from "@/components/dashboard/state-message"

type SortState = { column: string; direction: "asc" | "desc" } | null

type DataTableProps = {
  rows: Row[]
  quickFilters: string[]
}

function compareValues(a: unknown, b: unknown) {
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), "es", { numeric: true })
}

function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/60">—</span>
  }
  if (typeof value === "number") {
    const formatted = Number.isInteger(value)
      ? String(value)
      : value.toLocaleString("es-CO", { maximumFractionDigits: 4 })
    return <span className="font-mono tabular-nums">{formatted}</span>
  }
  if (typeof value === "object") {
    return <span className="font-mono text-xs">{JSON.stringify(value)}</span>
  }
  return <>{String(value)}</>
}

export function DataTable({ rows, quickFilters }: DataTableProps) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const deferredSearch = useDeferredValue(search)

  const columns = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows])

  const numericColumns = useMemo(
    () => new Set(columns.filter((column) => rows.some((row) => typeof row[column] === "number"))),
    [columns, rows]
  )

  const availableFilters = useMemo(
    () => quickFilters.filter((column) => columns.includes(column)),
    [quickFilters, columns]
  )

  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {}
    for (const column of availableFilters) {
      const values = new Set<string>()
      for (const row of rows) {
        const value = row[column]
        if (value !== null && value !== undefined && value !== "") values.add(String(value))
      }
      options[column] = [...values].sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    }
    return options
  }, [availableFilters, rows])

  const filteredRows = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase()
    const activeFilters = Object.entries(filters).filter(([, value]) => value !== ALL_VALUES)

    const result = rows.filter((row) => {
      for (const [column, value] of activeFilters) {
        if (String(row[column] ?? "") !== value) return false
      }
      if (!term) return true
      return columns.some((column) =>
        String(row[column] ?? "")
          .toLowerCase()
          .includes(term)
      )
    })

    if (sort) {
      const direction = sort.direction === "asc" ? 1 : -1
      result.sort((a, b) => compareValues(a[sort.column], b[sort.column]) * direction)
    }
    return result
  }, [rows, columns, deferredSearch, filters, sort])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const pageRows = filteredRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  function toggleSort(column: string) {
    setSort((current) => {
      if (current?.column !== column) return { column, direction: "asc" }
      if (current.direction === "asc") return { column, direction: "desc" }
      return null
    })
  }

  function resetFilters() {
    setSearch("")
    setFilters({})
    setPage(0)
  }

  const hasActiveFilters =
    search.length > 0 || Object.values(filters).some((value) => value !== ALL_VALUES)

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(0)
        }}
        filters={availableFilters}
        filterOptions={filterOptions}
        filterValues={filters}
        onFilterChange={(column, value) => {
          setFilters((current) => ({ ...current, [column]: value }))
          setPage(0)
        }}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => {
                const isSorted = sort?.column === column
                const SortIcon = !isSorted
                  ? ArrowUpDownIcon
                  : sort.direction === "asc"
                    ? ArrowUpIcon
                    : ArrowDownIcon
                return (
                  <TableHead
                    key={column}
                    aria-sort={
                      isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
                    }
                    className={cn(numericColumns.has(column) && "text-right")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm text-xs font-medium tracking-wide text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                        isSorted && "text-foreground"
                      )}
                    >
                      {humanizeColumn(column)}
                      <SortIcon className={cn("size-3", !isSorted && "opacity-40")} />
                    </button>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length > 0 ? (
              pageRows.map((row, index) => (
                <TableRow key={currentPage * pageSize + index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      className={cn(
                        "max-w-72 truncate",
                        numericColumns.has(column) && "text-right"
                      )}
                    >
                      <CellValue value={row[column]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={Math.max(columns.length, 1)} className="p-4">
                  <StateMessage
                    icon={SearchXIcon}
                    title="Sin resultados"
                    description="Ningún registro coincide con la búsqueda o los filtros aplicados."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        totalRows={filteredRows.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(0)
        }}
      />
    </div>
  )
}
