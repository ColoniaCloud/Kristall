'use client'

import { useEffect, useState } from 'react'
import { MENSAJE_GENERAL, WhatsAppIcon, WhatsAppLink } from './whatsapp'

/**
 * Botón de WhatsApp fijo abajo, al alcance del pulgar. Aparece cuando el hero
 * sale de pantalla (el hero ya tiene su propio botón) y se esconde sobre las
 * zonas marcadas con `data-sin-barra`: el carrusel, donde taparía el "Lo quiero"
 * de cada lámina, y el cierre, que ya tiene su propio botón de WhatsApp.
 */
export default function BarraWhatsApp() {
  const [pasoHero, setPasoHero] = useState(false)
  const [tapando, setTapando] = useState(false)

  useEffect(() => {
    const onScroll = () => setPasoHero(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const zonas = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) zonas.add(e.target)
          else zonas.delete(e.target)
        }
        setTapando(zonas.size > 0)
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    document.querySelectorAll('[data-sin-barra]').forEach((el) => io.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const visible = pasoHero && !tapando

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 transition duration-300 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0))' }}
    >
      <WhatsAppLink
        mensaje={MENSAJE_GENERAL}
        donde="barra"
        className="mx-auto flex h-14 max-w-xl items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-base font-semibold text-[#0A0A0A] shadow-[0_8px_30px_rgba(37,211,102,0.25)] transition active:scale-[0.98]"
      >
        <WhatsAppIcon className="size-5" />
        Quiero trabajar con Kristall
      </WhatsAppLink>
    </div>
  )
}
