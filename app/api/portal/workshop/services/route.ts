import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { listWorkshopServices, createWorkshopService } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET() {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response
  try {
    return NextResponse.json(await listWorkshopServices(gate.session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  try {
    return NextResponse.json(
      await createWorkshopService(gate.session.contactId, body),
      { status: 201 }
    )
  } catch (err) {
    return crmErrorResponse(err)
  }
}
