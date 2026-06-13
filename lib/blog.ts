/**
 * Acceso al blog (collection `articles` de Payload).
 *
 * La collection usa i18n por SUFIJO (title_es / excerpt_es / content_es, …) y un
 * campo `status` select (draft/published) — NO localización nativa ni drafts. Por
 * eso filtramos por `status` y resolvemos el idioma leyendo `campo_${locale}`.
 *
 * Los `meta.*` provienen del plugin SEO (@payloadcms/plugin-seo), un único grupo
 * no localizado que usamos como override de título/descr./imagen en metadata.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

export type BlogLocale = 'es' | 'en' | 'de'

export interface MediaDoc {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export interface SeoMeta {
  title?: string | null
  description?: string | null
  image?: MediaDoc | string | null
}

export interface Article {
  id: string | number
  slug: string
  status?: 'draft' | 'published' | null
  category?: string | null
  author?: string | null
  publishedAt?: string | null
  coverImage?: MediaDoc | string | null
  meta?: SeoMeta | null
  // i18n por sufijo
  title_es?: string | null
  title_en?: string | null
  title_de?: string | null
  excerpt_es?: string | null
  excerpt_en?: string | null
  excerpt_de?: string | null
  content_es?: unknown
  content_en?: unknown
  content_de?: unknown
  [key: string]: unknown
}

/** Texto localizado con fallback al español (idioma base del catálogo). */
export function localized(article: Article, base: 'title' | 'excerpt', locale: BlogLocale): string {
  return (
    (article[`${base}_${locale}`] as string | null | undefined) ??
    (article[`${base}_es`] as string | null | undefined) ??
    ''
  )
}

/** Rich text Lexical localizado con fallback al español. */
export function localizedContent(article: Article, locale: BlogLocale): unknown {
  return article[`content_${locale}`] ?? article.content_es ?? null
}

/** Devuelve el objeto Media poblado (depth ≥ 1) o null si no hay imagen. */
export function coverMedia(article: Article): MediaDoc | null {
  const c = article.coverImage
  return c && typeof c === 'object' ? (c as MediaDoc) : null
}

/**
 * Artículos publicados, más recientes primero. Tolerante a fallos: si el CMS no
 * está accesible (p. ej. durante el build sin DB) devuelve [] en vez de romper.
 */
export async function getPublishedArticles(limit = 12): Promise<Article[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 1,
      limit,
    })
    return docs as unknown as Article[]
  } catch (err) {
    console.error('[blog] getPublishedArticles failed:', err)
    return []
  }
}

/** Un artículo publicado por slug, o null si no existe. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'articles',
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
      },
      depth: 1,
      limit: 1,
    })
    return (docs[0] as unknown as Article) ?? null
  } catch (err) {
    console.error(`[blog] getArticleBySlug("${slug}") failed:`, err)
    return null
  }
}
