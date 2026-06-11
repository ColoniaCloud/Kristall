import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  return {
    title: slug,
    alternates: buildAlternates(`/blog/${slug}`, locale),
    robots: { index: false, follow: false },
  }
}

export default function ArticuloPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <h1
        className="text-4xl font-medium text-[#9A9A9A]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Artículo
      </h1>
    </div>
  )
}
