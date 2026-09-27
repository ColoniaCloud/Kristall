import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El carrito se deriva del routing: estaba escrito a mano y se había
        // quedado sin /pt/carrito cuando se sumó el locale.
        disallow: [
          '/admin',
          ...routing.locales.map((locale) => `/${locale}/carrito`),
          '/cliente',
          '/garantia',
        ],
      },
    ],
    sitemap: 'https://kristallfilm.com/sitemap.xml',
  }
}
