import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Chequeo de salud para el monitor de uptime (Uptime Kuma, UptimeRobot…).
 *
 * Público a propósito: el monitor no tiene sesión. Por eso no devuelve nada que
 * ayude a alguien de afuera — ni versiones, ni mensajes de error, ni nombres de
 * colección: solo «ok» o «caído» por componente. El detalle va a los logs.
 *
 * No toca el CRM: que el CRM esté caído es un problema del CRM y lo detecta el
 * monitor de ese sitio. Si este chequeo dependiera de él, una caída del CRM
 * pondría en rojo también el sitio público, que sigue funcionando.
 *
 * `/api/*` está fuera del matcher de middleware.ts, así que no pasa por i18n ni
 * por el forzado de HTTPS; y como esta ruta es más específica que `[...slug]`,
 * gana sobre el catch-all de Payload.
 */
export const dynamic = 'force-dynamic'

// Más holgado que en el CRM: con `push: true` en payload.config.ts, la primera
// llamada a getPayload tras un arranque sincroniza el schema contra Postgres y
// tarda bastante más que una consulta común. Un monitor que reintenta no debería
// ver un falso «caído» justo después de cada deploy.
const TIMEOUT_MS = 15000

function conTimeout<T>(promesa: Promise<T>): Promise<T> {
  return Promise.race([
    promesa,
    new Promise<never>((_, rechazar) => setTimeout(() => rechazar(new Error('timeout')), TIMEOUT_MS)),
  ])
}

async function chequearBase(): Promise<'ok' | 'caida'> {
  try {
    const payload = await conTimeout(getPayload({ config }))
    // La consulta más barata posible: una fila, sin relaciones. Con Postgres
    // detrás, si la conexión murió esto es lo que lo muestra.
    await conTimeout(payload.find({ collection: 'articles', limit: 1, depth: 0, pagination: false }))
    return 'ok'
  } catch (err) {
    console.error('[API/health] la base no responde', err)
    return 'caida'
  }
}

export async function GET() {
  const db = await chequearBase()
  const ok = db === 'ok'
  return NextResponse.json(
    { status: ok ? 'ok' : 'degraded', checks: { db }, uptimeSeconds: Math.round(process.uptime()) },
    // 503 y no 200: los monitores deciden por el código de estado.
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  )
}
