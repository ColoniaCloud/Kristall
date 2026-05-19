import type { Metadata } from 'next'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Blog', description: 'Artículos, guías y novedades sobre láminas y protección de superficies.' },
  en: { title: 'Blog', description: 'Articles, guides and news about window films and surface protection.' },
  de: { title: 'Blog', description: 'Artikel, Ratgeber und Neuigkeiten rund um Folien und Oberflächenschutz.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `/${locale}/blog` },
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
