"use client"

import { usePathname } from "next/navigation"
import { getTableConfig } from "@/lib/tables"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  const pathname = usePathname()
  const tableName = pathname.startsWith("/tables/") ? pathname.split("/")[2] : null
  const table = tableName ? getTableConfig(tableName) : null

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-4" />
      <nav aria-label="Ruta" className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Base de datos</span>
        <span className="text-muted-foreground" aria-hidden="true">
          /
        </span>
        <span className="truncate font-medium">{table ? table.label : "Resumen"}</span>
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
