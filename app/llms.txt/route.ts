import { buildLlmsTxt } from '@/lib/llms'

/**
 * /llms.txt — índice del sitio para motores de IA (convención llmstxt.org).
 *
 * Route handler y no un archivo en `public/` porque el contenido se genera desde
 * `lib/catalogo.ts`: un estático no puede leer el catálogo y era exactamente por
 * eso que la versión anterior había divergido de la planilla. `force-static` lo
 * prerenderiza en el build, así que en runtime cuesta lo mismo que un estático.
 *
 * Ojo: si alguien vuelve a crear `public/llms.txt`, ese archivo gana sobre esta
 * ruta y el contenido generado deja de servirse sin aviso.
 */
export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
