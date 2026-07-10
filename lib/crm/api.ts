import { getMockResponse } from './mock-data'

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

type CrmMethod = 'GET' | 'POST' | 'PATCH'

interface CallCrmApiOptions {
  method?: CrmMethod
  /** Se omite solo para GET /api/public/warranty/:token (el único endpoint público sin key). */
  apiKey?: string
  body?: unknown
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

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new CrmApiError(res.status, data)
  return data as T
}

/** Traduce un error de callCrmApi (o cualquier otro) a una Response lista para un route handler. */
export function crmErrorResponse(err: unknown): Response {
  if (err instanceof CrmApiError) {
    return Response.json(err.body ?? { error: err.message }, { status: err.status })
  }
  console.error('[CRM API]', err)
  return Response.json({ error: 'Error de conexión con el CRM' }, { status: 502 })
}
