import { NextRequest, NextResponse } from 'next/server'
import { getWarrantySession } from '@/lib/warranty/session'
import { createClaim } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Reclamo desde la sesión de código corto.
 *
 * El `installationCode` sale **de la cookie firmada**, nunca del body: si
 * viniera del navegador, cualquiera podría reclamar sobre la garantía de otro
 * escribiendo un código. Es la misma regla que sostiene todo el puente.
 *
 * El `activationToken` no interviene en ningún momento — ni lo tiene esta
 * sesión ni hace falta. El CRM acepta el reclamo identificado por código
 * justamente porque acá ya se verificó la contraseña al iniciar sesión.
 */
export async function POST(request: NextRequest) {
  const session = await getWarrantySession()
  if (!session) {
    return NextResponse.json(
      { error: 'Se venció tu sesión. Volvé a entrar con tu código y contraseña.' },
      { status: 401 }
    )
  }

  const rl = checkRateLimit(`warranty-claim-code:${clientIp(request)}`, 8, 10 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const reporterName = typeof body?.reporterName === 'string' ? body.reporterName.trim() : ''
  const description = typeof body?.description === 'string' ? body.description.trim() : ''

  if (!reporterName || !description) {
    return NextResponse.json(
      { error: 'Contanos tu nombre y qué problema tenés' },
      { status: 400 }
    )
  }

  try {
    const claim = await createClaim({
      // De la cookie, no del body.
      installationCode: session.installationCode,
      reporterName,
      reporterEmail: body.reporterEmail?.trim() || undefined,
      reporterPhone: body.reporterPhone?.trim() || undefined,
      description,
    })
    return NextResponse.json(claim, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
