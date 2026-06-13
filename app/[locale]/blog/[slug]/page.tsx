import type { Metadata } from 'next'
import type { ComponentProps } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Link } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo'
import {
  getArticleBySlug,
  getPublishedArticles,
  localized,
  localizedContent,
  coverMedia,
  type Article,
  type BlogLocale,
} from '@/lib/blog'

export const revalidate = 3600

// Genera los slugs publicados para cada idioma (mismo patrón que /productos/categorias).
export async function generateStaticParams() {
  const articles = await getPublishedArticles(100)
  const locales = ['es', 'en', 'de']
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })))
}

/** URL de imagen para metadata: meta.image del plugin SEO, con fallback a coverImage. */
function seoImageUrl(article: Article): string | undefined {
  const mi = article.meta?.image
  if (mi && typeof mi === 'object' && 'url' in mi && mi.url) return mi.url as string
  return coverMedia(article)?.url ?? undefined
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
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return { title: 'Blog — Kristall Film', robots: { index: false, follow: false } }
  }
  const loc = locale as BlogLocale
  // Override del plugin SEO (meta.*) con fallback al contenido del artículo.
  const title = article.meta?.title || `${localized(article, 'title', loc)} | Kristall Film`
  const description = article.meta?.description || localized(article, 'excerpt', loc)
  const image = seoImageUrl(article)

  return {
    title,
    description,
    alternates: buildAlternates(`/blog/${slug}`, locale),
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://kristallfilm.com/${locale}/blog/${slug}`,
      publishedTime: article.publishedAt ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ArticuloPage({ params }: PageProps) {
  const { locale, slug } = await params
  const loc = locale as BlogLocale

  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = localized(article, 'title', loc)
  const cover = coverMedia(article)
  const date = formatDate(article.publishedAt, locale)
  const content = localizedContent(article, loc) as ComponentProps<typeof RichText>['data'] | null

  return (
    <article className="min-h-screen bg-[var(--bg)]">
      {/* HERO */}
      {cover?.url ? (
        <header className="relative h-[44vh] min-h-[300px] md:h-[58vh] w-full overflow-hidden">
          <Image src={cover.url} alt={cover.alt ?? title} fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="w-full max-w-[860px] mx-auto px-4 md:px-10 pb-10 md:pb-14">
              <Breadcrumb label={t('label')} className="text-white/60 hover:text-white/90" />
              <h1
                className="mt-4 text-3xl md:text-5xl font-medium text-white leading-[1.08] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h1>
              <Meta date={date} author={article.author} className="mt-4 text-white/60" />
            </div>
          </div>
        </header>
      ) : (
        <header className="w-full max-w-[860px] mx-auto px-4 md:px-10 pt-14 md:pt-20">
          <Breadcrumb label={t('label')} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]" />
          <h1
            className="mt-4 text-3xl md:text-5xl font-medium text-[var(--text-primary)] leading-[1.08] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
          <Meta date={date} author={article.author} className="mt-4 text-[var(--text-muted)]" />
        </header>
      )}

      {/* CUERPO (rich text Lexical) */}
      <div
        className={[
          'max-w-[720px] mx-auto px-4 md:px-6 py-10 md:py-16',
          'text-[17px] leading-[1.75] text-[var(--text-secondary)]',
          '[&_h2]:[font-family:var(--font-display)] [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[var(--text-primary)] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-snug',
          '[&_h3]:[font-family:var(--font-display)] [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-[var(--text-primary)] [&_h3]:mt-8 [&_h3]:mb-3',
          '[&_p]:mb-5',
          '[&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2',
          '[&_strong]:font-semibold [&_strong]:text-[var(--text-primary)]',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-5 [&_li]:mb-2',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--border-strong)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-secondary)] [&_blockquote]:my-6',
          '[&_img]:rounded-xl [&_img]:my-6',
        ].join(' ')}
      >
        {content ? <RichText data={content} /> : null}

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <Link href="/blog" className="text-sm font-medium text-[var(--accent)] hover:opacity-70 transition-opacity">
            ← {t('back')}
          </Link>
        </div>
      </div>
    </article>
  )
}

function Breadcrumb({ label, className }: { label: string; className?: string }) {
  return (
    <Link
      href="/blog"
      className={`text-[11px] uppercase tracking-[0.15em] transition-colors ${className ?? ''}`}
    >
      {label}
    </Link>
  )
}

function Meta({ date, author, className }: { date: string; author?: string | null; className?: string }) {
  const parts = [date, author].filter(Boolean) as string[]
  if (parts.length === 0) return null
  return <p className={`text-[13px] ${className ?? ''}`}>{parts.join(' · ')}</p>
}
