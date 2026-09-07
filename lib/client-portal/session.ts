import { cookies } from 'next/headers'
import { createSessionToken, readSessionToken } from '@/lib/session'

export const CLIENT_SESSION_COOKIE = 'kf_client_session'
const MAX_AGE_SECONDS = 60 * 60 * 12 // 12h

/**
 * Una sesión de demostración dura media hora, no doce.
 *
 * Es tiempo de sobra para recorrer el panel y bastante menos que el de una
 * cuenta real: el taller descartable que hay detrás se borra solo, y una cookie
 * que sobreviva al clon deja a la persona mirando un panel roto.
 */
export const MAX_AGE_DEMO_SECONDS = 60 * 30

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
  /** null cuando el Cliente no tiene razón social cargada — es lo normal en particulares. */
  company: string | null
  /**
   * Sirve para armar el menú. NO es la barrera de seguridad: el CRM revalida el
   * nivel en cada endpoint de instalador y responde 403 si no corresponde.
   * Opcional porque las sesiones emitidas antes de agosto 2026 no lo traen —
   * en ese caso se asume `BASIC`, que es lo restrictivo.
   */
  accessLevel?: AccessLevel
  /**
   * Huella de la contraseña con la que se emitió esta sesión. Viaja en cada
   * llamada al CRM (`x-portal-credential-version`) y el CRM la compara con la
   * contraseña vigente: si el Cliente la cambió, esta sesión queda muerta al
   * instante en vez de seguir válida hasta que venza.
   * Opcional por lo mismo que `accessLevel`: las sesiones emitidas antes de
   * setiembre 2026 no la traen, y el CRM las acepta hasta que venzan.
   */
  credentialVersion?: string
  /**
   * Si esta sesión es del portal de demostración.
   *
   * Hace dos cosas: dibuja la banda de aviso en todas las pantallas, y hace que
   * `callCrmApi` apunte a los espejos `/api/portal/v1/demo/**` del CRM, que son
   * los que resuelven contra la base de demo. El `contactId` de un clon **no
   * existe en producción**, así que sin esto cada pantalla daría 404.
   */
  demo?: true
}

/** Nivel efectivo de una sesión, tratando las viejas sin nivel como BASIC. */
export function levelOf(session: ClientSession | null): AccessLevel {
  return session?.accessLevel === 'INSTALLER' ? 'INSTALLER' : 'BASIC'
}

export function buildClientSessionCookie(data: ClientSession) {
  // Las de demostración vencen antes. Es el mismo mecanismo de siempre: solo
  // cambia cuánto vive la firma.
  const maxAge = data.demo ? MAX_AGE_DEMO_SECONDS : MAX_AGE_SECONDS
  return {
    name: CLIENT_SESSION_COOKIE,
    value: createSessionToken(data, maxAge),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      // path '/' (no '/cliente'): las páginas y los route handlers que leen esta
      // cookie viven en árboles de URL distintos (/cliente/* vs /api/portal/*).
      path: '/',
      maxAge,
    },
  }
}

export async function getClientSession(): Promise<ClientSession | null> {
  const store = await cookies()
  return readSessionToken<ClientSession>(store.get(CLIENT_SESSION_COOKIE)?.value)
}
