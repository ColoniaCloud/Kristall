import { NextRequest, NextResponse } from 'next/server'
import { loginClient } from '@/lib/client-portal/api'
import { buildClientSessionCookie } from '@/lib/client-portal/session'
import { CrmApiError } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Login del Panel de Cliente desde otro sitio nuestro (hoy polariz.ar/mi-cuenta).
 *
 * Es un <form method="post"> común que navega hasta acá, no un fetch: así la
 * cookie de sesión queda en kristallfilm.com sin abrir CORS en la API del
 * portal. Termina siempre en una redirección: al panel si entró, o de vuelta
 * al formulario con `?error=` si no.
 *
 * Solo acepta pedidos de los orígenes de abajo. Sin ese control cualquier
 * página podría postear acá con una cuenta ajena y dejar al visitante metido
 * en el panel de otro (login CSRF). Un origen desconocido recibe un 403 seco:
 * nunca se redirige a un sitio que no está en la lista.
 */
const ORIGENES_PERMITIDOS = ['https://polariz.ar', 'https://www.polariz.ar']
// polarizar en `npm run dev` (ver .claude/launch.json en la raíz).
const ORIGENES_DESARROLLO = ['http://localhost:3004']

/** Dónde vive el formulario en cada sitio de origen. */
const RUTA_FORMULARIO = '/mi-cuenta'

function origenPermitido(origin: string | null): origin is string {
  if (!origin) return false
  if (ORIGENES_PERMITIDOS.includes(origin)) return true
  return process.env.NODE_ENV !== 'production' && ORIGENES_DESARROLLO.includes(origin)
}

/**
 * 303 para que el navegador siga con GET. Location relativa a propósito: detrás
 * del proxy de Hostinger `request.url` puede traer el host interno, y una ruta
 * relativa el navegador la resuelve contra kristallfilm.com, que es donde está.
 */
function redirigir(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } })
}

function volverConError(origin: string, error: string) {
  return redirigir(`${origin}${RUTA_FORMULARIO}?error=${error}`)
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origenPermitido(origin)) {
    return new NextResponse('Origen no permitido', { status: 403 })
  }

  const form = await request.formData().catch(() => null)
  const email = form?.get('email')
  const password = form?.get('password')
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return volverConError(origin, 'datos')
  }

  // Misma clave que /api/portal/auth/login: los dos formularios comparten el
  // cupo de intentos por IP, no lo duplican.
  const rl = checkRateLimit(`portal-login:${clientIp(request)}`, 5, 15 * 60)
  if (!rl.ok) return volverConError(origin, 'intentos')

  try {
    const result = await loginClient(email.trim(), password)
    const cookie = buildClientSessionCookie({
      contactId: result.contactId,
      name: result.name,
      company: result.company,
      accessLevel: result.accessLevel ?? 'BASIC',
      credentialVersion: result.credentialVersion,
    })
    const response = redirigir('/cliente/dashboard')
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (err) {
    if (err instanceof CrmApiError && err.status === 401) return volverConError(origin, 'credenciales')
    if (err instanceof CrmApiError && err.status === 429) return volverConError(origin, 'intentos')
    console.error('[portal login externo]', err)
    return volverConError(origin, 'conexion')
  }
}
