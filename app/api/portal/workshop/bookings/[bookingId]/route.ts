import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { confirmBooking, rejectBooking } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

/**
 * Responder un pedido de turno: `{ accion: 'confirmar' | 'rechazar' }`.
 *
 * Las dos en la misma ruta porque son la misma decisión del instalador, tomada
 * en el mismo lugar de la pantalla.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { bookingId } = await params
  const body = await request.json().catch(() => null)
  const accion = body?.accion

  if (accion !== 'confirmar' && accion !== 'rechazar') {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  }

  try {
    if (accion === 'rechazar') {
      return NextResponse.json(await rejectBooking(gate.session.contactId, bookingId))
    }
    return NextResponse.json(
      await confirmBooking(gate.session.contactId, bookingId, body?.scheduledAt)
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}
