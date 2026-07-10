import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/es/carrito', '/en/carrito', '/de/carrito', '/cliente', '/garantia'],
      },
    ],
    sitemap: 'https://kristallfilm.com/sitemap.xml',
  }
}
