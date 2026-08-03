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

export { BASE, LOCALES }
