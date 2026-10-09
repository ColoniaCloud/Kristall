import { NextRequest, NextResponse } from 'next/server'
import { submitDataUpdate } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Puente hacia el CRM para el formulario de /cliente/mis-datos/<token>.
 *
 * `POST { token, email, firstName, lastName, company?, phone?, address?, city?, state? }`
 *
 * No abre sesión: el link de WhatsApp sirve para cargar datos, no para entrar
 * al panel. El límite por IP se suma a los dos del CRM (global y por link).
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || typeof body.token !== 'string' || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const rl = checkRateLimit(`portal-mis-datos:${clientIp(request)}`, 10, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const texto = (v: unknown) => (typeof v === 'string' ? v : null)
  try {
    return NextResponse.json(
      await submitDataUpdate({
        token: body.token,
        email: body.email,
        firstName: texto(body.firstName) ?? '',
        lastName: texto(body.lastName) ?? '',
        company: texto(body.company),
        phone: texto(body.phone),
        address: texto(body.address),
        city: texto(body.city),
        state: texto(body.state),
      })
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}
