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

export type AccessLevel = 'BASIC' | 'INSTALLER'

export interface LoginResult {
  contactId: string
  name: string
  company: string
  /** Ausente en respuestas del CRM anteriores a agosto 2026; tratar como BASIC. */
  accessLevel?: AccessLevel
}

export function loginClient(email: string, password: string) {
  return callCrmApi<LoginResult>('/api/portal/v1/auth/login', {
    method: 'POST',
    apiKey: KEY(),
    body: { email, password },
  })
}

// ─── Alta de cuenta y recuperación de contraseña ─────────────────────────────
//
// El CRM es el dueño de las credenciales: acá solo se hace de puente. Los
// tokens viajan en la URL del mail que manda el CRM y se validan contra él.

export interface RequestActivationResult {
  found: boolean
  alreadyActive?: boolean
  message: string
}

/** Paso 1 del alta: el Cliente pone su email y el CRM le manda el link. */
export function requestActivation(email: string) {
  return callCrmApi<RequestActivationResult>('/api/portal/v1/auth/request-activation', {
    method: 'POST',
    apiKey: KEY(),
    body: { email },
  })
}

export interface ActivationTokenInfo {
  valid: true
  email: string
  name: string
  company: string | null
  /** El que ya tiene el CRM, para preguntar si sigue vigente. null = pedirlo. */
  whatsapp: string | null
}

/** Valida el link antes de mostrar el formulario. */
export function verifyActivationToken(token: string) {
  return callCrmApi<ActivationTokenInfo>(
    `/api/portal/v1/auth/activate?token=${encodeURIComponent(token)}`,
    { apiKey: KEY() }
  )
}

/** Paso 2 del alta: crea la cuenta con la contraseña que eligió el Cliente. */
export function activateAccount(input: { token: string; password: string; whatsapp?: string }) {
  return callCrmApi<LoginResult>('/api/portal/v1/auth/activate', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export function requestPasswordReset(email: string) {
  return callCrmApi<{ message: string }>('/api/portal/v1/auth/request-reset', {
    method: 'POST',
    apiKey: KEY(),
    body: { email },
  })
}

export function verifyResetToken(token: string) {
  return callCrmApi<{ valid: true; email: string }>(
    `/api/portal/v1/auth/reset?token=${encodeURIComponent(token)}`,
    { apiKey: KEY() }
  )
}

/** No devuelve sesión a propósito: después de cambiarla, el Cliente entra por el login normal. */
export function resetPassword(input: { token: string; password: string }) {
  return callCrmApi<{ ok: true; message: string }>('/api/portal/v1/auth/reset', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

// ─── Cuenta corriente ────────────────────────────────────────────────────────

export type InstallmentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'

export interface AccountEntry {
  id: string
  date: string
  type: 'SALE' | 'PAYMENT' | 'ADJUSTMENT'
  description: string
  debit: number
  credit: number
  /** Saldo acumulado hasta este movimiento inclusive. Negativo = saldo a favor. */
  balance: number
  saleId?: string
}

export interface AccountInstallment {
  id: string
  number: number
  dueDate: string
  amount: number
  paid: number
  remaining: number
  status: InstallmentStatus
}

export interface AccountPlan {
  id: string
  saleId: string
  saleNumber: number
  installmentCount: number
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM'
  financedTotal: number
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
  installments: AccountInstallment[]
  nextDue: AccountInstallment | null
  overdueCount: number
}

export interface ClientAccount {
  summary: {
    /** Negativo = saldo a favor del cliente. */
    balance: number
    totalInvoiced: number
    totalPaid: number
    overdueAmount: number
    nextDueDate: string | null
  }
  entries: AccountEntry[]
  /** Vacío si ninguna compra se financió en cuotas — es el caso más común. */
  plans: AccountPlan[]
}

export function getAccount(contactId: string) {
  return callCrmApi<ClientAccount>(`/api/portal/v1/contacts/${contactId}/account`, { apiKey: KEY() })
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
