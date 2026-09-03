import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { suggestHandles, checkHandle } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

/**
 * `?sugerir=1` para pedir sugerencias, `?handle=x` para saber si está libre.
 *
 * Se llama en cada tecla mientras el instalador escribe, así que la pantalla
 * tiene que hacer debounce. El rate limit del CRM es por api key y lo comparte
 * todo el portal: sin debounce, escribir un handle se come la cuota.
 */
export async function GET(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const handle = request.nextUrl.searchParams.get('handle')
  try {
    if (handle !== null) {
      return NextResponse.json(await checkHandle(gate.session.contactId, handle))
    }
    return NextResponse.json(await suggestHandles(gate.session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
