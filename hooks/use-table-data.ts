"use client"

import useSWR from "swr"

export const MAX_ROWS = 1000

export type Row = Record<string, unknown>

type TableData = { rows: Row[]; total: number }

export type HealthStatus =
  | { status: "connected"; database: string }
  | { status: "not_configured" | "error" }

export class ApiError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.code = code
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(body.error ?? `Error ${response.status}`, body.code)
  }
  return body as T
}

export function isNotConfigured(error: unknown) {
  return error instanceof ApiError && error.code === "NOT_CONFIGURED"
}

const swrOptions = { revalidateOnFocus: false, shouldRetryOnError: false }

export function useTableData(table: string) {
  return useSWR<TableData, ApiError>(`/api/tables/${table}`, fetchJson, swrOptions)
}

export function useTableCount(table: string) {
  return useSWR<number, ApiError>(
    `/api/tables/${table}?count=1`,
    async (url: string) => (await fetchJson<{ total: number }>(url)).total,
    swrOptions
  )
}

export function useDatabaseHealth() {
  return useSWR<HealthStatus>("/api/health", fetchJson, swrOptions)
}
