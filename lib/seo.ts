import fs from 'node:fs'
import path from 'node:path'
import { productoDestacadaSrc, lineaDestacadaSrc, productoNombre, type Producto, type Linea } from '@/lib/catalogo'

const BASE = 'https://kristallfilm.com'
const LOCALES = ['es', 'en', 'de', 'pt'] as const

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
  const languages: Record<string, string> = {
    'x-default': `${BASE}/es${route}`,
  }
  for (const loc of LOCALES) {
    languages[loc] = `${BASE}/${loc}${route}`
  }
  return {
    canonical: `${BASE}/${locale}${route}`,
    languages,
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
    '@context': 'https://schema.org',
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

/** Nodo `Organization` de schema.org para la marca Kristall Film (GEO / Knowledge Graph). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kristall Film',
    url: BASE,
    logo: `${BASE}/logo.png`,
    sameAs: [
      'https://www.linkedin.com/company/135156381',
      'https://www.facebook.com/people/Kristall-Film-Latam/61590712143296/',
      'https://www.instagram.com/kristallfilm.la',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hola@kristallfilm.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English', 'German', 'Portuguese'],
    },
  }
}

/** Nodo `LocalBusiness` para showroom / distribución Kristall Film. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kristall Film Latam',
    image: `${BASE}/og-default.jpg`,
    telePhone: '+5491160484312',
    email: 'hola@kristallfilm.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Juan B Justo 2918',
      addressLocality: 'Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    url: BASE,
  }
}

/** Nodo `BreadcrumbList` de schema.org para navegación contextualizada en motores de búsqueda e IA. */
export function breadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith('http') ? it.item : `${BASE}${it.item}`,
    })),
  }
}

/** Nodo `FAQPage` de schema.org para optimización AIO/GEO de consultas directas en navegadores de IA. */
export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export { BASE, LOCALES }

