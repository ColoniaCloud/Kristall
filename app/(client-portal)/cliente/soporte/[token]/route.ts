import { NextResponse } from 'next/server'
import { supportLogin } from '@/lib/client-portal/api'
import { buildClientSessionCookie, CLIENT_SESSION_COOKIE } from '@/lib/client-portal/session'

/**
 * Entrada de "Entrar como el cliente": alguien de Kristall aprieta el botón en
 * la ficha del CRM, se abre esta URL en otra pestaña, y queda adentro del panel
 * de ese Cliente para configurárselo sin conocer su contraseña.
 *
 * El token sirve una sola vez y vence a los 5 minutos: lo valida y lo consume
 * el CRM. La sesión que sale de acá dura lo que diga el CRM (2 h) y lleva la
 * banda de aviso en todas las pantallas.
 *
 * Redirecciones con Location relativa, por lo mismo que en login-externo:
 * detrás del proxy, `request.url` puede traer el host interno.
 */
function redirigir(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } })
}

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  try {
    const result = await supportLogin(token)
    const cookie = buildClientSessionCookie({
      contactId: result.contactId,
      name: result.name,
      company: result.company,
      accessLevel: result.accessLevel ?? 'BASIC',
      credentialVersion: result.credentialVersion,
      soporte: {
        operador: result.support.operatorName,
        venceEn: result.support.expiresAt,
        activada: result.support.activated,
      },
    })
    const response = redirigir('/cliente/dashboard')
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (err) {
    console.error('[portal soporte]', err)
    // Se borra cualquier sesión que hubiera en este navegador: si quedaba la
    // de otro cliente, el login la tomaría y mandaría al panel equivocado.
    const response = redirigir('/cliente/ingresar?motivo=soporte-link')
    response.cookies.delete(CLIENT_SESSION_COOKIE)
    return response
  }
}
