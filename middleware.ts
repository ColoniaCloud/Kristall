import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Superficies aisladas (Panel de Cliente, Garantías): un solo idioma, sin
// prefijo de locale. No se agregan a config.matcher para no perder el
// forzado HTTPS de abajo — solo se saltea intlMiddleware para ellas.
const ISOLATED_PREFIXES = ['/cliente', '/garantia']

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
