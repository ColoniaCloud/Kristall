import { MetadataRoute } from 'next'
import { LINEA_SLUGS, NICHOS } from '@/lib/catalogo'
import { getPublishedArticles } from '@/lib/blog'
import { BASE, LOCALES } from '@/lib/seo'

type Freq = 'weekly' | 'monthly' | 'daily' | 'always' | 'hourly' | 'yearly' | 'never'

const staticPages: Array<{ route: string; priority: number; freq: Freq }> = [
  { route: '',                      priority: 1.0, freq: 'weekly'  },
  { route: '/productos',            priority: 0.9, freq: 'weekly'  },
  { route: '/nosotros',             priority: 0.6, freq: 'monthly' },
  { route: '/servicios',            priority: 0.6, freq: 'monthly' },
  { route: '/contacto',             priority: 0.7, freq: 'monthly' },
  { route: '/blog',                 priority: 0.7, freq: 'weekly'  },
  { route: '/concesionarias',       priority: 0.7, freq: 'monthly' },
  { route: '/propuesta-aberturas', priority: 0.7, freq: 'monthly' },
  { route: '/punto-kristall',       priority: 0.7, freq: 'monthly' },
]

/** Mapa { locale: url } para las `alternates.languages` de una ruta dada. */
function languagesFor(route: string): Record<string, string> {
  const languages: Record<string, string> = { 'x-default': `${BASE}/es${route}` }
  for (const locale of LOCALES) languages[locale] = `${BASE}/${locale}${route}`
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages × locales
  for (const { route, priority, freq } of staticPages) {
    const languages = languagesFor(route)
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: { languages },
      })
    }
  }

  // Nicho pages (autos, arquitectura) × locales
  for (const nicho of NICHOS) {
    const route = `/productos/${nicho}`
    const languages = languagesFor(route)
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages },
      })
    }
  }

  // Línea pages × locales
  for (const slug of LINEA_SLUGS) {
    const route = `/productos/lineas/${slug}`
    const languages = languagesFor(route)
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages },
      })
    }
  }

  // Blog posts × locales
  const articles = await getPublishedArticles(100)
  for (const article of articles) {
    const route = `/blog/${article.slug}`
    const languages = languagesFor(route)
    const lastModified = (article.updatedAt as string | undefined) ?? article.publishedAt ?? new Date().toISOString()
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(lastModified),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}
