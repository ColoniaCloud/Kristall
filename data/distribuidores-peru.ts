/**
 * Contenido de /distribuidores-peru — Programa Distribuidor Autorizado Perú.
 *
 * Copiado del borrador "Kristall_Distribuidor_Autorizado_Peru.pdf" (2026-11-08).
 * No sale de `data/lanzamiento.ts` a propósito: el PDF es el documento de la
 * dirección para Perú y tiene sus propias decisiones (Kryon no figura, y Kore
 * va sin cifra de IR porque "se elige por calidad óptica"). Si cambia el PDF,
 * se cambia acá.
 *
 * El tono es de "usted", como el borrador: es el registro habitual en Perú.
 */

export type LineaPeru = {
  slug: string
  nombre: string
  tecnologia: string
  vlt: string
  ir: string
  uv: string
  garantia: string
}

/** Las premium que se destacan arriba de la tabla (4 del PDF + 2 de arquitectura), con su foto del catálogo. */
export const DESTACADAS: {
  nombre: string
  descripcion: string
  datos: string
  foto: string
  rubro: 'Automotriz' | 'Arquitectura'
}[] = [
  {
    nombre: 'KeramX',
    descripcion: 'Nanoceramic de alto rendimiento, rechazo infrarrojo superior y claridad óptica excepcional.',
    datos: '95% IR · 99% UV · 10 años',
    foto: '/Productos/destacadas/keramx.png',
    rubro: 'Automotriz',
  },
  {
    nombre: 'Krypton',
    descripcion: 'Seguridad y nanoceramic en una sola lámina: refuerza el vidrio y retiene fragmentos ante impactos.',
    datos: '95% IR · 99% UV · 4 mil · 10 años',
    foto: '/Productos/destacadas/krypton.png',
    rubro: 'Automotriz',
  },
  {
    nombre: 'PPF',
    descripcion: 'TPU transparente autorreparable que protege la pintura de impactos, rayones y agentes externos.',
    datos: 'TPU 7.5 mil · 15 años',
    foto: '/Productos/destacadas/ppf.png',
    rubro: 'Automotriz',
  },
  {
    nombre: 'Karbon',
    descripcion: 'Nanocarbono con alto rechazo térmico, gran claridad y sin interferencia en señales electrónicas.',
    datos: '86% IR · 99% UV · 10 años',
    foto: '/Productos/destacadas/karbon.png',
    rubro: 'Automotriz',
  },
  {
    nombre: 'Kaiser',
    descripcion: 'Nanoceramic con sputtering: control solar superior y excelente claridad óptica para obras de alta exigencia.',
    datos: '98% IR · 99% UV · 10 años',
    foto: '/Productos/destacadas/kaiser.png',
    rubro: 'Arquitectura',
  },
  {
    nombre: 'KReflect Silver',
    descripcion: 'Acabado espejado de alto rendimiento: reduce la ganancia térmica y aporta privacidad en superficies vidriadas.',
    datos: '88–90% IR · 99% UV · 6 años',
    foto: '/Productos/destacadas/kreflect.png',
    rubro: 'Arquitectura',
  },
]

/** Tabla completa, en el orden del PDF (de la más cara a la más accesible, PPF al final). */
export const TABLA: LineaPeru[] = [
  { slug: 'keramx', nombre: 'KeramX', tecnologia: 'Nanoceramic · 2 ply', vlt: '5 · 15', ir: '95%', uv: '99%', garantia: '10 años' },
  { slug: 'krypton', nombre: 'Krypton', tecnologia: 'Nanoceramic · Seguridad', vlt: '15', ir: '95%', uv: '99%', garantia: '10 años' },
  { slug: 'karbon', nombre: 'Karbon', tecnologia: 'Nanocarbono · 2 ply', vlt: '5 · 15', ir: '86%', uv: '99%', garantia: '10 años' },
  { slug: 'kore', nombre: 'Kore', tecnologia: 'Dyed + Sputtering · 2 ply', vlt: '5 · 15', ir: '—', uv: '99%', garantia: '5 años' },
  { slug: 'kron', nombre: 'Kron', tecnologia: 'Dyed · 1 ply', vlt: '5 · 15 · 50', ir: '11%', uv: '99%', garantia: '3 años' },
  { slug: 'klass', nombre: 'Klass', tecnologia: 'Dyed · 1 ply', vlt: '5 · 15', ir: '20%', uv: '99%', garantia: '3 años' },
  { slug: 'ppf', nombre: 'PPF', tecnologia: 'TPU self-healing · 7.5 mil', vlt: 'Transparente', ir: '—', uv: '—', garantia: '15 años' },
]

/**
 * Líneas de arquitectura. Los datos salen de `data/catalogo.json` (la planilla
 * del catálogo), no del PDF: el borrador no las trae.
 */
export const TABLA_ARQUITECTURA: LineaPeru[] = [
  { slug: 'kaiser', nombre: 'Kaiser', tecnologia: 'Nanoceramic + sputtering · 2 ply', vlt: '70', ir: '98%', uv: '99%', garantia: '10 años' },
  { slug: 'kreflect', nombre: 'KReflect Silver', tecnologia: 'Espejado · 2 ply', vlt: '5 · 15', ir: '88–90%', uv: '99%', garantia: '6 años' },
]

export const POR_QUE: { titulo: string; texto: string }[] = [
  {
    titulo: 'Garantía Digital',
    texto:
      'Código único por rollo e instalación. El cliente la activa desde el celular y el instalador queda registrado como responsable. Reclamos con seguimiento: control de calidad y confianza en cada auto.',
  },
  {
    titulo: 'Suite Kristall',
    texto:
      'Portal de Cliente con compras, pagos, stock y avisos. Mi Taller con agenda, órdenes de trabajo y fichero de clientes. Página de turnos propia para cada taller, optimizada para aparecer en Google.',
  },
  {
    titulo: 'Marca y contenido',
    texto:
      'Estándares de imagen, material para redes y comunicación al cliente final. El mensaje es simple: «Exige tu Garantía Digital Kristall». La demanda llega a su red.',
  },
  {
    titulo: 'Red certificada',
    texto:
      'Instaladores certificados que trabajan con estándares de calidad y quedan registrados en cada Garantía Digital. Cada trabajo lleva el respaldo de la marca.',
  },
]

export const RECIBE: { titulo: string; texto: string }[] = [
  { titulo: 'Portal de Cliente', texto: 'Compras, pagos, stock, lista de precios y avisos desde el celular.' },
  { titulo: 'Garantía Digital', texto: 'En cada rollo e instalación de su red, con reclamos trazables.' },
  { titulo: 'Página de turnos por taller', texto: 'Cada instalador recibe su web propia para captar clientes en Google.' },
  { titulo: 'Mi Taller', texto: 'Agenda, órdenes de trabajo y fichero de clientes y autos.' },
  { titulo: 'Muestrario y material de venta', texto: 'Para presentar la marca en talleres y concesionarias.' },
  { titulo: 'Visibilidad y soporte', texto: 'Presencia en kristallfilm.com y soporte directo por WhatsApp.' },
]

export const PASOS: string[] = [
  'Reunión y selección de líneas para su mercado',
  'Primer pedido y condiciones comerciales',
  'Alta en la Suite Kristall y Garantía Digital',
  'Activación de su red de talleres',
]

/** Video del canal de Kristall: "Kristall Presentación CRM" (youtu.be/G1n25kmCjLI). */
export const VIDEO_ID = 'G1n25kmCjLI'

export const CONTACTO = {
  telefonoVisible: '+54 9 11 6048-4312',
  email: 'contacto@kristallfilm.com',
  firma: 'Carlos Arrúa · Kristall',
}

export const MENSAJE_PERU =
  'Hola! Vengo de la página de distribuidores de Perú y quiero conocer el Programa Distribuidor Autorizado de Kristall.'
