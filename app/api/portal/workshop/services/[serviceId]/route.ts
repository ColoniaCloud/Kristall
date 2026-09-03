import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { updateWorkshopService, deactivateWorkshopService } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

type Params = { params: Promise<{ serviceId: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { serviceId } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    return NextResponse.json(
      await updateWorkshopService(gate.session.contactId, serviceId, body)
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { serviceId } = await params
  try {
    return NextResponse.json(
      await deactivateWorkshopService(gate.session.contactId, serviceId)
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}
