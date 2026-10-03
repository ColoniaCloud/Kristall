'use client'

import { trackEvent, trackLead } from '@/lib/analytics'

/** Mismo número que `components/layout/WhatsAppFloatingButton`. */
const WHATSAPP_NUMBER = '5491160484312'

export function whatsappHref(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export function mensajeProducto(linea: string, sku?: string): string {
  return `Hola! Vengo del catálogo de lanzamiento. Me interesa ${linea}${sku ? ` (${sku})` : ''}. ¿Me pasan más info?`
}

/**
 * Vendedor que compartió el link: `/catalogo-propuesta?v=juan`. Viaja al final
 * del mensaje de WhatsApp ("Ref: juan") y a los eventos de GA4, así se sabe
 * quién trajo a cada taller. Es un nombre corto que elige el vendedor, no un id
 * interno; cualquier otra cosa se ignora.
 */
export function refVendedor(): string | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('v')?.trim().toLowerCase()
  return v && /^[a-z0-9-]{2,24}$/.test(v) ? v : null
}

export const MENSAJE_GENERAL =
  'Hola! Vengo del catálogo de lanzamiento de Kristall y quiero trabajar con ustedes. ¿Me pasan más info?'

/**
 * Link a WhatsApp que además mide el click. `donde` identifica el botón
 * (hero, card, barra, cierre) para saber cuál convierte.
 */
export function WhatsAppLink({
  mensaje,
  donde,
  linea,
  className,
  children,
}: {
  mensaje: string
  donde: string
  linea?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={whatsappHref(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        const vendedor = refVendedor()
        // El href se completa recién al tocar: así el HTML es el mismo para
        // todos (la página se sirve cacheada) y no hay desfase al hidratar.
        if (vendedor) e.currentTarget.href = whatsappHref(`${mensaje} (Ref: ${vendedor})`)
        trackEvent('catalogo_whatsapp_click', { donde, linea: linea ?? '', vendedor: vendedor ?? '' })
        trackLead('catalogo-propuesta')
      }}
    >
      {children}
    </a>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
