import { DatabaseZapIcon, type LucideIcon } from "lucide-react"

type StateMessageProps = {
  icon: LucideIcon
  title: string
  description: React.ReactNode
  tone?: "default" | "error"
}

export function StateMessage({ icon: Icon, title, description, tone = "default" }: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      <div
        className={
          tone === "error"
            ? "flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            : "flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
        }
      >
        <Icon className="size-5" />
      </div>
      <div className="flex max-w-md flex-col gap-1">
        <h2 className="font-medium">{title}</h2>
        <div className="text-sm text-pretty text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

export function NotConfiguredMessage() {
  return (
    <StateMessage
      icon={DatabaseZapIcon}
      title="Conecta tu base de datos"
      description={
        <>
          Define <code className="font-mono text-foreground">DATABASE_URL</code> en el archivo{" "}
          <code className="font-mono text-foreground">.env.local</code> con la cadena de conexión
          de tu PostgreSQL y reinicia el servidor.
        </>
      }
    />
  )
}
