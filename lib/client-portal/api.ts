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
  product: { id: string; name: string; sku: string }
  installations: {
    id: string
    installationCode: string
    status: string
    activatedAt: string | null
    expiresAt: string | null
  }[]
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
