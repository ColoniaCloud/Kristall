import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { listBookings } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response
  try {
    const soloPendientes = request.nextUrl.searchParams.get('pendientes') === '1'
    return NextResponse.json(await listBookings(gate.session.contactId, soloPendientes))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
