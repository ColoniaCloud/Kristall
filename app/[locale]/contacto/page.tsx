import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Contacto', description: 'Ponete en contacto con el equipo de Kristall Film. Respondemos a la brevedad.' },
  en: { title: 'Contact', description: 'Get in touch with the Kristall Film team. We respond promptly.' },
  de: { title: 'Kontakt', description: 'Nehmen Sie Kontakt mit dem Kristall Film Team auf. Wir antworten schnell.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `/${locale}/contacto` },
  }
}

export default function ContactoPage() {
  return <ContactForm />
}
