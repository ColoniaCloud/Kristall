import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { updateWorkshopSettings } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

const MIMES = ['image/png', 'image/jpeg', 'image/webp'] as const
type Mime = (typeof MIMES)[number]

/**
 * Guarda la configuración del taller, incluido el logo.
 *
 * El logo llega como data URI desde el navegador (`data:image/png;base64,…`) y
 * acá se parte en bytes y tipo: guardar el prefijo también sería guardar basura
 * que después hay que recortar cada vez que se sirve la imagen.
 */
export async function PATCH(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}
  if (body.workshopName !== undefined) patch.workshopName = body.workshopName?.trim() || null
  if (body.autoSendWarrantyEmail !== undefined) {
    patch.autoSendWarrantyEmail = Boolean(body.autoSendWarrantyEmail)
  }
  if (body.openingTime !== undefined) patch.openingTime = body.openingTime || null
  if (body.closingTime !== undefined) patch.closingTime = body.closingTime || null
  if (body.workingDays !== undefined) patch.workingDays = body.workingDays || null

  if (body.logo === null) {
    patch.logo = null
    patch.logoMimeType = null
  } else if (typeof body.logo === 'string' && body.logo.length > 0) {
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(body.logo)
    if (!m) {
      return NextResponse.json(
        { error: 'El logo tiene que ser un PNG, JPG o WEBP' },
        { status: 400 }
      )
    }
    patch.logoMimeType = m[1] as Mime
    patch.logo = m[2]
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No hay nada que actualizar' }, { status: 400 })
  }

  try {
    return NextResponse.json(await updateWorkshopSettings(gate.session.contactId, patch))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
