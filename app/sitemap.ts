import { MetadataRoute } from 'next'
import { LINE_ORDER } from '@/lib/catalogo'
import { BASE, LOCALES } from '@/lib/seo'

type Freq = 'weekly' | 'monthly' | 'daily' | 'always' | 'hourly' | 'yearly' | 'never'

const staticPages: Array<{ route: string; priority: number; freq: Freq }> = [
  { route: '',             priority: 1.0, freq: 'weekly'  },
  { route: '/productos',   priority: 0.9, freq: 'weekly'  },
  { route: '/nosotros',    priority: 0.6, freq: 'monthly' },
  { route: '/servicios',   priority: 0.6, freq: 'monthly' },
  { route: '/contacto',    priority: 0.7, freq: 'monthly' },
  { route: '/blog',        priority: 0.7, freq: 'weekly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Static pages × locales
  for (const locale of LOCALES) {
    for (const { route, priority, freq } of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
      })
    }
  }

  // Category pages × locales
  for (const locale of LOCALES) {
    for (const slug of LINE_ORDER) {
      entries.push({
        url: `${BASE}/${locale}/productos/categorias/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
