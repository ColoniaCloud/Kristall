/**
 * Sincroniza el catálogo desde la planilla de Google Drive a data/catalogo.json.
 *
 *   pnpm catalogo:sync          descarga, valida y reescribe el JSON
 *   pnpm catalogo:sync --check  valida sin escribir (útil en CI)
 *
 * Corre también antes de cada build (script `prebuild`), así cada deploy sale
 * con el catálogo del momento. Si la descarga falla pero ya hay un JSON
 * commiteado, el build sigue con ese y avisa; si los datos descargados no
 * validan, el build se corta. Un dato roto nunca llega a producción.
 *
 * La planilla es la fuente de verdad: NO editar data/catalogo.json a mano.
 */
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'data/catalogo.json')

// Documento público "Catalogo kristall". Se puede pisar con la env var para
// apuntar a una copia de prueba sin tocar el código.
const SHEET_ID = process.env.CATALOGO_SHEET_ID || '1W5bK-elmOc3n8_spbgWrHPFgD-aylY3d'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`

const CHECK_ONLY = process.argv.includes('--check')

/** Columnas esperadas, en orden, arrancando en la B (la A viene vacía). */
const COLUMNAS = [
  'Categoría',
  'Subcateogira',
  'Linea',
  'Codigo Kristall',
  'Codigo China',
  'VLT',
  'UVR',
  'IR',
  'Garantia',
  'Thickness',
  'Stock',
]

const NICHOS = { AUTOS: 'autos', ARQUITECTURA: 'arquitectura' }
const CATEGORIAS = { STANDARD: 'standard', PREMIUM: 'premium' }

/** Parser CSV con soporte de comillas (RFC 4180). */
function parseCsv(text) {
  const filas = []
  let fila = []
  let campo = ''
  let enComillas = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (enComillas) {
      if (c === '"') {
        if (text[i + 1] === '"') { campo += '"'; i++ } else { enComillas = false }
      } else campo += c
    } else if (c === '"') enComillas = true
    else if (c === ',') { fila.push(campo); campo = '' }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = '' }
    else if (c !== '\r') campo += c
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila) }
  return filas
}

const limpio = (v) => (v ?? '').trim()

/** "5" → 5 · "" → null. Devuelve NaN si hay basura, para que el caller falle. */
function numero(v) {
  const s = limpio(v).replace(',', '.')
  if (s === '') return null
  return Number(s)
}

/** "2 ply" → {valor:2, unidad:'ply'} · "7,5mil" → {valor:7.5, unidad:'mil'} */
function espesor(v) {
  const s = limpio(v)
  if (s === '') return null
  const m = s.match(/^([\d.,]+)\s*(ply|mil)$/i)
  if (!m) return undefined // undefined = formato inválido
  return { valor: Number(m[1].replace(',', '.')), unidad: m[2].toLowerCase() }
}

/** "Keram X" → "keram-x" · "KReflect Silver" → "kreflect-silver" */
function slugify(nombre) {
  return limpio(nombre)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parsearCatalogo(csv) {
  const filas = parseCsv(csv)
  const errores = []
  const productos = []
  const vistos = new Map()
  let nicho = null

  const encabezado = filas[0]?.slice(1, 1 + COLUMNAS.length).map(limpio) ?? []
  COLUMNAS.forEach((esperada, i) => {
    if (encabezado[i] !== esperada) {
      errores.push(
        `Encabezado: la columna ${i + 1} dice "${encabezado[i] ?? '(vacía)'}" y se esperaba "${esperada}". ` +
          `Si renombraste o moviste columnas en la planilla, hay que actualizar COLUMNAS en este script.`,
      )
    }
  })
  if (errores.length) return { productos, errores }

  for (let i = 1; i < filas.length; i++) {
    const nroFila = i + 1 // como se ve en la planilla
    const [, categoria, subcategoria, linea, codigo, , vlt, uvr, ir, garantia, thickness] =
      filas[i].map(limpio)

    // Fila separadora de nicho: solo la primera celda tiene texto.
    if (categoria in NICHOS && !linea && !codigo) { nicho = NICHOS[categoria]; continue }
    // Filas vacías y encabezados repetidos en el medio de la planilla.
    if (!codigo) continue
    if (linea === 'Linea' && codigo === 'Codigo Kristall') continue

    if (!nicho) {
      errores.push(`Fila ${nroFila} (${codigo}): aparece antes de cualquier fila AUTOS o ARQUITECTURA.`)
      continue
    }
    if (!(categoria in CATEGORIAS)) {
      errores.push(`Fila ${nroFila} (${codigo}): categoría "${categoria}" — se espera STANDARD o PREMIUM.`)
      continue
    }
    if (!linea) {
      errores.push(`Fila ${nroFila} (${codigo}): sin línea.`)
      continue
    }
    if (vistos.has(codigo)) {
      errores.push(`Fila ${nroFila}: el código "${codigo}" ya se usó en la fila ${vistos.get(codigo)}.`)
      continue
    }
    vistos.set(codigo, nroFila)

    const nums = { vlt: numero(vlt), uvr: numero(uvr), ir: numero(ir), garantiaAnios: numero(garantia) }
    for (const [campo, valor] of Object.entries(nums)) {
      if (valor !== null && !Number.isFinite(valor)) {
        errores.push(`Fila ${nroFila} (${codigo}): ${campo} no es un número.`)
      }
    }
    const esp = espesor(thickness)
    if (esp === undefined) {
      errores.push(`Fila ${nroFila} (${codigo}): espesor "${thickness}" — se espera algo como "2 ply" o "8 mil".`)
    }

    productos.push({
      codigo,
      linea,
      lineaSlug: slugify(linea),
      nicho,
      categoria: CATEGORIAS[categoria],
      tecnologia: subcategoria || null,
      ...nums,
      espesor: esp ?? null,
    })
  }

  if (!productos.length) errores.push('La planilla no devolvió ningún producto.')
  return { productos, errores }
}

async function main() {
  let csv
  try {
    const res = await fetch(SHEET_URL, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const tipo = res.headers.get('content-type') ?? ''
    if (!tipo.includes('text/csv')) {
      // Google devuelve HTML de login cuando el documento dejó de ser público.
      throw new Error(`la respuesta no es CSV (${tipo}). ¿La planilla sigue siendo accesible por link?`)
    }
    csv = await res.text()
  } catch (err) {
    const motivo = err instanceof Error ? err.message : String(err)
    if (existsSync(OUT)) {
      console.warn(`[catalogo] No se pudo descargar la planilla: ${motivo}`)
      console.warn('[catalogo] Sigo con el data/catalogo.json commiteado.')
      return
    }
    console.error(`[catalogo] No se pudo descargar la planilla y no hay JSON previo: ${motivo}`)
    process.exit(1)
  }

  const { productos, errores } = parsearCatalogo(csv)

  if (errores.length) {
    console.error(`[catalogo] La planilla tiene ${errores.length} problema(s):`)
    errores.forEach((e) => console.error(`  · ${e}`))
    process.exit(1)
  }

  const lineas = [...new Set(productos.map((p) => p.lineaSlug))]
  const salida = {
    _comentario: 'Generado por scripts/sync-catalogo.mjs desde Google Sheets. No editar a mano.',
    generadoEl: new Date().toISOString(),
    productos,
  }
  const json = JSON.stringify(salida, null, 2) + '\n'

  if (CHECK_ONLY) {
    const previo = existsSync(OUT) ? readFileSync(OUT, 'utf8') : ''
    const iguales = previo.replace(/"generadoEl":.*\n/, '') === json.replace(/"generadoEl":.*\n/, '')
    console.log(
      iguales
        ? '[catalogo] OK: el JSON commiteado coincide con la planilla.'
        : '[catalogo] El JSON commiteado quedó desactualizado. Corré: pnpm catalogo:sync',
    )
    process.exit(iguales ? 0 : 1)
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, json, 'utf8')

  const porNicho = Object.values(NICHOS)
    .map((n) => `${productos.filter((p) => p.nicho === n).length} en ${n}`)
    .join(', ')
  console.log(`[catalogo] ${productos.length} productos (${porNicho}) · ${lineas.length} líneas → data/catalogo.json`)
}

main()
