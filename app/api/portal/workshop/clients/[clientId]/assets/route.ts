import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { createWorkshopAsset } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'
import type { AssetType } from '@/lib/client-portal/workshop'

const TIPOS: AssetType[] = ['VEHICLE', 'WINDOW', 'BUILDING', 'OTHER']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { clientId } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const type = TIPOS.includes(body.type) ? (body.type as AssetType) : 'VEHICLE'
  const year = Number(body.year)

  try {
    const asset = await createWorkshopAsset(gate.session.contactId, clientId, {
      type,
      identifier: body.identifier?.trim() || null,
      brand: body.brand?.trim() || null,
      model: body.model?.trim() || null,
      year: Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null,
      color: body.color?.trim() || null,
      notes: body.notes?.trim() || null,
    })
    return NextResponse.json(asset, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
