import { NextRequest, NextResponse } from 'next/server'
import { confirmEmail } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Puente hacia el CRM para el botón de /cliente/confirmar-email/<token>.
 * `POST { token }` — el email pasa a la ficha del Cliente.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || typeof body.token !== 'string') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const rl = checkRateLimit(`portal-confirmar-email:${clientIp(request)}`, 10, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  try {
    return NextResponse.json(await confirmEmail(body.token))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
