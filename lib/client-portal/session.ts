import { cookies } from 'next/headers'
import { createSessionToken, readSessionToken } from '@/lib/session'

export const CLIENT_SESSION_COOKIE = 'kf_client_session'
const MAX_AGE_SECONDS = 60 * 60 * 12 // 12h

/**
 * Nivel de acceso del Cliente, tal como lo devuelve el CRM al iniciar sesión.
 *
 * `BASIC` — "Panel Clientes": compras, cuenta corriente y notificaciones.
 * `INSTALLER` — suma stock, instalaciones y reclamos. Lo habilita un operador
 * del CRM a mano; no se puede pedir desde acá.
 */
export type AccessLevel = 'BASIC' | 'INSTALLER'

export interface ClientSession {
  contactId: string
  name: string
  company: string
  /**
   * Sirve para armar el menú. NO es la barrera de seguridad: el CRM revalida el
   * nivel en cada endpoint de instalador y responde 403 si no corresponde.
   * Opcional porque las sesiones emitidas antes de agosto 2026 no lo traen —
   * en ese caso se asume `BASIC`, que es lo restrictivo.
   */
  accessLevel?: AccessLevel
}

/** Nivel efectivo de una sesión, tratando las viejas sin nivel como BASIC. */
export function levelOf(session: ClientSession | null): AccessLevel {
  return session?.accessLevel === 'INSTALLER' ? 'INSTALLER' : 'BASIC'
}

export function buildClientSessionCookie(data: ClientSession) {
  return {
    name: CLIENT_SESSION_COOKIE,
    value: createSessionToken(data, MAX_AGE_SECONDS),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      // path '/' (no '/cliente'): las páginas y los route handlers que leen esta
      // cookie viven en árboles de URL distintos (/cliente/* vs /api/portal/*).
      path: '/',
      maxAge: MAX_AGE_SECONDS,
    },
  }
}

export async function getClientSession(): Promise<ClientSession | null> {
  const store = await cookies()
  return readSessionToken<ClientSession>(store.get(CLIENT_SESSION_COOKIE)?.value)
}
