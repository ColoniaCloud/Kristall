/**
 * El vocabulario de los reclamos: qué le pasó a la lámina.
 *
 * Espejo de `crm-polarizados/src/lib/claim-issues.ts`. Si agregás un tipo acá
 * sin agregarlo allá, el CRM lo rechaza. Sin nada del servidor a propósito: lo
 * usan componentes de cliente.
 */

import type { ProductCategory } from '@/lib/client-portal/product-category'

export type ClaimIssueType = 'BURBUJAS' | 'DESPEGUE' | 'DECOLORACION' | 'ROTURA_VIDRIO' | 'OTRO'

export const CLAIM_ISSUE_LABELS: Record<ClaimIssueType, string> = {
  BURBUJAS: 'Burbujas',
  DESPEGUE: 'Despegue',
  DECOLORACION: 'Decoloración',
  ROTURA_VIDRIO: 'Rotura del vidrio',
  OTRO: 'Otro',
}

/**
 * Qué problemas se ofrecen según el rubro. La rotura del vidrio por estrés
 * térmico es propia de arquitectura —Kristall la cubre—; en un auto no la
 * causa la lámina, y el CRM la rechaza.
 */
export function issueTypesPara(categoria: ProductCategory | null | undefined): ClaimIssueType[] {
  const todos = Object.keys(CLAIM_ISSUE_LABELS) as ClaimIssueType[]
  return categoria === 'ARCHITECTURAL' ? todos : todos.filter((t) => t !== 'ROTURA_VIDRIO')
}

export const MAX_FOTOS_RECLAMO = 3

/** Una foto lista para mandar: base64 sin el prefijo `data:`. */
export interface FotoReclamo {
  data: string
  mimeType: 'image/jpeg'
  /** El data URI completo, solo para la miniatura en pantalla. */
  preview: string
}

/** Lado mayor en px. Alcanza para ver una burbuja o una rajadura, y queda en ~200 KB. */
const LADO_MAX = 1280

/**
 * Redimensiona y recomprime en el navegador. Una foto de celular pesa varios
 * MB; el CRM rechaza cualquiera que pase de 900 KB en base64.
 */
export async function achicarFoto(file: File): Promise<FotoReclamo> {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const preview = canvas.toDataURL('image/jpeg', 0.8)
  return { data: preview.slice(preview.indexOf(',') + 1), mimeType: 'image/jpeg', preview }
}

/** Lo que viaja al CRM además del texto. Lo que no aplica al rubro no se manda. */
export function extrasParaEnviar(
  categoria: ProductCategory | null | undefined,
  v: { issueType: ClaimIssueType | ''; affectedPanes: string; fotos: FotoReclamo[] }
) {
  const panos = Number(v.affectedPanes)
  return {
    issueType: v.issueType || undefined,
    affectedPanes:
      categoria === 'ARCHITECTURAL' && Number.isInteger(panos) && panos > 0 ? panos : undefined,
    photos: v.fotos.length ? v.fotos.map(({ data, mimeType }) => ({ data, mimeType })) : undefined,
  }
}
