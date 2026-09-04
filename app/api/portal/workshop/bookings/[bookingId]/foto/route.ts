import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { crmBookingPhoto } from '@/lib/client-portal/workshop'

/**
 * La foto del vehículo, traída del CRM y servida al instalador.
 *
 * Pasa por acá y no se enlaza directo al CRM porque el CRM exige la api key, y
 * esa clave no puede salir al navegador. Además así la foto la ve solo quien
 * tiene sesión de instalador en este sitio.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { bookingId } = await params
  try {
    const r = await crmBookingPhoto(gate.session.contactId, bookingId)
    if (!r) return new NextResponse(null, { status: 404 })
    return new NextResponse(r.bytes, {
      headers: { 'Content-Type': r.mime, 'Cache-Control': 'private, max-age=3600' },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
