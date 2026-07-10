import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { markNotificationRead } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  try {
    return NextResponse.json(await markNotificationRead(session.contactId, id))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
