import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CATEGORIES } from '@/lib/categories'
import { BASE, LOCALES } from '@/lib/seo'

export const revalidate = 3600

type Freq = 'weekly' | 'monthly' | 'daily' | 'always' | 'hourly' | 'yearly' | 'never'

const staticPages: Array<{ route: string; priority: number; freq: Freq }> = [
  { route: '',             priority: 1.0, freq: 'weekly'  },
  { route: '/productos',   priority: 0.9, freq: 'weekly'  },
  { route: '/nosotros',    priority: 0.6, freq: 'monthly' },
  { route: '/servicios',   priority: 0.6, freq: 'monthly' },
  { route: '/contacto',    priority: 0.7, freq: 'monthly' },
  { route: '/blog',        priority: 0.7, freq: 'weekly'  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    for (const cat of CATEGORIES) {
      entries.push({
        url: `${BASE}/${locale}/productos/categorias/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  // Product pages × locales (live from CMS)
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: { active: { equals: true } },
      limit: 500,
    })
    for (const locale of LOCALES) {
      for (const p of docs) {
        const product = p as unknown as { slug: string }
        entries.push({
          url: `${BASE}/${locale}/productos/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // Payload unavailable at build time — product URLs omitted
  }

  return entries
}
