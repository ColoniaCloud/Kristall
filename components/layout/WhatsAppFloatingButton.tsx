'use client'

import { useEffect, useState } from 'react'

const WHATSAPP_NUMBER = '5491160484312'
const WHATSAPP_MESSAGE = 'Hola! Quiero más información sobre Kristall Film.'

/** Recién se muestra una vez que el usuario empezó a scrollear la página. */
const SHOW_AFTER_SCROLL = 120

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false)
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const pastThreshold = scrollY > SHOW_AFTER_SCROLL
      // El footer es `sticky bottom-0` (efecto cortina: `main` se desliza por
      // encima). Eso lo mantiene "intersecando" el viewport casi todo el
      // scroll, así que un IntersectionObserver sobre él lo marcaría como
      // visible de entrada. En su lugar medimos la distancia real al final
      // del documento contra el alto del propio footer.
      const footerHeight = document.querySelector('footer')?.getBoundingClientRect().height ?? 0
      const distanceToBottom = document.documentElement.scrollHeight - scrollY - window.innerHeight
      const nearFooter = distanceToBottom < footerHeight
      setVisible(pastThreshold && !nearFooter)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8 transition-[opacity,transform] duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
      }`}
    >
      <div className="group relative flex items-center justify-end">
        {/* Tooltip desplegable a la izquierda en hover */}
        <div
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-neutral-900/95 px-3.5 py-2 text-xs md:text-sm font-medium text-white shadow-xl backdrop-blur-sm border border-white/10 opacity-0 translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
        >
          ¡Hola! Escríbenos ante cualquier consulta!
          <span className="absolute top-1/2 -right-1.5 -mt-1.5 h-3 w-3 rotate-45 rounded-sm bg-neutral-900/95 border-t border-r border-white/10" />
        </div>

        {/* Botón flotante verde de WhatsApp */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          aria-hidden={!visible}
          tabIndex={visible ? 0 : -1}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-all duration-300 ease-out hover:scale-110 hover:shadow-emerald-500/30 active:scale-95"
        >
          {/* Icono sólido y robusto de WhatsApp */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-8 w-8 fill-current"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  )
}

