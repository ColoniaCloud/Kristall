/**
 * Contenido de /llms.txt y /llms-full.txt, generado desde el catálogo.
 *
 * Antes eran dos archivos escritos a mano en `public/`, y ya habían divergido de
 * `data/catalogo.json`: afirmaban que Karbon tiene 7 años de garantía (son 10),
 * que existen Keram X al 35% y 70% (solo hay 5% y 15%), que el VLT llega hasta
 * 50% (llega a 90%) y que el IR máximo es 95% en Keram X (es 98% en Kaiser).
 * Además omitían tres líneas enteras (Kron, Kore, Kaiser) y no incluían una sola
 * URL, que es justamente para lo que sirve un llms.txt.
 *
 * Al generarse desde `LINEAS` —la misma capa que usa el sitio— cualquier cambio
 * en la planilla llega a estos archivos en el mismo build, sin intervención.
 * Lo único editorial que vive acá es la prosa: el resumen, las FAQ y los
 * programas comerciales, que no salen de la planilla.
 *
 * Se sirven desde app/llms.txt/route.ts y app/llms-full.txt/route.ts en lugar de
 * public/, porque un archivo estático no puede leer el catálogo.
 */
import esMessages from '@/i18n/messages/es.json'
import {
  LINEAS,
  lineasPorNicho,
  productoNombre,
  productoSlug,
  type Linea,
  type Producto,
} from '@/lib/catalogo'
import { BASE } from '@/lib/seo'

/**
 * Idioma único a propósito. El `x-default` del sitio y su locale por defecto son
 * `es`, así que las URLs apuntan a /es/ y la prosa va en español; los otros tres
 * idiomas se anuncian con su link. Antes llms.txt estaba en inglés y
 * llms-full.txt en español, sin una razón.
 */
const LOCALE = 'es'
const U = (path: string) => `${BASE}/${LOCALE}${path}`

const productos = esMessages.products as Record<string, string>
const descripcion = (linea: Linea): string => productos[linea.descKey] ?? ''

/** «VLT 5% · IR 95% · UV 99% · 2 ply · 10 años» — solo los datos que el producto tiene. */
function specs(p: Producto): string {
  return [
    p.vlt != null && `VLT ${p.vlt}%`,
    p.ir != null && `IR ${p.ir}%`,
    p.uvr != null && `UV ${p.uvr}%`,
    p.espesor && `${p.espesor.valor} ${p.espesor.unidad}`,
    p.garantiaAnios != null && `${p.garantiaAnios} años de garantía`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Rango de garantías de una línea: «10 años», o «3–15 años» si varían. */
function garantiaDeLinea(linea: Linea): string | null {
  const años = linea.productos.map((p) => p.garantiaAnios).filter((v): v is number => v != null)
  if (años.length === 0) return null
  const min = Math.min(...años)
  const max = Math.max(...años)
  return min === max ? `${min} años` : `${min}–${max} años`
}

// ---------------------------------------------------------------------------
// /llms.txt — el índice. Formato llmstxt.org: H1, resumen, y secciones de links.
// ---------------------------------------------------------------------------

export function buildLlmsTxt(): string {
  const lineasDe = (nicho: 'autos' | 'arquitectura') =>
    lineasPorNicho(nicho)
      .map((l) => {
        const gar = garantiaDeLinea(l)
        const meta = [l.tecnologia, gar].filter(Boolean).join(', ')
        return `- [${l.nombre}](${U(`/productos/lineas/${l.slug}`)})${meta ? ` — ${meta}.` : ''} ${descripcion(l)}`
      })
      .join('\n')

  return `# Kristall Film

> Distribuidor oficial de láminas de control solar, seguridad y protección de pintura (PPF) de
> tecnología alemana para automotriz y arquitectura, con operación en Argentina y América Latina.
> Vende a instaladores profesionales, distribuidores, concesionarias y empresas de aberturas; también
> publica información técnica para el usuario final. Catálogo de ${LINEAS.reduce((n, l) => n + l.productos.length, 0)} productos en ${LINEAS.length} líneas.

## Catálogo — automotriz

${lineasDe('autos')}

## Catálogo — arquitectura

${lineasDe('arquitectura')}

## Programas comerciales

- [Punto Kristall](${U('/punto-kristall')}) — red de talleres e instaladores certificados: precios de
  distribución, derivación de clientes, material de punto de venta y acceso al portal de gestión.
- [Programa para concesionarias](${U('/concesionarias')}) — polarizado como margen adicional en la
  entrega de 0 km, sin exigir exclusividad.
- [Propuesta Aberturas](${U('/propuesta-aberturas')}) — programa de socios para empresas de aberturas
  y vidrierías que suman lámina arquitectónica como unidad de negocio.

## Software y garantías

- [Software para instaladores](${U('/servicios')}) — Polarized App: órdenes de trabajo digitales,
  control de stock de rollos y emisión de garantías.
- [Portal de Instaladores](${BASE}/cliente/ingresar) — acceso de la red: compras, stock, garantías y
  reclamos. Requiere cuenta.
- [Verificar una garantía](${BASE}/garantia) — el usuario final consulta el estado de la garantía de
  su lámina con el token que recibió al comprar, sin crear cuenta.

## La empresa

- [Nosotros](${U('/nosotros')}) — historia, tecnología y respaldo de la marca.
- [Contacto](${U('/contacto')}) — asesoramiento comercial y técnico.
- [Blog](${U('/blog')}) — notas técnicas, guías de instalación y novedades.
- [Catálogo completo](${U('/productos')}) — todas las líneas con sus fichas técnicas.

## Datos técnicos completos

- [/llms-full.txt](${BASE}/llms-full.txt) — tabla de especificaciones producto por producto (VLT, IR,
  UV, espesor, garantía), FAQ técnicas y glosario.

## Otros idiomas

El sitio está en español (canónico), inglés, alemán y portugués. La misma ruta con otro prefijo de
idioma: ${BASE}/en, ${BASE}/de, ${BASE}/pt.

## Contacto

- Sitio: ${BASE}
- Email: hola@kristallfilm.com
- WhatsApp / teléfono: +54 9 11 6048-4312
- Showroom y centro de distribución: Av. Juan B Justo 2918, CABA, Buenos Aires, Argentina
- Instagram: https://www.instagram.com/kristallfilm.la
- LinkedIn: https://www.linkedin.com/company/135156381
`
}

// ---------------------------------------------------------------------------
// /llms-full.txt — la base de conocimiento.
// ---------------------------------------------------------------------------

function tablaDeNicho(nicho: 'autos' | 'arquitectura'): string {
  const filas = lineasPorNicho(nicho).flatMap((linea) =>
    linea.productos.map((p) => {
      const celda = (v: number | null | undefined, suf = '%') => (v == null ? '—' : `${v}${suf}`)
      return `| ${productoNombre(p)} | ${p.codigo} | ${linea.nombre} | ${linea.categoria} | ${linea.tecnologia || '—'} | ${celda(p.vlt)} | ${celda(p.ir)} | ${celda(p.uvr)} | ${p.espesor ? `${p.espesor.valor} ${p.espesor.unidad}` : '—'} | ${celda(p.garantiaAnios, ' años')} | ${U(`/productos/lineas/${linea.slug}/${productoSlug(p)}`)} |`
    }),
  )

  return [
    '| Producto | Código | Línea | Categoría | Tecnología | VLT | IR | UV | Espesor | Garantía | Ficha |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...filas,
  ].join('\n')
}

function detalleDeLineas(nicho: 'autos' | 'arquitectura'): string {
  return lineasPorNicho(nicho)
    .map((linea) => {
      const gar = garantiaDeLinea(linea)

      // Solo se filtran las líneas condicionales. Un filter(Boolean) sobre todo el
      // array se come los '' que separan los bloques, y el markdown sale sin
      // líneas en blanco: el encabezado, la descripción y la lista quedan pegados.
      const datos = [
        `- Nicho: ${nicho === 'autos' ? 'automotriz' : 'arquitectura'}`,
        `- Categoría: ${linea.categoria}`,
        linea.tecnologia && `- Tecnología: ${linea.tecnologia}`,
        gar && `- Garantía: ${gar}`,
        `- Página: ${U(`/productos/lineas/${linea.slug}`)}`,
      ].filter((l): l is string => typeof l === 'string')

      const cabecera = [
        `### ${linea.nombre}`,
        '',
        descripcion(linea),
        '',
        ...datos,
        '',
        `Productos (${linea.productos.length}):`,
        '',
      ].join('\n')

      const items = linea.productos
        .map((p) => `- **${productoNombre(p)}** (${p.codigo}) — ${specs(p)}. ${U(`/productos/lineas/${linea.slug}/${productoSlug(p)}`)}`)
        .join('\n')

      return `${cabecera}\n${items}`
    })
    .join('\n\n')
}

export function buildLlmsFullTxt(): string {
  const todos = LINEAS.flatMap((l) => l.productos)
  const definidos = <T,>(vs: (T | null | undefined)[]) => vs.filter((v): v is T => v != null)
  const vlts = definidos(todos.map((p) => p.vlt))
  const irs = definidos(todos.map((p) => p.ir))
  const gars = definidos(todos.map((p) => p.garantiaAnios))
  const irMax = Math.max(...irs)
  const lineaIrMax = LINEAS.find((l) => l.productos.some((p) => p.ir === irMax))
  const garMax = Math.max(...gars)
  const lineaGarMax = LINEAS.find((l) => l.productos.some((p) => p.garantiaAnios === garMax))
  const uvrValores = [...new Set(definidos(todos.map((p) => p.uvr)))].sort((a, b) => b - a)

  return `# Kristall Film — base de conocimiento técnica

> Distribuidor oficial de láminas de control solar, seguridad y protección de pintura (PPF) de
> tecnología alemana. Opera en Argentina y América Latina vendiendo a instaladores profesionales,
> distribuidores, concesionarias y empresas de aberturas.
>
> Este archivo se genera automáticamente desde el catálogo en cada build, así que los valores de abajo
> son los vigentes. Índice de páginas: ${BASE}/llms.txt

## 1. Resumen del catálogo

- Líneas: ${LINEAS.length} (${lineasPorNicho('autos').length} automotrices, ${lineasPorNicho('arquitectura').length} de arquitectura)
- Productos: ${todos.length}
- VLT disponible: ${Math.min(...vlts)}% a ${Math.max(...vlts)}%
- Rechazo IR máximo: ${irMax}%${lineaIrMax ? ` (${lineaIrMax.nombre})` : ''}
- Bloqueo UV: ${uvrValores.join('%, ')}% según línea — no es un valor único en todo el catálogo
- Garantía: ${Math.min(...gars)} a ${garMax} años${lineaGarMax ? ` (${garMax} años en ${lineaGarMax.nombre})` : ''}
- Catálogo completo: ${U('/productos')}

## 2. Especificaciones — automotriz

${tablaDeNicho('autos')}

## 3. Especificaciones — arquitectura

${tablaDeNicho('arquitectura')}

## 4. Líneas automotrices en detalle

${detalleDeLineas('autos')}

## 5. Líneas de arquitectura en detalle

${detalleDeLineas('arquitectura')}

## 6. Glosario y FAQ técnicas

### ¿Qué significa VLT?
VLT es *Visible Light Transmission* (transmisión de luz visible): el porcentaje de luz visible que
atraviesa el vidrio con la lámina aplicada. Un VLT de 5% es muy oscuro y da máxima privacidad; uno de
70% o 90% es casi transparente. Un VLT bajo no implica más rechazo de calor: son propiedades distintas.

### ¿Qué es el rechazo IR y por qué no es lo mismo que el VLT?
El rechazo infrarrojo mide qué proporción de la radiación infrarroja —la que se percibe como calor— no
pasa. Por eso una lámina clara con tecnología cerámica puede rechazar más calor que una oscura sin ella.
En este catálogo el contraste es directo: Kron al 5% de VLT rechaza 11% de IR, mientras Kaiser al 70% de
VLT rechaza ${irMax}%.

### ¿Qué diferencia hay entre nanocarbono y nanocerámica?
Nanocarbono (Karbon) usa partículas de carbono: buen rechazo térmico, estabilidad de color y sin
interferencia en señales de telefonía o GPS. Nanocerámica (Keram X) es la tecnología de mayor bloqueo
infrarrojo de la línea automotriz, y permite bajar la temperatura interior sin depender de un tono
oscuro.

### ¿Qué significan «1 ply», «2 ply» y las medidas en mil?
«Ply» son las capas laminadas entre sí: 1 ply es monocapa, 2 ply es bicapa y en general implica mejor
calidad óptica y durabilidad. Las medidas en mil (milésimas de pulgada) se usan en las láminas donde lo
que importa es el espesor: seguridad y PPF. A más mil, más resistencia al impacto.

### ¿El bloqueo UV es 99% en todas las láminas?
No. Las líneas de control solar bloquean 99% de UV, pero el catálogo tiene excepciones que conviene no
generalizar: las láminas de seguridad transparente Klear declaran 25% y Klass 15 declara 92%. El valor
exacto de cada producto está en las tablas de arriba.

### ¿Cuánto dura la garantía y qué cubre?
Va de ${Math.min(...gars)} a ${garMax} años según la línea, y cubre defectos de la lámina —decoloración, burbujas,
desprendimiento—, no daños por mala instalación ni por uso indebido. La garantía es digital y
trazable: cada rollo instalado genera un certificado verificable en ${BASE}/garantia.

### ¿Qué es el PPF y en qué se diferencia del polarizado?
El PPF (*paint protection film*) es una película de poliuretano termoplástico transparente que se aplica
sobre la pintura de la carrocería, no sobre los vidrios, para protegerla de impactos de piedras, rayones
y agentes de carretera. Tiene autorreparación térmica: los rayones superficiales se cierran con calor.
El polarizado, en cambio, va en los vidrios y su función es control solar y privacidad.

### ¿Kristall Film fabrica las láminas?
Kristall Film es el distribuidor oficial de la marca en la región y opera la red de instaladores
certificados; el producto se fabrica bajo estándares alemanes de ingeniería.

### ¿Qué VLT es legal en un vehículo?
Depende de la jurisdicción y del vidrio de que se trate, y cambia entre países y provincias. Kristall
Film ofrece VLT de ${Math.min(...vlts)}% a ${Math.max(...vlts)}%, pero la elección legal para un vehículo hay que verificarla con
la normativa vigente del lugar de radicación. Para eso conviene consultar al instalador certificado más
cercano: ${U('/contacto')}.

## 7. Programas comerciales

### Punto Kristall — ${U('/punto-kristall')}
Red oficial de talleres e instaladores certificados. Incluye precios de distribución, derivación de
clientes, material de punto de venta, capacitación y acceso al portal de gestión con emisión de
garantías digitales.

### Concesionarias — ${U('/concesionarias')}
Programa para que la concesionaria sume el polarizado como margen adicional en la entrega de 0 km, sin
exigir exclusividad, con garantía digital y respaldo técnico y comercial.

### Propuesta Aberturas — ${U('/propuesta-aberturas')}
Programa de socios para empresas de aberturas y vidrierías que incorporan lámina arquitectónica como
unidad de negocio nueva, con soporte técnico y comercial y garantía digital en cada instalación.

## 8. Software

**Polarized App** es el software de gestión para los centros de instalación certificados: órdenes de
trabajo digitales, control de stock de rollos en tiempo real, reportes y emisión de certificados de
garantía trazables. Información: ${U('/servicios')}

El **Portal de Instaladores** es la superficie donde la red entra a su cuenta para ver compras, stock,
garantías y reclamos: ${BASE}/cliente/ingresar

Las **garantías** tienen una verificación pública: el usuario final consulta el estado de la garantía de
su lámina con el token que recibió al comprar, sin necesidad de crear una cuenta, en ${BASE}/garantia

## 9. Contacto

- Sitio: ${BASE}
- Email: hola@kristallfilm.com
- WhatsApp / teléfono: +54 9 11 6048-4312
- Showroom y centro de distribución: Av. Juan B Justo 2918, CABA, Buenos Aires, Argentina
- Instagram: https://www.instagram.com/kristallfilm.la
- Facebook: https://www.facebook.com/people/Kristall-Film-Latam/61590712143296/
- LinkedIn: https://www.linkedin.com/company/135156381
- Idiomas del sitio: español (canónico), inglés, alemán, portugués
`
}
