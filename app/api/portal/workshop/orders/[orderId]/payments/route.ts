import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { addWorkOrderPayment } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { orderId } = await params
  const body = await request.json().catch(() => null)
  const amount = Number(body?.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'El monto tiene que ser mayor a cero' }, { status: 400 })
  }

  try {
    const payment = await addWorkOrderPayment(gate.session.contactId, orderId, {
      amount,
      currency: body.currency === 'USD' ? 'USD' : undefined,
      method: body.method?.trim() || null,
      reference: body.reference?.trim() || null,
      notes: body.notes?.trim() || null,
    })
    return NextResponse.json(payment, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
