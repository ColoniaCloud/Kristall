import { NextRequest, NextResponse } from 'next/server'
import { requestActivation, activateAccount } from '@/lib/client-portal/api'
import { buildClientSessionCookie } from '@/lib/client-portal/session'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Puente hacia el alta de cuenta del CRM.
 *
 * - `POST { email }` → paso 1: pedir el mail con el link.
 * - `POST { token, password, whatsapp? }` → paso 2: crear la cuenta y abrir sesión.
 *
 * El límite de intentos de acá es además del que aplica el CRM: este es por IP,
 * el del CRM es por email. Uno frena a alguien que prueba muchos emails desde
 * una misma máquina; el otro, a muchos que atacan la misma cuenta.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const rl = checkRateLimit(`portal-activar:${clientIp(request)}`, 10, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const { email, token, password, whatsapp } = body as Record<string, string | undefined>

  try {
    // Paso 1: pedir el mail.
    if (email && !token) {
      return NextResponse.json(await requestActivation(email))
    }

    // Paso 2: crear la cuenta y dejar al Cliente adentro, sin pedirle que
    // vuelva a escribir la contraseña que acaba de elegir.
    if (token && password) {
      const result = await activateAccount({
        token,
        password,
        ...(whatsapp ? { whatsapp } : {}),
      })
      const cookie = buildClientSessionCookie({
        contactId: result.contactId,
        name: result.name,
        company: result.company,
        accessLevel: result.accessLevel ?? 'BASIC',
      })
      const response = NextResponse.json({ ok: true, name: result.name })
      response.cookies.set(cookie.name, cookie.value, cookie.options)
      return response
    }

    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
