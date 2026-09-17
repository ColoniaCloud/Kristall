import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { reorderWorkshopPhoto, deleteWorkshopPhoto } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { photoId } = await params
  const body = await request.json().catch(() => null)
  if (body?.direccion !== 'arriba' && body?.direccion !== 'abajo') {
    return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 })
  }

  try {
    return NextResponse.json(
      await reorderWorkshopPhoto(gate.session.contactId, photoId, body.direccion)
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { photoId } = await params
  try {
    return NextResponse.json(await deleteWorkshopPhoto(gate.session.contactId, photoId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
