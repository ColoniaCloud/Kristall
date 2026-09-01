import { callCrmApi } from '@/lib/crm/api'
import type { RollStatus } from '@/lib/client-portal/api'

/**
 * Mi Taller — el puente hacia los endpoints `/workshop/*` del CRM.
 *
 * Vive en su propio archivo y no en `client-portal/api.ts` porque es un módulo
 * entero: 11 endpoints y una docena de tipos. Mezclarlo con el portal básico
 * haría de aquel archivo un cajón de sastre.
 *
 * Contrato: CLIENT_PORTAL_API.md sección 4.10 (espejado en los dos repos).
 *
 * Igual que el resto del portal, esto corre **solo en el servidor**: la api key
 * no puede llegar al navegador. Las pantallas leen llamando directo a estas
 * funciones desde componentes de servidor; las escrituras pasan por las rutas
 * de `app/api/portal/workshop/**`, que son las que el navegador puede llamar.
 */

const KEY = () => {
  const key = process.env.CRM_CLIENT_PORTAL_API_KEY
  if (!key) throw new Error('Missing CRM_CLIENT_PORTAL_API_KEY')
  return key
}

/** Llamada en nombre del Cliente logueado — ver la nota en client-portal/api.ts. */
const SESSION = () => ({ apiKey: KEY(), portalSession: true }) as const

const base = (contactId: string) =>
  `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/workshop`

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type WorkOrderStatus =
  | 'PRESUPUESTADA'
  | 'AGENDADA'
  | 'EN_PROCESO'
  | 'TERMINADA'
  | 'ENTREGADA'
  | 'CANCELADA'

export type AssetType = 'VEHICLE' | 'WINDOW' | 'BUILDING' | 'OTHER'
export type Currency = 'ARS' | 'USD'

/**
 * Los importes llegan como string: Prisma serializa `Decimal` así para no
 * perder precisión. Convertir con `Number()` en el borde de render, nunca
 * asumir que ya es número.
 */
export type Money = string | null

export interface WorkshopClient {
  id: string
  name: string
  email: string | null
  phone: string | null
  dni: string | null
  address: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  _count?: { assets: number; workOrders: number }
}

export interface WorkshopAsset {
  id: string
  workshopClientId: string
  type: AssetType
  identifier: string | null
  brand: string | null
  model: string | null
  year: number | null
  color: string | null
  notes: string | null
  createdAt: string
  _count?: { workOrders: number }
}

export interface WorkshopClientDetail extends WorkshopClient {
  assets: WorkshopAsset[]
  _count: { assets: number; workOrders: number }
}

export interface WorkOrderListItem {
  id: string
  orderNumber: number
  status: WorkOrderStatus
  scheduledAt: string | null
  startedAt: string | null
  finishedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  priceQuoted: Money
  priceFinal: Money
  currency: Currency
  createdAt: string
  workshopClient: { id: string; name: string; phone: string | null }
  asset: {
    id: string
    type: AssetType
    identifier: string | null
    brand: string | null
    model: string | null
  } | null
}

export interface WorkOrderItem {
  id: string
  description: string
  squareMetersUsed: Money
  price: Money
  product: { id: string; name: string; sku: string | null } | null
  roll: { id: string; fullRollCode: string } | null
}

export interface WorkOrderPayment {
  id: string
  amount: string
  currency: Currency
  method: string | null
  reference: string | null
  notes: string | null
  paidAt: string
}

export interface WorkOrderDetail extends Omit<WorkOrderListItem, 'workshopClient' | 'asset'> {
  notes: string | null
  workshopClient: WorkshopClient
  asset: WorkshopAsset | null
  items: WorkOrderItem[]
  payments: WorkOrderPayment[]
  /** null mientras la OT no haya generado garantía. Sin `activationToken`. */
  warrantyInstallation: {
    id: string
    installationCode: string
    status: string
    expiresAt: string | null
  } | null
}

export interface AgendaEntry {
  id: string
  orderNumber: number
  status: WorkOrderStatus
  scheduledAt: string
  workshopClient: { id: string; name: string; phone: string | null }
  asset: {
    type: AssetType
    identifier: string | null
    brand: string | null
    model: string | null
  } | null
}

export interface WorkshopStockRoll {
  id: string
  fullRollCode: string
  // El mismo enum que el stock de la sección 4.2: es el mismo rollo, visto con
  // más campos. Reusar el tipo mantiene compatible a StockTable con los dos.
  status: RollStatus
  lot: { lotNumber: string }
  product: {
    id: string
    name: string
    sku: string | null
    category: string
    width: Money
    length: Money
    warrantyConfig: { maxInstallations: number } | null
  }
  installations: {
    id: string
    installationCode: string
    status: string
    activatedAt: string | null
    expiresAt: string | null
  }[]
  _count: { installations: number }
  /**
   * Cuatro números, y no es redundancia:
   *
   *   `usedM2`      lo que ya se cortó (órdenes terminadas o entregadas)
   *   `reservedM2`  lo comprometido y sin cortar (presupuestadas, agendadas,
   *                 en proceso). Las canceladas no cuentan en ninguno.
   *   `remainingM2` lo que físicamente queda: total − usado
   *   `availableM2` con lo que se puede contar para un trabajo nuevo:
   *                 total − usado − reservado
   *
   * `totalM2`, `remainingM2` y `availableM2` son `null` cuando el producto no
   * tiene medidas cargadas. **`null` no es `0`**: "no sé cuánto queda" y "no
   * queda nada" son cosas distintas, y mostrar 0 haría creer que el rollo está
   * vacío.
   */
  totalM2: number | null
  usedM2: number
  reservedM2: number
  remainingM2: number | null
  availableM2: number | null
}

/**
 * Lo que pasó al terminar una orden. Viene **solo** en la respuesta de la
 * transición a `TERMINADA`, al lado de la orden — no es parte del estado de la
 * orden y no aparece en los GET.
 */
export interface EfectosDeTerminar {
  garantias: { installationCode: string; fullRollCode: string; expiresAt: string }[]
  problemas: { fullRollCode: string; motivo: string }[]
  mail: { enviado: boolean; motivo?: string }
}

export interface WorkshopSummary {
  hoy: { turnos: number; enProceso: number }
  ordenes: Record<WorkOrderStatus, number>
  periodo: {
    desde: string
    hasta: string
    terminadas: number
    facturado: number
    cobrado: number
    porCobrar: number
    metrosCuadrados: number
  }
}

// ─── Clientes finales ────────────────────────────────────────────────────────

export function listWorkshopClients(contactId: string, search?: string) {
  const q = search ? `?search=${encodeURIComponent(search)}` : ''
  return callCrmApi<WorkshopClient[]>(`${base(contactId)}/clients${q}`, SESSION())
}

export function getWorkshopClient(contactId: string, clientId: string) {
  return callCrmApi<WorkshopClientDetail>(
    `${base(contactId)}/clients/${encodeURIComponent(clientId)}`,
    SESSION()
  )
}

export interface WorkshopClientInput {
  name: string
  email?: string | null
  phone?: string | null
  dni?: string | null
  address?: string | null
  notes?: string | null
}

export function createWorkshopClient(contactId: string, input: WorkshopClientInput) {
  return callCrmApi<WorkshopClient>(`${base(contactId)}/clients`, {
    method: 'POST',
    ...SESSION(),
    body: input,
  })
}

export function updateWorkshopClient(
  contactId: string,
  clientId: string,
  input: Partial<WorkshopClientInput>
) {
  return callCrmApi<WorkshopClient>(
    `${base(contactId)}/clients/${encodeURIComponent(clientId)}`,
    { method: 'PATCH', ...SESSION(), body: input }
  )
}

export function deleteWorkshopClient(contactId: string, clientId: string) {
  return callCrmApi<{ ok: true }>(
    `${base(contactId)}/clients/${encodeURIComponent(clientId)}`,
    { method: 'DELETE', ...SESSION() }
  )
}

// ─── Vehículos ───────────────────────────────────────────────────────────────

export interface WorkshopAssetInput {
  type?: AssetType
  identifier?: string | null
  brand?: string | null
  model?: string | null
  year?: number | null
  color?: string | null
  notes?: string | null
}

export function listWorkshopAssets(contactId: string, clientId: string) {
  return callCrmApi<WorkshopAsset[]>(
    `${base(contactId)}/clients/${encodeURIComponent(clientId)}/assets`,
    SESSION()
  )
}

export function createWorkshopAsset(
  contactId: string,
  clientId: string,
  input: WorkshopAssetInput
) {
  return callCrmApi<WorkshopAsset>(
    `${base(contactId)}/clients/${encodeURIComponent(clientId)}/assets`,
    { method: 'POST', ...SESSION(), body: input }
  )
}

// ─── Órdenes ─────────────────────────────────────────────────────────────────

export interface ListOrdersQuery {
  status?: WorkOrderStatus
  from?: string
  to?: string
  clientId?: string
}

export function listWorkOrders(contactId: string, q: ListOrdersQuery = {}) {
  const params = new URLSearchParams()
  if (q.status) params.set('status', q.status)
  if (q.from) params.set('from', q.from)
  if (q.to) params.set('to', q.to)
  if (q.clientId) params.set('clientId', q.clientId)
  const qs = params.toString()
  return callCrmApi<WorkOrderListItem[]>(
    `${base(contactId)}/orders${qs ? `?${qs}` : ''}`,
    SESSION()
  )
}

export function getWorkOrder(contactId: string, orderId: string) {
  return callCrmApi<WorkOrderDetail>(
    `${base(contactId)}/orders/${encodeURIComponent(orderId)}`,
    SESSION()
  )
}

export interface WorkOrderItemInput {
  description: string
  productId?: string | null
  rollId?: string | null
  squareMetersUsed?: number | null
  price?: number | null
}

export interface CreateWorkOrderInput {
  workshopClientId: string
  assetId?: string | null
  scheduledAt?: string | null
  priceQuoted?: number | null
  currency?: Currency
  notes?: string | null
  items?: WorkOrderItemInput[]
}

export function createWorkOrder(contactId: string, input: CreateWorkOrderInput) {
  return callCrmApi<WorkOrderDetail>(`${base(contactId)}/orders`, {
    method: 'POST',
    ...SESSION(),
    body: input,
  })
}

export type UpdateWorkOrderInput = Partial<CreateWorkOrderInput> & { priceFinal?: number | null }

export function updateWorkOrder(contactId: string, orderId: string, input: UpdateWorkOrderInput) {
  return callCrmApi<WorkOrderDetail>(
    `${base(contactId)}/orders/${encodeURIComponent(orderId)}`,
    { method: 'PATCH', ...SESSION(), body: input }
  )
}

/**
 * Cambia el estado. Es su propio endpoint porque entrar en TERMINADA dispara
 * efectos — no se hace con un PATCH (el CRM lo rechaza con 400 si se intenta).
 */
export function transitionWorkOrder(
  contactId: string,
  orderId: string,
  to: WorkOrderStatus,
  priceFinal?: number | null
) {
  return callCrmApi<WorkOrderDetail & { efectos?: EfectosDeTerminar }>(
    `${base(contactId)}/orders/${encodeURIComponent(orderId)}/transition`,
    { method: 'POST', ...SESSION(), body: { to, priceFinal } }
  )
}

/**
 * Reenvía el mail de garantía de una orden terminada.
 *
 * El `activationToken` no viaja: el CRM lo lee de su base y manda el mail. Por
 * eso esto es un endpoint del CRM y no se puede hacer con el flujo de reenvío
 * que ya existía en el portal, que necesita el token en la mano.
 */
export function resendWarrantyEmail(contactId: string, orderId: string, email?: string) {
  return callCrmApi<{ enviado: true; destinatario: string }>(
    `${base(contactId)}/orders/${encodeURIComponent(orderId)}/warranty-email`,
    { method: 'POST', ...SESSION(), body: email ? { email } : {} }
  )
}

export interface WorkOrderPaymentInput {
  amount: number
  currency?: Currency
  method?: string | null
  reference?: string | null
  notes?: string | null
  paidAt?: string
}

export function addWorkOrderPayment(
  contactId: string,
  orderId: string,
  input: WorkOrderPaymentInput
) {
  return callCrmApi<WorkOrderPayment>(
    `${base(contactId)}/orders/${encodeURIComponent(orderId)}/payments`,
    { method: 'POST', ...SESSION(), body: input }
  )
}

// ─── Agenda, stock y resumen ────────────────────────────────────────────────

export function getAgenda(contactId: string, from: string, to: string) {
  return callCrmApi<AgendaEntry[]>(
    `${base(contactId)}/agenda?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    SESSION()
  )
}

export function getWorkshopStock(contactId: string) {
  return callCrmApi<WorkshopStockRoll[]>(`${base(contactId)}/stock`, SESSION())
}

export function getWorkshopSummary(contactId: string, from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return callCrmApi<WorkshopSummary>(
    `${base(contactId)}/summary${qs ? `?${qs}` : ''}`,
    SESSION()
  )
}
