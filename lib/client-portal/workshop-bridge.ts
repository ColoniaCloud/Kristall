import { NextResponse } from 'next/server'
import { getClientSession, levelOf, type ClientSession } from '@/lib/client-portal/session'

/**
 * Portero de las rutas puente de `/api/portal/workshop/**`.
 *
 * Dos chequeos, y los dos importan:
 *
 *  - **Hay sesión** → si no, 401.
 *  - **La sesión es de nivel INSTALLER** → si no, 403, sin siquiera llamar al
 *    CRM. El CRM igual lo rechazaría (revalida el nivel en cada endpoint), pero
 *    frenarlo acá evita gastar una llamada y, sobre todo, evita que un 403 del
 *    CRM llegue disfrazado de otra cosa.
 *
 * El `contactId` sale **siempre de la cookie firmada**, nunca del body ni de la
 * URL. Es la regla que sostiene todo el puente y la que hay que repetir en cada
 * ruta anidada: sin esto, cambiar un id en una petición muestra el taller del
 * vecino.
 */
export async function requireInstallerSession(): Promise<
  { ok: true; session: ClientSession } | { ok: false; response: NextResponse }
> {
  const session = await getClientSession()
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }
  }
  if (levelOf(session) !== 'INSTALLER') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Tu cuenta no tiene habilitado el portal de instalador' },
        { status: 403 }
      ),
    }
  }
  return { ok: true, session }
}
