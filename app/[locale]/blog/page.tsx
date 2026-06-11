import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Blog', description: 'Artículos técnicos, guías de instalación y novedades sobre láminas automotrices, arquitectónicas y protección de pintura de Kristall Film.' },
  en: { title: 'Blog', description: 'Technical articles, installation guides and news about automotive, architectural window films and paint protection from Kristall Film.' },
  de: { title: 'Blog', description: 'Technische Artikel, Installationsanleitungen und Neuigkeiten rund um Automobil-, Architekturfolien und Lackschutz von Kristall Film.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/blog', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/blog` },
  }
}

export default function BlogPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <h1 
        className="text-4xl font-medium text-[#9A9A9A]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Blog
      </h1>
    </div>
  )
}
