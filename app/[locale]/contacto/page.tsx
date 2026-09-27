import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'
import { setRequestLocale } from 'next-intl/server'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Contacto', description: 'Ponete en contacto con el equipo de Kristall Film. Asesoramiento en láminas automotrices, arquitectónicas y PPF. Respondemos a la brevedad.' },
  en: { title: 'Contact', description: 'Get in touch with the Kristall Film team. Expert advice on automotive, architectural and PPF window films. We respond promptly.' },
  de: { title: 'Kontakt', description: 'Nehmen Sie Kontakt mit dem Kristall Film Team auf. Fachberatung zu Automobil-, Architektur- und Lackschutzfolien. Wir antworten schnell.' },
  pt: { title: 'Contato', description: 'Entre em contato com a equipe da Kristall Film. Assessoria em películas automotivas, arquitetônicas e PPF. Respondemos rapidamente.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/contacto', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/contacto`, images: [DEFAULT_OG_IMAGE] },
  }
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ContactForm />
}
