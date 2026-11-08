'use client'

import { useEffect, useState } from 'react'
import { trackEvent, trackLead } from '@/lib/analytics'
import { refVendedor, WhatsAppIcon, whatsappHref } from '@/components/catalogo-propuesta/whatsapp'
import { MENSAJE_PERU } from '@/data/distribuidores-peru'

/**
 * Link a WhatsApp de la landing de Perú. Mismo número y mismo `?v=vendedor` que
 * el catálogo de lanzamiento, pero con su propio mensaje y sus propios eventos
 * (`peru_whatsapp_click`), para medir esta página aparte.
 */
export function WhatsAppPeru({
  donde,
  className,
  children,
  ariaLabel,
}: {
  donde: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={whatsappHref(MENSAJE_PERU)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        const vendedor = refVendedor()
        if (vendedor) e.currentTarget.href = whatsappHref(`${MENSAJE_PERU} (Ref: ${vendedor})`)
        trackEvent('peru_whatsapp_click', { donde, vendedor: vendedor ?? '' })
        trackLead('distribuidores-peru')
      }}
    >
      {children}
    </a>
  )
}

/**
 * Botón redondo de WhatsApp, fijo abajo a la derecha. Aparece cuando el hero
 * sale de pantalla (el hero tiene su propio botón) y se esconde sobre las zonas
 * con `data-sin-flotante`: el cierre, que ya tiene su botón, y la barra "Ir a la
 * web global", que no debe quedar tapada.
 */
export function WhatsAppFlotante() {
  const [pasoHero, setPasoHero] = useState(false)
  const [tapando, setTapando] = useState(false)

  useEffect(() => {
    const onScroll = () => setPasoHero(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const zonas = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) zonas.add(e.target)
        else zonas.delete(e.target)
      }
      setTapando(zonas.size > 0)
    })
    document.querySelectorAll('[data-sin-flotante]').forEach((el) => io.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const visible = pasoHero && !tapando

  return (
    <div
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 transition-[opacity,transform,filter] duration-300 [transition-timing-function:cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none lg:bottom-8 lg:right-8 ${
        visible ? 'translate-y-0 opacity-100 blur-0' : 'pointer-events-none translate-y-3 opacity-0 blur-[4px]'
      }`}
    >
      <WhatsAppPeru
        donde="flotante"
        ariaLabel="Escribir por WhatsApp"
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[#0A0A0A] shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition hover:bg-[#2fe072] active:scale-95 lg:size-auto lg:h-14 lg:gap-2 lg:px-6 lg:text-[15px] lg:font-semibold"
      >
        <WhatsAppIcon className="size-6 lg:size-5" />
        <span className="hidden lg:inline">Hablar con Kristall</span>
      </WhatsAppPeru>
    </div>
  )
}
