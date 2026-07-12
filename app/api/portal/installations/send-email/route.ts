import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { sendWarrantyActivationEmail } from '@/lib/resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await request.json()
  const { to, recipientName, installationCode, productName, activationToken } = body

  if (!to || !EMAIL_RE.test(to)) {
    return NextResponse.json({ error: 'Ingresá un email válido' }, { status: 400 })
  }
  if (!installationCode || !productName || !activationToken) {
    return NextResponse.json(
      { error: 'installationCode, productName y activationToken son requeridos' },
      { status: 400 }
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kristallfilm.com'
  const activationLink = `${siteUrl}/garantia/${activationToken}`

  try {
    await sendWarrantyActivationEmail({
      to,
      recipientName,
      installerCompany: session.company,
      installationCode,
      productName,
      activationLink,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API/portal/installations/send-email]', err)
    return NextResponse.json({ error: 'No pudimos enviar el email' }, { status: 502 })
  }
}
