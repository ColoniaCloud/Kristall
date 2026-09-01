import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { createWorkOrder, type WorkOrderItemInput } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

/** Número que puede venir vacío del formulario. '' y null son "no lo puso". */
function numeroOpcional(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export async function POST(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const body = await request.json().catch(() => null)
  if (!body?.workshopClientId) {
    return NextResponse.json({ error: 'Elegí un cliente' }, { status: 400 })
  }

  const items: WorkOrderItemInput[] = Array.isArray(body.items)
    ? body.items
        // Una línea sin descripción es una fila que el instalador dejó vacía en
        // el formulario, no un error: se descarta en silencio.
        .filter((i: { description?: string }) => i?.description?.trim())
        .map((i: Record<string, unknown>) => ({
          description: String(i.description).trim(),
          productId: (i.productId as string) || null,
          rollId: (i.rollId as string) || null,
          squareMetersUsed: numeroOpcional(i.squareMetersUsed),
          price: numeroOpcional(i.price),
        }))
    : []

  try {
    const order = await createWorkOrder(gate.session.contactId, {
      workshopClientId: body.workshopClientId,
      assetId: body.assetId || null,
      scheduledAt: body.scheduledAt || null,
      priceQuoted: numeroOpcional(body.priceQuoted),
      currency: body.currency === 'USD' ? 'USD' : 'ARS',
      notes: body.notes?.trim() || null,
      items,
    })
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
