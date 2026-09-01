import { callCrmApi } from '@/lib/crm/api'

/**
 * Lanza si falta, en vez de devolver undefined. Con undefined, callCrmApi
 * simplemente no manda el header `x-api-key`, el CRM responde 401 y LoginForm
 * mapea cualquier 401 a "Email o contraseña incorrectos": una key mal
 * configurada se ve como si todos los clientes se equivocaran de contraseña.
 * Mismo criterio que CRM_BASE_URL y SESSION_SECRET.
 */
const KEY = () => {
  const key = process.env.CRM_CLIENT_PORTAL_API_KEY
  if (!key) throw new Error('Missing CRM_CLIENT_PORTAL_API_KEY')
  return key
}

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

/**
 * Ficha del Cliente. Ojo con los `| null`: en el CRM son columnas opcionales del
 * `Contact` y llegan como `null`, no como cadena vacía. Estaban tipadas como
 * `string` a secas, así que TypeScript dejaba pasar `contact.company.charAt(0)`
 * y el botón del menú se quedaba sin letra para cualquier cliente sin razón
 * social cargada.
 */
export interface ClientContact {
  id: string
  firstName: string
  lastName: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
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
    /** `null` es posible: en el CRM el SKU es una columna opcional del producto. */
    sku: string | null
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
  roll: { fullRollCode: string; product: { id: string; name: string; sku: string | null } }
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
  /**
   * `INSTALLMENT_OVERDUE` lo genera el watcher de cuotas del CRM
   * (lib/overdue-installments.ts) y faltaba en este tipo.
   */
  type: 'NEW_PURCHASE' | 'WARRANTY_ACTIVATED' | 'INSTALLMENT_OVERDUE'
  title: string
  message: string
  /**
   * Destino dentro del panel, ya en formato de ruta local — p. ej.
   * `/cliente/cuenta#cuota-<id>`, cuya ancla existe en AccountStatement. `null`
   * cuando la notificación es solo informativa. El CRM lo venía mandando y se
   * descartaba al serializar.
   */
  link: string | null
  read: boolean
  createdAt: string
}

export type AccessLevel = 'BASIC' | 'INSTALLER'

export interface LoginResult {
  contactId: string
  name: string
  company: string | null
  /** Ausente en respuestas del CRM anteriores a agosto 2026; tratar como BASIC. */
  accessLevel?: AccessLevel
  /**
   * Huella de la contraseña con la que se abre la sesión. Se guarda en la cookie
   * y se manda de vuelta en cada llamada: es lo que permite que un cambio de
   * contraseña mate las sesiones vivas. Ausente en respuestas del CRM
   * anteriores a setiembre 2026.
   */
  credentialVersion?: string
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

/**
 * Opciones de las llamadas hechas EN NOMBRE del Cliente logueado.
 * `portalSession` adjunta la versión de credencial de la cookie — ver
 * lib/crm/api.ts.
 *
 * Todos los segmentos van con `encodeURIComponent`: Next decodifica los params
 * ANTES de dárselos al route handler, así que un `%2F` en la URL del navegador
 * llega acá como `/` y se reinyecta como separador de path en la llamada al
 * CRM, con la api key adjunta. Los tokens de activación y reset ya lo hacían
 * bien; el resto no, y era inconsistencia, no criterio.
 */
const SESSION = () => ({ apiKey: KEY(), portalSession: true }) as const

export function getAccount(contactId: string) {
  return callCrmApi<ClientAccount>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/account`,
    SESSION()
  )
}

export function getContact(contactId: string) {
  return callCrmApi<ClientContact>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}`,
    SESSION()
  )
}

export function getStock(contactId: string) {
  return callCrmApi<StockRoll[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/stock`,
    SESSION()
  )
}

export function getInstallations(contactId: string) {
  return callCrmApi<Installation[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/installations`,
    SESSION()
  )
}

/** Genera un nuevo sub-código de instalación (#2, #3, ...) sobre un rollo ya vendido a ese contacto. */
export function createRollInstallation(contactId: string, fullRollCode: string) {
  return callCrmApi<CreatedInstallation>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/rolls/${encodeURIComponent(fullRollCode)}/installations`,
    { method: 'POST', ...SESSION() }
  )
}

export function getClaims(contactId: string) {
  return callCrmApi<Claim[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/claims`,
    SESSION()
  )
}

export interface CreateClaimInput {
  installationId: string
  description: string
  reporterName: string
  reporterEmail: string
  reporterPhone?: string
}

export function createClaim(contactId: string, input: CreateClaimInput) {
  return callCrmApi<{ id: string; status: string }>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/claims`,
    { method: 'POST', ...SESSION(), body: input }
  )
}

export function getNotifications(contactId: string) {
  return callCrmApi<Notification[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/notifications`,
    SESSION()
  )
}

export function markNotificationRead(contactId: string, notificationId: string) {
  return callCrmApi<{ ok: boolean }>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH', ...SESSION() }
  )
}
