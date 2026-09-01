import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { updateWorkOrder, type WorkOrderItemInput } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

function numeroOpcional(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { orderId } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  // El estado NO se cambia por acá: va por /transition. Se frena del lado web
  // además de en el CRM, para que el mensaje sea el correcto y no un 400 crudo.
  if ('status' in body) {
    return NextResponse.json(
      { error: 'El estado se cambia con el botón de la orden, no editando la ficha' },
      { status: 400 }
    )
  }

  const patch: Record<string, unknown> = {}
  if (body.workshopClientId) patch.workshopClientId = body.workshopClientId
  if (body.assetId !== undefined) patch.assetId = body.assetId || null
  if (body.scheduledAt !== undefined) patch.scheduledAt = body.scheduledAt || null
  if (body.priceQuoted !== undefined) patch.priceQuoted = numeroOpcional(body.priceQuoted)
  if (body.priceFinal !== undefined) patch.priceFinal = numeroOpcional(body.priceFinal)
  if (body.currency !== undefined) patch.currency = body.currency === 'USD' ? 'USD' : 'ARS'
  if (body.notes !== undefined) patch.notes = body.notes?.trim() || null
  if (Array.isArray(body.items)) {
    const items: WorkOrderItemInput[] = body.items
      .filter((i: { description?: string }) => i?.description?.trim())
      .map((i: Record<string, unknown>) => ({
        description: String(i.description).trim(),
        productId: (i.productId as string) || null,
        rollId: (i.rollId as string) || null,
        squareMetersUsed: numeroOpcional(i.squareMetersUsed),
        price: numeroOpcional(i.price),
      }))
    patch.items = items
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No hay nada que actualizar' }, { status: 400 })
  }

  try {
    return NextResponse.json(await updateWorkOrder(gate.session.contactId, orderId, patch))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
