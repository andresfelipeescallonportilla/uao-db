"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { humanizeColumn } from "@/lib/tables"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const ALL_VALUES = "__all__"

type DataTableToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  filters: string[]
  filterOptions: Record<string, string[]>
  filterValues: Record<string, string>
  onFilterChange: (column: string, value: string) => void
  hasActiveFilters: boolean
  onReset: () => void
}

export function DataTableToolbar({
  search,
  onSearchChange,
  filters,
  filterOptions,
  filterValues,
  onFilterChange,
  hasActiveFilters,
  onReset,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative w-full md:max-w-xs">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar en todos los campos..."
          aria-label="Buscar registros"
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((column) => {
          const label = humanizeColumn(column)
          return (
            <Select
              key={column}
              value={filterValues[column] ?? ALL_VALUES}
              onValueChange={(value) => onFilterChange(column, (value as string | null) ?? ALL_VALUES)}
            >
              <SelectTrigger aria-label={`Filtrar por ${label}`} className="min-w-36">
                <SelectValue>
                  {(value: string) => (
                    <span className="truncate">
                      <span className="text-muted-foreground">{label}:</span>{" "}
                      {value === ALL_VALUES ? "Todos" : value}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start" className="max-h-72">
                <SelectItem value={ALL_VALUES}>Todos</SelectItem>
                {(filterOptions[column] ?? []).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <XIcon />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
