import { buildLlmsFullTxt } from '@/lib/llms'

/**
 * /llms-full.txt — base de conocimiento técnica completa, con la tabla de
 * especificaciones producto por producto. Ver la nota de app/llms.txt/route.ts
 * sobre por qué es una ruta y no un archivo en `public/`.
 */
export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
