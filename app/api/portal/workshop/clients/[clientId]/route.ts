import { NextRequest, NextResponse } from 'next/server'
import { requireInstallerSession } from '@/lib/client-portal/workshop-bridge'
import { updateWorkshopClient, deleteWorkshopClient } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'

type Params = { params: Promise<{ clientId: string }> }

const CAMPOS = ['name', 'email', 'phone', 'dni', 'address', 'notes'] as const

export async function PATCH(request: NextRequest, { params }: Params) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { clientId } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  // Se arma el patch a mano en vez de reenviar el body: así un campo que el
  // contrato no tiene no llega nunca al CRM.
  const patch: Record<string, string | null> = {}
  for (const campo of CAMPOS) {
    if (body[campo] === undefined) continue
    const valor = typeof body[campo] === 'string' ? body[campo].trim() : null
    patch[campo] = campo === 'name' ? valor || '' : valor || null
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No hay nada que actualizar' }, { status: 400 })
  }
  if (patch.name === '') {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  try {
    return NextResponse.json(await updateWorkshopClient(gate.session.contactId, clientId, patch))
  } catch (err) {
    return crmErrorResponse(err)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const gate = await requireInstallerSession()
  if (!gate.ok) return gate.response

  const { clientId } = await params
  try {
    return NextResponse.json(await deleteWorkshopClient(gate.session.contactId, clientId))
  } catch (err) {
    // El 409 del CRM ("tiene órdenes de trabajo") pasa tal cual: es un mensaje
    // que el instalador tiene que leer, no un error técnico.
    return crmErrorResponse(err)
  }
}
