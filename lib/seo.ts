const BASE = 'https://kristallfilm.com'
const LOCALES = ['es', 'en', 'de'] as const

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
