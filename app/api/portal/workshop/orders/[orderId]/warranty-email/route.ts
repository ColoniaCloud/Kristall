import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { resendWarrantyEmail } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Reenvía el mail de garantía de una orden terminada.
 *
 * El `activationToken` no pasa por acá ni por el navegador: el CRM lo lee de su
 * propia base. Es lo que distingue esto del reenvío que ya existía en
 * `/api/portal/installations/send-email`, que necesita el token en la mano y
 * por eso solo sirve justo después de generar un sub-código.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { orderId } = await params
  const body = await request.json().catch(() => ({}))
  const email = typeof body?.email === 'string' ? body.email.trim() : undefined

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ingresá un email válido' }, { status: 400 })
  }

  try {
    return NextResponse.json(
      await resendWarrantyEmail(gate.session.contactId, orderId, email || undefined)
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}
