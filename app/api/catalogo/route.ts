import { NextResponse } from 'next/server'
import catalogoJson from '@/data/catalogo.json'

/**
 * El catálogo publicado, en JSON: exactamente el `data/catalogo.json` con el que
 * se armó este build (lo baja de la planilla `scripts/sync-catalogo.mjs` en el
 * `prebuild`). Lo lee el CRM para dar de alta los productos de la web que le
 * faltan ("Importar del catálogo web", en /products del CRM).
 *
 * Público a propósito: es lo mismo que cualquiera ve en /productos — códigos,
 * líneas y datos técnicos. Nada de precios ni stock, que la planilla no trae.
 *
 * `/api/*` está fuera del matcher de middleware.ts, y esta ruta es más
 * específica que `[...slug]`, así que gana sobre el catch-all de Payload.
 */
export const dynamic = 'force-static'

export function GET() {
  return NextResponse.json({
    generadoEl: catalogoJson.generadoEl,
    productos: catalogoJson.productos,
  })
}
