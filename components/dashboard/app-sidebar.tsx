"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGridIcon, TableIcon } from "lucide-react"
import { TABLES } from "@/lib/tables"
import { useDatabaseHealth } from "@/hooks/use-table-data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const STATUS_STYLES = {
  connected: "bg-emerald-500",
  not_configured: "bg-amber-500",
  error: "bg-destructive",
  loading: "bg-muted-foreground/40",
} as const

function ConnectionStatus() {
  const { data } = useDatabaseHealth()
  const status = data?.status ?? "loading"
  const label =
    data?.status === "connected"
      ? `Conectado a ${data.database}`
      : status === "not_configured"
        ? "Base de datos sin configurar"
        : status === "error"
          ? "Sin conexión a la base de datos"
          : "Comprobando conexión…"

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      role="status"
      title={label}
    >
      <span className={`size-2 shrink-0 rounded-full ${STATUS_STYLES[status]}`} aria-hidden="true" />
      <span className="truncate group-data-[collapsible=icon]:sr-only">{label}</span>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TableIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">UAO Data</span>
                <span className="text-xs text-muted-foreground">Explorador</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  tooltip="Resumen"
                  render={<Link href="/" />}
                >
                  <LayoutGridIcon />
                  <span>Resumen</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tablas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TABLES.map((table) => {
                const href = `/tables/${table.name}`
                return (
                  <SidebarMenuItem key={table.name}>
                    <SidebarMenuButton
                      isActive={pathname === href}
                      tooltip={table.label}
                      render={<Link href={href} />}
                    >
                      <table.icon />
                      <span>{table.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ConnectionStatus />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
