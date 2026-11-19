import { NextResponse } from 'next/server'

/**
 * Chequeo de vida («liveness») del proceso: ¿este contenedor puede contestar HTTP?
 *
 * A propósito NO toca la base ni el CRM. Es el chequeo que mira Docker
 * (`healthcheck` en docker-compose.yml del VPS), y de él depende que Traefik
 * publique el router del dominio: el provider Docker de Traefik ignora los
 * contenedores `unhealthy`, así que un chequeo que consulte Postgres hace que una
 * caída de la base borre kristallfilm.com entero y Traefik conteste su 404 por
 * defecto — incluso en `/cliente/*` y `/garantia/*`, que van al CRM y no usan
 * Payload. Pasó el 2026-11-18: Neon cortó las consultas por cuota y el sitio
 * desapareció durante 14 h.
 *
 * El chequeo que sí mira la base es `/api/health` («readiness»): ese es el que
 * vigila el monitor de uptime, y el que debe ponerse en rojo cuando Postgres no
 * responde.
 *
 * `/api/*` está fuera del matcher de middleware.ts (sin i18n ni forzado de HTTPS)
 * y esta ruta, al ser más específica, gana sobre el catch-all `/api/[...slug]` de
 * Payload.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    { status: 'ok', uptimeSeconds: Math.round(process.uptime()) },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  )
}
