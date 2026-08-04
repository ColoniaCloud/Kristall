import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { getAccount } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

/**
 * Cuenta corriente del Cliente logueado.
 *
 * El `contactId` sale de la sesión firmada, nunca del request — el cliente no
 * puede pedir la cuenta de otro cambiando un parámetro.
 */
export async function GET() {
  const session = await getClientSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    return NextResponse.json(await getAccount(session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
