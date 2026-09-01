import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { transitionWorkOrder, type WorkOrderStatus } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

const ESTADOS: WorkOrderStatus[] = [
  'PRESUPUESTADA',
  'AGENDADA',
  'EN_PROCESO',
  'TERMINADA',
  'ENTREGADA',
  'CANCELADA',
]

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { orderId } = await params
  const body = await request.json().catch(() => null)
  if (!ESTADOS.includes(body?.to)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const priceFinal =
    body.priceFinal === '' || body.priceFinal === null || body.priceFinal === undefined
      ? null
      : Number(body.priceFinal)

  try {
    const order = await transitionWorkOrder(
      gate.session.contactId,
      orderId,
      body.to,
      priceFinal !== null && Number.isFinite(priceFinal) ? priceFinal : null
    )
    return NextResponse.json(order)
  } catch (err) {
    // Los 409 del CRM ("no se puede pasar de X a Y", "una OT terminada no se
    // cancela") llegan con su mensaje y hay que mostrarlos tal cual.
    return crmErrorResponse(err)
  }
}
