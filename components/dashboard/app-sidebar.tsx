"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGridIcon, TableIcon } from "lucide-react"
import { TABLES } from "@/lib/tables"
import { isSupabaseConfigured } from "@/lib/supabase/client"
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
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span
            className={
              isSupabaseConfigured
                ? "size-2 shrink-0 rounded-full bg-emerald-500"
                : "size-2 shrink-0 rounded-full bg-amber-500"
            }
            aria-hidden="true"
          />
          <span className="group-data-[collapsible=icon]:hidden">
            {isSupabaseConfigured ? "Supabase conectado" : "Supabase sin configurar"}
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
