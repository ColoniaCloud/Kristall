import { NextRequest, NextResponse } from 'next/server'
import { loginByInstallationCode } from '@/lib/warranty/api'
import { buildWarrantySessionCookie } from '@/lib/warranty/session'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const { installationCode, password } = await request.json()
  if (!installationCode || !password) {
    return NextResponse.json({ error: 'installationCode y password son requeridos' }, { status: 400 })
  }

  const rl = checkRateLimit(`warranty-login:${clientIp(request)}`, 5, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  try {
    const status = await loginByInstallationCode(installationCode, password)
    const cookie = buildWarrantySessionCookie(status)
    const response = NextResponse.json(status)
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (err) {
    return crmErrorResponse(err)
  }
}
