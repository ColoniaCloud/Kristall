import { NextRequest, NextResponse } from 'next/server'
import { requestPasswordReset, resetPassword } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Puente hacia la recuperación de contraseña del CRM.
 *
 * - `POST { email }` → pedir el mail con el link.
 * - `POST { token, password }` → fijar la contraseña nueva.
 *
 * A diferencia del alta, acá **no se abre sesión** después de cambiarla: el
 * Cliente entra por el login normal. Así el link del mail, por sí solo, nunca
 * alcanza para quedar adentro de la cuenta.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const rl = checkRateLimit(`portal-recuperar:${clientIp(request)}`, 10, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const { email, token, password } = body as Record<string, string | undefined>

  try {
    if (email && !token) {
      return NextResponse.json(await requestPasswordReset(email))
    }
    if (token && password) {
      return NextResponse.json(await resetPassword({ token, password }))
    }
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
