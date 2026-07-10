import { NextRequest, NextResponse } from 'next/server'
import { loginClient } from '@/lib/client-portal/api'
import { buildClientSessionCookie } from '@/lib/client-portal/session'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'email y password son requeridos' }, { status: 400 })
  }

  const rl = checkRateLimit(`portal-login:${clientIp(request)}`, 5, 15 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá unos minutos' }, { status: 429 })
  }

  try {
    const result = await loginClient(email, password)
    const cookie = buildClientSessionCookie({
      contactId: result.contactId,
      name: result.name,
      company: result.company,
    })
    const response = NextResponse.json({ name: result.name, company: result.company })
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (err) {
    return crmErrorResponse(err)
  }
}
