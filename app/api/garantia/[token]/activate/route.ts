import { NextRequest, NextResponse } from 'next/server'
import { activate, ASSET_TYPES } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await request.json()
  const { assetType, clientName, clientEmail } = body

  if (!assetType || !clientName || !clientEmail) {
    return NextResponse.json(
      { error: 'assetType, clientName y clientEmail son requeridos' },
      { status: 400 }
    )
  }
  // El CRM no valida el enum antes de guardar (500 genérico si es inválido) — se valida acá.
  if (!ASSET_TYPES.includes(assetType)) {
    return NextResponse.json({ error: 'assetType inválido' }, { status: 400 })
  }

  const rl = checkRateLimit(`warranty-activate:${clientIp(request)}`, 10, 60 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  try {
    return NextResponse.json(await activate(token, body))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
