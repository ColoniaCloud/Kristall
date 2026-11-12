import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Superficies aisladas (Panel de Cliente, Garantías, catálogo de lanzamiento, visor 3D):
// un solo idioma, sin prefijo de locale. No se agregan a config.matcher para no
// perder el forzado HTTPS de abajo — solo se saltea intlMiddleware para ellas.
const ISOLATED_PREFIXES = [
  '/cliente',
  '/garantia',
  '/catalogo-propuesta',
  '/visor-3d',
  // La landing de distribuidores y sus versiones por país (ver
  // components/distribuidores-peru/paises.ts). Solo la de Perú tiene página
  // pública; las otras tres existen únicamente con token.
  '/distribuidores-peru',
  '/distribuidores-argentina',
  '/distribuidores-uruguay',
  '/propuesta-distribuidor',
  // Guía de marca interna, detrás de contraseña (app/brandguides/route.ts).
  '/brandguides',
]

// La landing de Perú se comparte como /distribuidores-perú, con tilde. La carpeta
// de la ruta va sin tilde (una "ú" en el nombre de carpeta depende de cómo cada
// sistema de archivos y el navegador codifiquen el carácter), así que la versión
// con tilde —que llega codificada como %C3%BA— redirige a la otra.
const PERU_CON_TILDE = /^\/distribuidores-per(ú|%C3%BA|%c3%ba)\/?$/

// La ruta se renombró de /propuesta-vidrierias a /propuesta-aberturas; esta
// redirige el slug viejo (ya indexado/compartido en producción) al nuevo.
const OLD_ABERTURAS_SLUG = /^\/(es|en|de|pt)\/propuesta-vidrierias(\/.*)?$/

// El catálogo se renombró de /productos/categorias/:linea a
// /productos/lineas/:linea (categorias queda libre para un futuro filtro por
// categoría Standard/Premium). Dos casos especiales: keramx cambió de slug
// (keram-x) y vitral se retiró del catálogo — su URL indexada redirige al
// nicho de arquitectura en vez de a una línea que ya no existe.
const OLD_LINEA_SLUG = /^\/(es|en|de|pt)\/productos\/categorias\/([a-z0-9-]+)(\/.*)?$/
const LINEA_SLUG_RENAMES: Record<string, string> = { keramx: 'keram-x' }
const LINEA_RETIRADA_A_NICHO: Record<string, string> = { vitral: 'arquitectura' }

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

  if (PERU_CON_TILDE.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/distribuidores-peru'
    return NextResponse.redirect(url, { status: 308 })
  }

  const oldSlugMatch = pathname.match(OLD_ABERTURAS_SLUG)
  if (oldSlugMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/${oldSlugMatch[1]}/propuesta-aberturas${oldSlugMatch[2] ?? ''}`
    return NextResponse.redirect(url, { status: 301 })
  }

  const oldLineaMatch = pathname.match(OLD_LINEA_SLUG)
  if (oldLineaMatch) {
    const [, locale, slugRaw, rest] = oldLineaMatch
    const url = request.nextUrl.clone()
    url.pathname = slugRaw in LINEA_RETIRADA_A_NICHO
      ? `/${locale}/productos/${LINEA_RETIRADA_A_NICHO[slugRaw]}`
      : `/${locale}/productos/lineas/${LINEA_SLUG_RENAMES[slugRaw] ?? slugRaw}${rest ?? ''}`
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
