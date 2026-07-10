import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { getClaims, createClaim } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  try {
    return NextResponse.json(await getClaims(session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}

export async function POST(request: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await request.json()
  const { installationId, description, reporterName, reporterEmail, reporterPhone } = body
  if (!installationId || !description || !reporterName || !reporterEmail) {
    return NextResponse.json(
      { error: 'installationId, description, reporterName y reporterEmail son requeridos' },
      { status: 400 }
    )
  }

  try {
    const claim = await createClaim(session.contactId, {
      installationId,
      description,
      reporterName,
      reporterEmail,
      reporterPhone,
    })
    return NextResponse.json(claim, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
