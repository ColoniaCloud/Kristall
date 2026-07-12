import { callCrmApi } from '@/lib/crm/api'

const KEY = () => process.env.CRM_CLIENT_PORTAL_API_KEY

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING'
export type RollStatus = 'IN_STOCK' | 'SOLD' | 'IN_USE' | 'EXHAUSTED' | 'VOIDED'
export type ClaimStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'

export interface Purchase {
  id: string
  saleNumber: string
  total: number
  paymentStatus: PaymentStatus
  createdAt: string
  items: { productName: string; quantity: number; unitPrice: number }[]
}

export interface Payment {
  id: string
  amount: number
  method: string
  date: string
  saleNumber: string
}

export interface ClientContact {
  id: string
  firstName: string
  lastName: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  purchases: Purchase[]
  payments: Payment[]
  balance: number
}

export interface StockRoll {
  id: string
  fullRollCode: string
  status: RollStatus
  lot: { lotNumber: string }
  product: {
    id: string
    name: string
    sku: string
    /** null si el producto no tiene WarrantyConfig — en ese caso asumir 15 (default del CRM). */
    warrantyConfig: { maxInstallations: number } | null
  }
  /**
   * TODAS las instalaciones generadas sobre este rollo (no solo las ACTIVE). Usar
   * `installations.length` vs `product.warrantyConfig.maxInstallations` para saber cuántos
   * sub-códigos quedan disponibles — `_count.installations` de abajo cuenta otra cosa.
   */
  installations: {
    id: string
    installationCode: string
    status: string
    activatedAt: string | null
    expiresAt: string | null
  }[]
  /** Cuenta SOLO instalaciones ACTIVE (activadas por el cliente final) — no usar para cupo. */
  _count: { installations: number }
}

export interface Installation {
  id: string
  installationCode: string
  status: string
  assetType: string | null
  assetDescription: string | null
  activatedAt: string | null
  expiresAt: string | null
  roll: { fullRollCode: string; product: { id: string; name: string; sku: string } }
}

/** Response de POST .../rolls/:fullRollCode/installations (sección 4.8 de CLIENT_PORTAL_API.md). */
export interface CreatedInstallation {
  id: string
  installationNumber: number
  installationCode: string
  /** Token para armar el link /garantia/<token> — solo se entrega acá, en el momento de creación. */
  activationToken: string
  status: string
  /** Estado del ROLLO (no de la instalación) después de esta operación. */
  rollStatus: RollStatus
}

export interface Claim {
  id: string
  status: ClaimStatus
  description: string
  createdAt: string
  installation: { installationCode: string; status: string }
}

export interface Notification {
  id: string
  type: 'NEW_PURCHASE' | 'WARRANTY_ACTIVATED'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export function loginClient(email: string, password: string) {
  return callCrmApi<{ contactId: string; name: string; company: string }>('/api/portal/v1/auth/login', {
    method: 'POST',
    apiKey: KEY(),
    body: { email, password },
  })
}

export function getContact(contactId: string) {
  return callCrmApi<ClientContact>(`/api/portal/v1/contacts/${contactId}`, { apiKey: KEY() })
}

export function getStock(contactId: string) {
  return callCrmApi<StockRoll[]>(`/api/portal/v1/contacts/${contactId}/stock`, { apiKey: KEY() })
}

export function getInstallations(contactId: string) {
  return callCrmApi<Installation[]>(`/api/portal/v1/contacts/${contactId}/installations`, { apiKey: KEY() })
}

/** Genera un nuevo sub-código de instalación (#2, #3, ...) sobre un rollo ya vendido a ese contacto. */
export function createRollInstallation(contactId: string, fullRollCode: string) {
  return callCrmApi<CreatedInstallation>(
    `/api/portal/v1/contacts/${contactId}/rolls/${fullRollCode}/installations`,
    { method: 'POST', apiKey: KEY() }
  )
}

export function getClaims(contactId: string) {
  return callCrmApi<Claim[]>(`/api/portal/v1/contacts/${contactId}/claims`, { apiKey: KEY() })
}

export interface CreateClaimInput {
  installationId: string
  description: string
  reporterName: string
  reporterEmail: string
  reporterPhone?: string
}

export function createClaim(contactId: string, input: CreateClaimInput) {
  return callCrmApi<{ id: string; status: string }>(`/api/portal/v1/contacts/${contactId}/claims`, {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export function getNotifications(contactId: string) {
  return callCrmApi<Notification[]>(`/api/portal/v1/contacts/${contactId}/notifications`, { apiKey: KEY() })
}

export function markNotificationRead(contactId: string, notificationId: string) {
  return callCrmApi<{ ok: boolean }>(
    `/api/portal/v1/contacts/${contactId}/notifications/${notificationId}/read`,
    { method: 'PATCH', apiKey: KEY() }
  )
}
