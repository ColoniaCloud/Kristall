import { NextRequest, NextResponse } from 'next/server'
import { hasAccess } from '@/lib/brandguides/access'
import { CLASH_DISPLAY_ZIP_BASE64 } from '@/lib/brandguides/clash-display-zip'

// Descarga de Clash Display para el equipo, enlazada desde la sección de
// tipografía de la guía. Usa la misma cookie que /brandguides (su path la
// cubre); sin sesión vuelve al login. No va en public/ porque ahí sería pública,
// y la licencia de la fuente solo permite compartirla dentro de la empresa.
const ZIP = Buffer.from(CLASH_DISPLAY_ZIP_BASE64, 'base64')

export async function GET(request: NextRequest) {
  if (!hasAccess(request)) {
    return new NextResponse(null, { status: 303, headers: { Location: '/brandguides' } })
  }
  return new NextResponse(new Uint8Array(ZIP), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="ClashDisplay.zip"',
      'Content-Length': String(ZIP.length),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
