import { callCrmApi } from '@/lib/crm/api'

/** Lanza si falta: sin la key el CRM devuelve 401 y el error se lee como
 *  "no encontramos esa garantía". Ver la nota en lib/client-portal/api.ts. */
const KEY = () => {
  const key = process.env.CRM_WARRANTY_API_KEY
  if (!key) throw new Error('Missing CRM_WARRANTY_API_KEY')
  return key
}

// Los tokens se interpolan con encodeURIComponent: Next decodifica los
// segmentos de la URL antes de entregarlos, así que un `%2F` llegaría acá como
// `/` y se reinyectaría como separador de path en la llamada al CRM — con la
// api key adjunta.
export type AssetType = 'VEHICLE' | 'WINDOW' | 'BUILDING' | 'OTHER'
export type InstallationStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'VOIDED'

export const ASSET_TYPES: AssetType[] = ['VEHICLE', 'WINDOW', 'BUILDING', 'OTHER']

export interface WarrantyStatus {
  installationCode: string
  status: InstallationStatus
  product: { id: string; name: string; brand: string }
  isActive: boolean
  daysRemaining: number
  expiresAt: string | null
  assetType: AssetType | null
}

/** GET /api/public/warranty/:token — sin key, es el único endpoint público. */
export function getStatus(token: string) {
  return callCrmApi<WarrantyStatus>(`/api/public/warranty/${encodeURIComponent(token)}`)
}

export interface ActivateInput {
  assetType: AssetType
  assetDescription?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientDni?: string
  installedAt?: string
  installerName?: string
  notes?: string
}

export function activate(token: string, input: ActivateInput) {
  return callCrmApi<{ activated: true; expiresAt: string }>(`/api/public/warranty/${encodeURIComponent(token)}/activate`, {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

/**
 * Dos formas de identificar la garantía, y no son intercambiables:
 *
 * - `activationToken` — el camino público, con el link del mail. El CRM exige
 *   además que el email o el DNI coincidan con los de la activación: tener el
 *   link no alcanza para reclamar en nombre de otro.
 * - `installationCode` — para el usuario que **ya inició sesión** con su código
 *   y su contraseña. No pide email ni DNI porque la identidad ya se verificó;
 *   solo se puede usar desde el servidor, con el código sacado de la cookie
 *   firmada y nunca del navegador.
 */
export type CreateWarrantyClaimInput = {
  reporterName: string
  reporterEmail?: string
  reporterPhone?: string
  reporterDni?: string
  description: string
} & (
  | { activationToken: string; installationCode?: never }
  | { installationCode: string; activationToken?: never }
)

export function createClaim(input: CreateWarrantyClaimInput) {
  return callCrmApi<{ id: string; status: 'OPEN' }>('/api/public/warranty/claims', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export function setPassword(token: string, password: string) {
  return callCrmApi<{ ok: true }>(`/api/public/warranty/${encodeURIComponent(token)}/set-password`, {
    method: 'POST',
    apiKey: KEY(),
    body: { password },
  })
}

export function loginByInstallationCode(installationCode: string, password: string) {
  return callCrmApi<WarrantyStatus>('/api/public/warranty/login', {
    method: 'POST',
    apiKey: KEY(),
    body: { installationCode, password },
  })
}
