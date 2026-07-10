import { NextRequest, NextResponse } from 'next/server'
import { createClaim } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { activationToken, reporterName, description, reporterEmail, reporterDni } = body

  if (!activationToken || !reporterName || !description || !(reporterEmail || reporterDni)) {
    return NextResponse.json(
      { error: 'activationToken, reporterName, description y (reporterEmail o reporterDni) son requeridos' },
      { status: 400 }
    )
  }

  try {
    return NextResponse.json(await createClaim(body), { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
