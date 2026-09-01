import { redirect } from 'next/navigation'
import { CrmApiError } from '@/lib/crm/api'
import { PORTAL_RATE_LIMITED } from './error-digest'

/**
 * Motivo por el que se cerró una sesión desde el servidor. Viaja como
 * `?motivo=` hasta la pantalla de ingreso, que lo traduce a un mensaje.
 */
export type LogoutReason = 'acceso-revocado' | 'clave-cambiada'

/**
 * Envuelve una carga de datos del CRM dentro de una página protegida.
 *
 * Sin esto, un `403` (el admin bajó el kill switch o le sacó el nivel de
 * instalador) y un `429` (el CRM está saturado) caían los dos en el error
 * boundary con el mismo cartel: "Hubo un problema de conexión con el sistema de
 * Kristall". Ninguno de los dos es un problema de conexión, y el 403 además
 * dejaba al Cliente dando vueltas contra un panel que le iba a contestar 403
 * durante las 12 h que dura su cookie.
 *
 *   403 → la cuenta ya no tiene acceso. Se cierra la sesión y se lo manda al
 *         login con el motivo. La cookie hay que borrarla desde un route
 *         handler: una página no puede tocar cookies, y si redirigiéramos al
 *         login con la cookie viva, el login lo rebota de vuelta al dashboard.
 *   401 → la contraseña cambió después de emitida esta sesión (ver
 *         `credentialVersion`). Mismo camino, otro motivo.
 *   429 → transitorio. Se marca el error para que el boundary diga "esperá un
 *         momento" y ofrezca reintentar, que es lo correcto acá.
 */
export async function loadPortalData<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load()
  } catch (err) {
    if (err instanceof CrmApiError) {
      if (err.status === 403) redirect(logoutUrl('acceso-revocado'))
      if (err.status === 401) redirect(logoutUrl('clave-cambiada'))
      if (err.status === 429) {
        const marked = new Error('El sistema de Kristall está recibiendo muchos pedidos')
        ;(marked as Error & { digest?: string }).digest = PORTAL_RATE_LIMITED
        throw marked
      }
    }
    throw err
  }
}

function logoutUrl(reason: LogoutReason): string {
  return `/api/portal/auth/logout?motivo=${reason}`
}
