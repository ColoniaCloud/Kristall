import { NextRequest, NextResponse } from 'next/server'
import { setPassword } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const rl = checkRateLimit(`warranty-set-password:${clientIp(request)}`, 10, 60 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  const { password } = await request.json()

  // 8, igual que el portal de clientes y que el propio CRM. Estaba en 6 de los
  // dos lados y era el único mínimo distinto del sistema.
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  try {
    return NextResponse.json(await setPassword(token, password))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
