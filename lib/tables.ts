import {
  ClipboardListIcon,
  DatabaseIcon,
  GitBranchIcon,
  MapPinIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export type TableConfig = {
  name: string
  label: string
  description: string
  icon: LucideIcon
  quickFilters: string[]
}

export const TABLES: TableConfig[] = [
  {
    name: "registered_uao",
    label: "Inscritos",
    description: "Aspirantes inscritos por periodo y programa.",
    icon: ClipboardListIcon,
    quickFilters: ["faculty", "gender", "year"],
  },
  {
    name: "enrolled_uao",
    label: "Matriculados",
    description: "Estudiantes matriculados por periodo.",
    icon: UsersIcon,
    quickFilters: ["faculty", "gender", "year"],
  },
  {
    name: "enrolled_new_uao",
    label: "Matriculados nuevos",
    description: "Primíparos con variables socioeconómicas y clúster.",
    icon: UserPlusIcon,
    quickFilters: ["faculty", "gender", "cluster"],
  },
  {
    name: "deserters_uao",
    label: "Desertores",
    description: "Estudiantes que abandonaron su programa.",
    icon: UserMinusIcon,
    quickFilters: ["faculty", "gender", "year"],
  },
  {
    name: "data_snies",
    label: "Datos SNIES",
    description: "Inscritos y matriculados en IES del país.",
    icon: DatabaseIcon,
    quickFilters: ["ies_sector", "methodology", "year"],
  },
  {
    name: "rules",
    label: "Reglas de asociación",
    description: "Reglas con soporte, confianza y lift.",
    icon: GitBranchIcon,
    quickFilters: ["src", "len_antecedents"],
  },
  {
    name: "cities",
    label: "Ciudades",
    description: "Municipios con código DANE y coordenadas.",
    icon: MapPinIcon,
    quickFilters: ["state"],
  },
]

export function getTableConfig(name: string) {
  return TABLES.find((table) => table.name === name)
}

export function humanizeColumn(column: string) {
  const text = column.replace(/_/g, " ")
  return text.charAt(0).toUpperCase() + text.slice(1)
}
