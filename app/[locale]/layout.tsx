import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

const localeMeta: Record<string, { title: string; description: string; locale: string }> = {
  es: {
    title: 'Kristall Film',
    description: 'Láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF.',
    locale: 'es_AR',
  },
  en: {
    title: 'Kristall Film',
    description: 'German-engineered window films for automotive, architectural and PPF applications.',
    locale: 'en_US',
  },
  de: {
    title: 'Kristall Film',
    description: 'Deutsche Folientechnologie für Automobil, Architektur und Lackschutzfolie.',
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
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en', de: '/de' },
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
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
