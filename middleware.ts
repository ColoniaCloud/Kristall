import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Superficies aisladas (Panel de Cliente, Garantías): un solo idioma, sin
// prefijo de locale. No se agregan a config.matcher para no perder el
// forzado HTTPS de abajo — solo se saltea intlMiddleware para ellas.
const ISOLATED_PREFIXES = ['/cliente', '/garantia']

// La ruta se renombró de /propuesta-vidrierias a /propuesta-aberturas; esta
// redirige el slug viejo (ya indexado/compartido en producción) al nuevo.
const OLD_ABERTURAS_SLUG = /^\/(es|en|de)\/propuesta-vidrierias(\/.*)?$/

export default function middleware(request: NextRequest) {
  // Forzar HTTPS en producción
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto')
    if (proto && proto !== 'https') {
      const url = request.nextUrl.clone()
      url.protocol = 'https:'
      return NextResponse.redirect(url, { status: 301 })
    }
  }

  const { pathname } = request.nextUrl

  const oldSlugMatch = pathname.match(OLD_ABERTURAS_SLUG)
  if (oldSlugMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/${oldSlugMatch[1]}/propuesta-aberturas${oldSlugMatch[2] ?? ''}`
    return NextResponse.redirect(url, { status: 301 })
  }

  const isIsolated = ISOLATED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  if (isIsolated) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)']
}
