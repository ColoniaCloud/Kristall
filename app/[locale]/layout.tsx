import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kristall Film',
  url: 'https://kristallfilm.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://kristallfilm.com/LogoPlano.png',
    width: 300,
    height: 80,
  },
  description: 'Distribuidor oficial de láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF en Argentina.',
  areaServed: { '@type': 'Country', name: 'Argentina' },
  knowsLanguage: ['es', 'en', 'de'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['Spanish', 'English'],
  },
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kristall Film',
  url: 'https://kristallfilm.com',
  inLanguage: ['es', 'en', 'de'],
}

const localeMeta: Record<string, { title: string; description: string; locale: string }> = {
  es: {
    title: 'Kristall Film',
    description: 'Láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF. Distribuidor oficial en Argentina.',
    locale: 'es_AR',
  },
  en: {
    title: 'Kristall Film',
    description: 'German-engineered window films for automotive, architectural and PPF applications. Official distributor in Argentina.',
    locale: 'en_US',
  },
  de: {
    title: 'Kristall Film',
    description: 'Deutsche Folientechnologie für Automobil, Architektur und Lackschutzfolie. Offizieller Vertrieb in Argentinien.',
    locale: 'de_DE',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const meta = localeMeta[locale] ?? localeMeta.es
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://kristallfilm.com/${locale}`,
      languages: {
        'x-default': 'https://kristallfilm.com/es',
        es: 'https://kristallfilm.com/es',
        en: 'https://kristallfilm.com/en',
        de: 'https://kristallfilm.com/de',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      locale: meta.locale,
      alternateLocale: Object.values(localeMeta)
        .filter(m => m.locale !== meta.locale)
        .map(m => m.locale),
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'es' | 'en' | 'de')) notFound()
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {/* relative+z-10+bg opaco: <main> se desliza por encima del footer y lo
              "descubre" al llegar al final (efecto cortina / parallax). */}
          <main className="relative z-10 flex-1 bg-[var(--bg)]">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </body>
    </html>
  )
}
