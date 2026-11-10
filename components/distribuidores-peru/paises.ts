/**
 * Las versiones por país de la landing de distribuidores.
 *
 * La página nació para Perú (por eso la carpeta se llama así), pero la misma
 * propuesta se manda a Argentina y Uruguay, y a cualquier otro país en una
 * versión sin bandera. El país de una invitación lo decide el CRM a partir del
 * código internacional del teléfono (`inviteCountry` en
 * crm-polarizados/src/lib/distributor-invite.ts); las rutas de acá tienen que
 * coincidir con `INVITE_PATH` de ese archivo.
 *
 * Lo que cambia entre países es la bandera, el nombre del país, la dirección y
 * el mensaje de WhatsApp. El resto del contenido es el mismo.
 */

export type Pais = 'PE' | 'AR' | 'UY' | 'OTHER'

export type DatosPais = {
  /** Ruta base, sin barra final. La invitación vive en `<ruta>/<token>`. */
  ruta: string
  /** `null` en la versión sin país: no se muestra bandera ni nombre. */
  nombre: string | null
  locale: string
  titulo: string
  /** Con qué abre WhatsApp quien llega sin invitación personal. */
  mensaje: string
}

const MENSAJE = (de: string) =>
  `Hola! Vengo de la página de distribuidores${de} y quiero conocer el Programa Distribuidor Autorizado de Kristall.`

export const PAISES: Record<Pais, DatosPais> = {
  PE: {
    ruta: '/distribuidores-peru',
    nombre: 'Perú',
    locale: 'es_PE',
    titulo: 'Distribuidor Autorizado en Perú — Kristall Film',
    mensaje: MENSAJE(' de Perú'),
  },
  AR: {
    ruta: '/distribuidores-argentina',
    nombre: 'Argentina',
    locale: 'es_AR',
    titulo: 'Distribuidor Autorizado en Argentina — Kristall Film',
    mensaje: MENSAJE(' de Argentina'),
  },
  UY: {
    ruta: '/distribuidores-uruguay',
    nombre: 'Uruguay',
    locale: 'es_UY',
    titulo: 'Distribuidor Autorizado en Uruguay — Kristall Film',
    mensaje: MENSAJE(' de Uruguay'),
  },
  OTHER: {
    ruta: '/propuesta-distribuidor',
    nombre: null,
    locale: 'es',
    titulo: 'Distribuidor Autorizado — Kristall Film',
    mensaje: MENSAJE(''),
  },
}

export function esPais(v: unknown): v is Pais {
  return typeof v === 'string' && v in PAISES
}
