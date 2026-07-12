import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { createRollInstallation } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ rollCode: string }> }) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { rollCode } = await params

  try {
    const installation = await createRollInstallation(session.contactId, rollCode)
    return NextResponse.json(installation, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
