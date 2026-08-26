import { NextRequest, NextResponse } from 'next/server'
import { createClaim } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`warranty-claim:${clientIp(request)}`, 8, 10 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const body = await request.json()
  const { activationToken, reporterName, description, reporterEmail, reporterDni } = body

  if (!activationToken || !reporterName || !description || !(reporterEmail || reporterDni)) {
    return NextResponse.json(
      { error: 'activationToken, reporterName, description y (reporterEmail o reporterDni) son requeridos' },
      { status: 400 }
    )
  }

  try {
    return NextResponse.json(await createClaim(body), { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
