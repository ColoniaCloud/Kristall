/**
 * Catálogo Kristall Film — capa de lectura sobre data/catalogo.json.
 *
 * data/catalogo.json es generado por scripts/sync-catalogo.mjs a partir de la
 * planilla de Google Sheets (fuente de verdad del catálogo). NO se edita a
 * mano: un cambio de producto se hace en la planilla y se sincroniza con
 * `pnpm catalogo:sync` (corre solo antes de cada build, vía el hook `prebuild`).
 *
 * Lo que SÍ vive en este archivo es la capa editorial que la planilla no
 * tiene: a qué clave de i18n apunta la descripción de cada línea, y el orden
 * en que aparecen en el home. Las descripciones en sí están en
 * i18n/messages/{es,en,de}.json bajo el namespace `products`.
 */
import catalogoJson from '@/data/catalogo.json'

export type Nicho = 'autos' | 'arquitectura'
export type Categoria = 'standard' | 'premium'

export const NICHOS: Nicho[] = ['autos', 'arquitectura']
export const CATEGORIAS: Categoria[] = ['standard', 'premium']

export interface Espesor {
  valor: number
  unidad: 'ply' | 'mil'
}

/** Un producto = una fila de la planilla (un código Kristall). */
export interface Producto {
  codigo: string
  linea: string
  lineaSlug: string
  nicho: Nicho
  categoria: Categoria
  tecnologia: string | null
  vlt: number | null
  uvr: number | null
  ir: number | null
  garantiaAnios: number | null
  espesor: Espesor | null
}

/** Una línea = todos los productos que comparten "Linea" en la planilla. */
export interface Linea {
  slug: string
  nombre: string
  nicho: Nicho
  categoria: Categoria
  tecnologia: string
  garantiaAnios: number | null
  /** Clave i18n de la descripción (namespace `products`). */
  descKey: string
  productos: Producto[]
}

/**
 * Clave i18n de descripción por línea. Es editorial (no viene de la
 * planilla), así que si aparece una línea nueva hay que sumarla acá — el
 * chequeo de abajo lo hace ruidoso en vez de silencioso.
 */
const DESC_KEY_BY_SLUG: Record<string, string> = {
  klass: 'cat_klass_desc',
  kortex: 'cat_kortex_desc',
  kron: 'cat_kron_desc',
  klar: 'cat_klar_desc',
  kryon: 'cat_kryon_desc',
  kore: 'cat_kore_desc',
  karbon: 'cat_karbon_desc',
  'keram-x': 'cat_keramx_desc',
  krypton: 'cat_krypton_desc',
  ppf: 'cat_ppf_desc',
  kaiser: 'cat_kaiser_desc',
  'kreflect-silver': 'cat_kreflect_silver_desc',
  klear: 'cat_klear_desc',
  knight: 'cat_knight_desc',
  'kwhite-matte': 'cat_kwhite_matte_desc',
  'kdecor-stripe': 'cat_kdecor_stripe_desc',
}

/** Todos los productos, en el orden de la planilla. */
export const PRODUCTOS: Producto[] = (catalogoJson as { productos: Producto[] }).productos

/** Agrupa productos en líneas, preservando el orden de aparición en la planilla. */
function construirLineas(productos: Producto[]): Linea[] {
  const orden: string[] = []
  const porSlug = new Map<string, Producto[]>()
  for (const p of productos) {
    if (!porSlug.has(p.lineaSlug)) {
      orden.push(p.lineaSlug)
      porSlug.set(p.lineaSlug, [])
    }
    porSlug.get(p.lineaSlug)!.push(p)
  }

  const faltantes = orden.filter((slug) => !(slug in DESC_KEY_BY_SLUG))
  if (faltantes.length) {
    throw new Error(
      `lib/catalogo.ts: falta descKey para la(s) línea(s) nueva(s) [${faltantes.join(', ')}]. ` +
        'Agregalas a DESC_KEY_BY_SLUG y su traducción en i18n/messages/{es,en,de}.json antes de compilar.',
    )
  }

  return orden.map((slug) => {
    const productosDeLinea = porSlug.get(slug)!
    const [primero] = productosDeLinea
    return {
      slug,
      nombre: primero.linea,
      nicho: primero.nicho,
      categoria: primero.categoria,
      tecnologia: primero.tecnologia ?? '',
      garantiaAnios: primero.garantiaAnios,
      descKey: DESC_KEY_BY_SLUG[slug],
      productos: productosDeLinea,
    }
  })
}

/** Todas las líneas, en el orden de la planilla (autos primero, arquitectura después). */
export const LINEAS: Linea[] = construirLineas(PRODUCTOS)

export const LINEA_SLUGS: string[] = LINEAS.map((l) => l.slug)

const LINEA_BY_SLUG: Record<string, Linea> = Object.fromEntries(LINEAS.map((l) => [l.slug, l]))

export const getLinea = (slug: string): Linea | undefined => LINEA_BY_SLUG[slug]

export const lineasPorNicho = (nicho: Nicho): Linea[] => LINEAS.filter((l) => l.nicho === nicho)

export const productosPorLinea = (slug: string): Producto[] => getLinea(slug)?.productos ?? []

const PRODUCTO_BY_CODIGO: Record<string, Producto> = Object.fromEntries(
  PRODUCTOS.map((p) => [p.codigo, p]),
)

export const getProducto = (codigo: string): Producto | undefined => PRODUCTO_BY_CODIGO[codigo]

/**
 * Nombre comercial de un producto, ej. "Klass 15", "Klear 8 mil", "Kaiser".
 *
 * Se arma solo con lo que hace falta para distinguirlo de sus hermanos de
 * línea: si el VLT ya es único dentro de la línea, alcanza con el VLT (la
 * gran mayoría de los casos). Si dos productos de la misma línea comparten
 * VLT (p. ej. Klear 8 mil / 12 mil, ambos VLT 90), se agrega el espesor. Si
 * la línea tiene un solo producto, el nombre de línea alcanza.
 */
const NOMBRE_BY_CODIGO: Record<string, string> = (() => {
  const nombres: Record<string, string> = {}
  for (const linea of LINEAS) {
    const { productos } = linea
    if (productos.length <= 1) {
      for (const p of productos) nombres[p.codigo] = linea.nombre
      continue
    }
    const vltValores = productos.map((p) => p.vlt)
    const vltEsUnico = vltValores.every((v) => v != null) && new Set(vltValores).size === productos.length
    for (const p of productos) {
      const etiqueta = vltEsUnico
        ? `${p.vlt}`
        : p.espesor
          ? `${p.espesor.valor} ${p.espesor.unidad}`
          : p.codigo
      nombres[p.codigo] = `${linea.nombre} ${etiqueta}`
    }
  }
  return nombres
})()

export const productoNombre = (p: Producto): string => NOMBRE_BY_CODIGO[p.codigo] ?? p.linea

/**
 * Rutas de imagen por línea. El archivo se sube con el nombre del slug, en
 * minúsculas — salvo estas 4 líneas de nombre compuesto, donde el archivo
 * quedó más corto que el slug (decisión editorial al crear los assets, no
 * un error). Si una línea nueva no tiene foto subida, el navegador pide un
 * 404 y next/image cae al layout vacío; no rompe el build.
 */
const ASSET_SLUG_OVERRIDES: Record<string, string> = {
  'keram-x': 'keramx',
  'kreflect-silver': 'kreflect',
  'kwhite-matte': 'kwhite',
  'kdecor-stripe': 'kdecor',
}
const assetSlug = (slug: string): string => ASSET_SLUG_OVERRIDES[slug] ?? slug

export const lineaLogoSrc = (slug: string): string => `/Productos/logo-linea/${assetSlug(slug)}.svg`
export const lineaDestacadaSrc = (slug: string): string => `/Productos/destacadas/${assetSlug(slug)}.png`

/**
 * Foto destacada de un producto puntual (una lámina específica, no la línea
 * entera) — archivo nombrado con su código Kristall en minúsculas, ej.
 * KLS05 → kls05.png. Todavía no todos los productos tienen la suya (hoy
 * cubre autos salvo PPF; arquitectura ninguno) — quien la usa debe caer a
 * lineaDestacadaSrc si esta pega un 404.
 */
export const productoDestacadaSrc = (p: Producto): string => `/Productos/destacadas/${p.codigo.toLowerCase()}.png`

