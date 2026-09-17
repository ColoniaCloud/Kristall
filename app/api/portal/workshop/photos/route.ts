import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { listWorkshopPhotos, createWorkshopPhoto } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

const MIMES = ['image/png', 'image/jpeg', 'image/webp']

export async function GET() {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  try {
    return NextResponse.json(await listWorkshopPhotos(gate.session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}

/**
 * La foto llega como data URI (`data:image/jpeg;base64,…`) y acá se parte en
 * bytes y tipo, igual que el logo y el hero.
 */
export async function POST(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const body = await request.json().catch(() => null)
  if (typeof body?.image !== 'string') {
    return NextResponse.json({ error: 'Falta la imagen' }, { status: 400 })
  }
  const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(body.image)
  if (!m || !MIMES.includes(m[1])) {
    return NextResponse.json({ error: 'Tiene que ser un PNG, JPG o WEBP' }, { status: 400 })
  }

  try {
    const creada = await createWorkshopPhoto(gate.session.contactId, {
      image: m[2],
      imageMimeType: m[1] as 'image/png' | 'image/jpeg' | 'image/webp',
    })
    return NextResponse.json(creada, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
