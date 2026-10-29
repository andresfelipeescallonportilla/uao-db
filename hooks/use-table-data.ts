"use client"

import useSWR from "swr"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client"

export const MAX_ROWS = 1000

export type Row = Record<string, unknown>

type TableData = { rows: Row[]; total: number }

async function fetchTable(table: string): Promise<TableData> {
  const { data, error, count } = await getSupabaseClient()
    .from(table)
    .select("*", { count: "exact" })
    .range(0, MAX_ROWS - 1)

  if (error) throw new Error(error.message)
  return { rows: (data ?? []) as Row[], total: count ?? data?.length ?? 0 }
}

async function fetchCount(table: string): Promise<number> {
  const { count, error } = await getSupabaseClient()
    .from(table)
    .select("*", { count: "exact", head: true })

  if (error) throw new Error(error.message)
  return count ?? 0
}

const swrOptions = { revalidateOnFocus: false, keepPreviousData: false }

export function useTableData(table: string) {
  return useSWR(
    isSupabaseConfigured ? ["table", table] : null,
    ([, name]) => fetchTable(name),
    swrOptions
  )
}

export function useTableCount(table: string) {
  return useSWR(
    isSupabaseConfigured ? ["count", table] : null,
    ([, name]) => fetchCount(name),
    swrOptions
  )
}
