# UAO Data — Explorador de base de datos

Dashboard en Next.js para navegar por las tablas de la base de datos UAO. Los datos se consultan en el servidor
(`app/api/tables/[table]`) con el driver `pg`, por lo que funciona igual contra un PostgreSQL local (pgAdmin 4)
que contra Supabase. Ninguna credencial llega al navegador.

## Requisitos

- [Node.js](https://nodejs.org) 20.9 o superior
- [pnpm](https://pnpm.io) (`npm install -g pnpm` o `corepack enable`)
- PostgreSQL en ejecución (el servidor que administras con pgAdmin 4)

## 1. Obtener el código

```bash
git clone https://github.com/andresfelipeescallonportilla/uao-db.git
cd uao-db
pnpm install
```

## 2. Preparar la base de datos local

El dashboard espera estas tablas en el esquema `public` (se configuran en `lib/tables.ts`):

`registered_uao`, `enrolled_uao`, `enrolled_new_uao`, `deserters_uao`, `data_snies`, `rules`, `cities`

Si ya existen en tu servidor local, pasa al paso 3. Si aún no las tienes, puedes copiar los datos desde Supabase:

```bash
# Exportar desde Supabase (usa la cadena de conexión directa de tu proyecto)
pg_dump "postgresql://postgres:CONTRASEÑA@db.<proyecto>.supabase.co:5432/postgres" \
  --schema=public --no-owner --no-privileges -f uao_db.sql

# Crear la base local e importar
createdb -U postgres uao_db
psql -U postgres -d uao_db -f uao_db.sql
```

También puedes hacerlo desde pgAdmin 4: clic derecho en **Databases → Create → Database** (`uao_db`) y luego
clic derecho sobre la nueva base → **Restore…** o abre el **Query Tool** y ejecuta el archivo `.sql`.

## 3. Configurar la conexión

```bash
cp .env.example .env.local
```

Edita `.env.local` con los datos de tu servidor (los mismos que usas para conectarte en pgAdmin 4:
pestaña **Connection** de las propiedades del servidor):

```env
DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/uao_db
```

| Variable          | Descripción                                               | Por defecto |
| ----------------- | --------------------------------------------------------- | ----------- |
| `DATABASE_URL`    | Cadena de conexión de PostgreSQL                          | —           |
| `DATABASE_SCHEMA` | Esquema donde están las tablas                            | `public`    |
| `DATABASE_SSL`    | `true` para forzar SSL (un servidor local no suele usarlo) | `false`     |

Si la contraseña contiene caracteres especiales, codifícalos en la URL (`@` → `%40`, `#` → `%23`, `:` → `%3A`).

## 4. Ejecutar

```bash
pnpm dev          # modo desarrollo en http://localhost:3000
```

Para un despliegue local de producción:

```bash
pnpm build
pnpm start        # http://localhost:3000  (usa PORT=4000 pnpm start para otro puerto)
```

> `pnpm start` lee `.env.local` automáticamente. Si despliegas en otro servidor, define las variables en su entorno.

El indicador en la parte inferior de la barra lateral muestra si la conexión funciona (`Conectado a uao_db`).

## Solución de problemas

| Síntoma                                    | Causa probable                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| "Base de datos sin configurar"             | Falta `DATABASE_URL` en `.env.local`, o no reiniciaste `pnpm dev` tras editarlo |
| `ECONNREFUSED 127.0.0.1:5432`              | PostgreSQL no está en ejecución o usa otro puerto                               |
| `password authentication failed`           | Usuario o contraseña incorrectos en `DATABASE_URL`                              |
| `relation "public.xxx" does not exist`     | La tabla no existe en esa base o esquema (revisa `DATABASE_SCHEMA`)             |
| `The server does not support SSL`          | Quita `?sslmode=...` de la URL o define `DATABASE_SSL=false`                    |

## Producción en Vercel

En Vercel no hace falta `DATABASE_URL`: si no está definida se usa `POSTGRES_URL`, que la integración de
Supabase ya inyecta. Si defines `DATABASE_URL` en Vercel, tiene prioridad.
