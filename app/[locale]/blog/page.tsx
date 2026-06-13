import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo'
import { getPublishedArticles, localized, coverMedia, type BlogLocale } from '@/lib/blog'

// Blog: contenido del CMS, revalidado periódicamente (ISR).
export const revalidate = 3600

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

function formatDate(iso: string | null | undefined, locale: string): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  const loc = locale as BlogLocale
  const t = await getTranslations({ locale, namespace: 'blog' })
  const articles = await getPublishedArticles(12)

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <section className="px-4 md:px-10 pt-14 pb-8 md:pt-20 md:pb-10 max-w-[1160px] mx-auto">
        <p className="section-label mb-3">{t('label')}</p>
        <h1
          className="text-3xl md:text-5xl font-medium text-[var(--text-primary)] leading-[1.05] tracking-tight max-w-[760px]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('headline')}
        </h1>
        <p className="mt-4 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[560px]">
          {t('subheadline')}
        </p>
      </section>

      {/* Grid */}
      <section className="px-4 md:px-10 pb-16 md:pb-24 max-w-[1160px] mx-auto">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-[var(--text-muted)]">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => {
              const title = localized(a, 'title', loc)
              const excerpt = localized(a, 'excerpt', loc)
              const cover = coverMedia(a)
              const date = formatDate(a.publishedAt, locale)
              return (
                <Link
                  key={a.id}
                  href={`/blog/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-hover)]"
                >
                  {/* Imagen / placeholder */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--de-black)]">
                    {cover?.url ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--de-black)]">
                        <span
                          className="text-2xl text-white/15"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          Kristall
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cuerpo */}
                  <div className="flex flex-1 flex-col p-5">
                    {date && (
                      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)] mb-2">
                        {date}
                      </p>
                    )}
                    <h2
                      className="text-lg font-medium text-[var(--text-primary)] leading-snug"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
                      {t('read_more')} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
