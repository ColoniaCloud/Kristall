import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { getNotifications } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  try {
    return NextResponse.json(await getNotifications(session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
