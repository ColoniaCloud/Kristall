import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { createWorkshopClient } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

export async function POST(request: NextRequest) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  try {
    const client = await createWorkshopClient(gate.session.contactId, {
      name,
      // Los campos vacíos se mandan como null, no como cadena vacía: guardar ""
      // hace que un `if (cliente.email)` sea falso pero la columna no esté
      // vacía, que es la peor de las dos opciones.
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      dni: body.dni?.trim() || null,
      address: body.address?.trim() || null,
      notes: body.notes?.trim() || null,
    })
    return NextResponse.json(client, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
