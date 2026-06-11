import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { buildAlternates } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Contacto', description: 'Ponete en contacto con el equipo de Kristall Film. Asesoramiento en láminas automotrices, arquitectónicas y PPF. Respondemos a la brevedad.' },
  en: { title: 'Contact', description: 'Get in touch with the Kristall Film team. Expert advice on automotive, architectural and PPF window films. We respond promptly.' },
  de: { title: 'Kontakt', description: 'Nehmen Sie Kontakt mit dem Kristall Film Team auf. Fachberatung zu Automobil-, Architektur- und Lackschutzfolien. Wir antworten schnell.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/contacto', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/contacto` },
  }
}

export default function ContactoPage() {
  return <ContactForm />
}
