import { cookies } from 'next/headers'
import { getMockResponse } from './mock-data'
import { CLIENT_SESSION_COOKIE, type ClientSession } from '@/lib/client-portal/session'
import { readSessionToken } from '@/lib/session'

export class CrmApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `CRM API error ${status}`
    super(message)
    this.status = status
    this.body = body
  }
}

const CRM_TIMEOUT_MS = 10_000

type CrmMethod = 'GET' | 'POST' | 'PATCH'

interface CallCrmApiOptions {
  method?: CrmMethod
  /** Se omite solo para GET /api/public/warranty/:token (el único endpoint público sin key). */
  apiKey?: string
  body?: unknown
  /**
   * Marca las llamadas que se hacen EN NOMBRE de un Cliente logueado (todo
   * /api/portal/v1/contacts/**). Adjunta `x-portal-credential-version`, que el
   * CRM compara contra la contraseña vigente: si el Cliente la cambió después
   * de emitida esta sesión, responde 401 y la cookie deja de servir en el acto
   * en vez de sobrevivir hasta 12 h. Ver lib/portal-credentials.ts en el CRM.
   */
  portalSession?: boolean
}

/** Versión de credencial de la sesión activa, si hay uno logueado. */
async function credentialVersionHeader(): Promise<string | null> {
  try {
    const store = await cookies()
    const session = readSessionToken<ClientSession>(store.get(CLIENT_SESSION_COOKIE)?.value)
    return session?.credentialVersion ?? null
  } catch {
    // cookies() tira fuera del scope de un request. No es un error: significa
    // que no hay sesión que verificar.
    return null
  }
}

/**
 * Único punto que le pega al CRM externo. En CRM_MOCK=1 devuelve fixtures de
 * lib/crm/mock-data.ts en vez de hacer fetch real, sin cambiar la firma —
 * los callers no se enteran del modo mock.
 */
export async function callCrmApi<T>(path: string, options: CallCrmApiOptions = {}): Promise<T> {
  const method = options.method ?? 'GET'

  if (process.env.CRM_MOCK === '1') {
    const mock = getMockResponse(path, method, options.body)
    if (mock.status >= 400) throw new CrmApiError(mock.status, mock.data)
    return mock.data as T
  }

  const baseUrl = process.env.CRM_BASE_URL
  if (!baseUrl) throw new Error('Missing CRM_BASE_URL')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options.apiKey) headers['x-api-key'] = options.apiKey
  if (options.portalSession) {
    const version = await credentialVersionHeader()
    if (version) headers['x-portal-credential-version'] = version
  }

  // Sin timeout, un CRM colgado cuelga las páginas del panel hasta que corte
  // la plataforma. 10s es holgado para la consulta más pesada (el perfil con
  // compras y pagos) y corto frente a la paciencia de una persona.
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new CrmApiError(res.status, data)
  return data as T
}

/**
 * Traduce un error de callCrmApi (o cualquier otro) a una Response lista para un
 * route handler.
 *
 * Reenvía **solo** `{ error }`, nunca el body completo del CRM. El body puede
 * traer campos pensados para quien opera y no para el navegador: el 502 de
 * `request-activation`, por ejemplo, adjunta un `diagnostico` con el código de
 * error de SMTP y el primer renglón del mensaje del servidor de mail. Eso
 * terminaba entero en la respuesta HTTP del sitio público.
 */
export function crmErrorResponse(err: unknown): Response {
  if (err instanceof CrmApiError) {
    const body = err.body
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : err.message
    return Response.json({ error: message }, { status: err.status })
  }
  console.error('[CRM API]', err)
  return Response.json({ error: 'Error de conexión con el CRM' }, { status: 502 })
}
