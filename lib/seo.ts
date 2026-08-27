import fs from 'node:fs'
import path from 'node:path'
import { productoDestacadaSrc, lineaDestacadaSrc, productoNombre, type Producto, type Linea } from '@/lib/catalogo'

const BASE = 'https://kristallfilm.com'
const LOCALES = ['es', 'en', 'de'] as const

/**
 * Next.js no hace deep-merge de `openGraph`/`twitter` entre segmentos: si una
 * page define su propio `openGraph` sin `images`, pierde el default del layout
 * padre por completo (no solo el tamaño). Por eso cada generateMetadata que
 * define `openGraph` debe incluir explícitamente unas `images`, reusando esta
 * constante salvo que la página tenga una imagen propia (categoría, blog post).
 */
export const DEFAULT_OG_IMAGE = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'Kristall Film — láminas de tecnología alemana',
}

export function buildAlternates(route: string, locale: string) {
  return {
    canonical: `${BASE}/${locale}${route}`,
    languages: {
      'x-default': `${BASE}/es${route}`,
      es: `${BASE}/es${route}`,
      en: `${BASE}/en${route}`,
      de: `${BASE}/de${route}`,
    } as Record<string, string>,
  }
}

/**
 * Foto de un producto para metadata/JSON-LD (generados en servidor, sin DOM,
 * así que no hay `onError` para caer a la foto de línea como hace
 * `ProductCard`/`ProductDetail` en el navegador). Se resuelve acá chequeando
 * el archivo en disco, una sola vez, al generar la página.
 */
export function resolveProductImage(p: Producto): string {
  const own = productoDestacadaSrc(p)
  const existsOnDisk = fs.existsSync(path.join(process.cwd(), 'public', own))
  return existsOnDisk ? own : lineaDestacadaSrc(p.lineaSlug)
}

/** Nodo `Product` de schema.org para un producto, con URL propia a su página de ficha técnica. */
export function productJsonLd(p: Producto, linea: Linea, locale: string) {
  const additionalProperty = [
    p.vlt != null && { '@type': 'PropertyValue', name: 'VLT', value: `${p.vlt}%` },
    p.ir != null && { '@type': 'PropertyValue', name: 'IR Rejection', value: `${p.ir}%` },
    p.uvr != null && { '@type': 'PropertyValue', name: 'UV Rejection', value: `${p.uvr}%` },
    p.garantiaAnios != null && { '@type': 'PropertyValue', name: 'Warranty', value: `${p.garantiaAnios} years` },
  ].filter(Boolean)

  return {
    '@type': 'Product',
    name: productoNombre(p),
    sku: p.codigo,
    url: `${BASE}/${locale}/productos/lineas/${linea.slug}/${p.codigo.toLowerCase()}`,
    image: `${BASE}${resolveProductImage(p)}`,
    brand: { '@type': 'Brand', name: 'Kristall Film' },
    category: linea.nombre,
    ...(additionalProperty.length > 0 && { additionalProperty }),
  }
}

export { BASE, LOCALES }
