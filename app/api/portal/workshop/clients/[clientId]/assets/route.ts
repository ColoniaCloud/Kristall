import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { createWorkshopAsset } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'
import type { AssetType } from '@/lib/client-portal/workshop'
import { BUILDING_USES, FILM_SIDES, GLASS_TYPES } from '@/lib/obra'

/** De la lista o null: lo que no se reconoce no se manda. */
function deLista<T extends string>(lista: readonly T[], v: unknown): T | null {
  return typeof v === 'string' && (lista as readonly string[]).includes(v) ? (v as T) : null
}

/** Positivo y finito, o null. */
function positivo(v: unknown): number | null {
  const n = Number(v)
  return v != null && v !== '' && Number.isFinite(n) && n > 0 ? n : null
}

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
      // Datos de obra. El CRM los descarta si el activo es un vehículo.
      siteAddress: typeof body.siteAddress === 'string' ? body.siteAddress.trim().slice(0, 191) || null : null,
      areaM2: positivo(body.areaM2),
      paneCount: positivo(body.paneCount) ? Math.round(positivo(body.paneCount)!) : null,
      glassType: deLista(GLASS_TYPES, body.glassType),
      filmSide: deLista(FILM_SIDES, body.filmSide),
      buildingUse: deLista(BUILDING_USES, body.buildingUse),
    })
    return NextResponse.json(asset, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
