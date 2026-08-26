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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-[opacity,transform] duration-300 ease-out hover:scale-105 active:scale-95 md:bottom-8 md:right-8 ${
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
      }`}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 fill-white"
      >
        <path d="M16.004 3C9.35 3 3.96 8.37 3.96 15c0 2.23.62 4.31 1.7 6.1L3 29l8.1-2.6a12.9 12.9 0 0 0 4.9.97h.005C22.65 27.37 28 22 28 15.37 28 8.74 22.65 3 16.004 3Zm0 22.06h-.004a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.8 1.54 1.57-4.68-.25-.4a10.44 10.44 0 0 1-1.63-5.61c0-5.78 4.7-10.48 10.5-10.48 2.8 0 5.44 1.1 7.42 3.08a10.4 10.4 0 0 1 3.07 7.4c0 5.78-4.7 10.48-10.5 10.48Zm5.76-7.85c-.31-.16-1.85-.91-2.14-1.01-.29-.1-.5-.16-.71.16-.21.31-.81 1.01-1 1.22-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.56-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.72-.97-2.36-.26-.62-.52-.54-.71-.55-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.41 5.4 4.78.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
      </svg>
    </a>
  )
}
