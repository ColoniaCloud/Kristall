'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useRef, useEffect } from 'react'

const categories = [
  { slug: 'klass',   image: '/cat/KLASS.png',    label: 'KLASS' },
  { slug: 'klar',    image: '/cat/KLAR.png',      label: 'KLAR' },
  { slug: 'karbon',  image: '/cat/KARBON.png',    label: 'KARBÖN' },
  { slug: 'keramx',  image: '/cat/KERAMX.png',    label: 'KERAMX' },
  { slug: 'krypton', image: '/cat/KRYPTON.png',   label: 'KRYPTON' },
  { slug: 'kaiser',  image: '/cat/KAISER.png',    label: 'KAISER' },
  { slug: 'ppf',     image: '/cat/PPF.png',        label: 'PPF' },
  { slug: 'vitral',  image: '/cat/VITRAL.png',     label: 'VITRAL' },
]

// Duplicamos para efecto de loop infinito
const loopedCategories = [...categories, ...categories]

export default function StatsRow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let pos = 0
    const speed = 0.5 // px por frame

    const step = () => {
      if (!pausedRef.current && el) {
        pos += speed
        // Reset al llegar a la mitad (primer set de items)
        const half = el.scrollWidth / 2
        if (pos >= half) pos = 0
        el.scrollLeft = pos
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }

    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume, { passive: true })
    el.addEventListener('mousedown', pause)
    el.addEventListener('mouseup', resume)
    el.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(animRef.current)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('mousedown', pause)
      el.removeEventListener('mouseup', resume)
      el.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <div className="bg-white border-b border-[0.5px] border-[#E4E4E2] shrink-0">
      {/* Mobile: auto-scroll + draggable carousel */}
      <div
        ref={scrollRef}
        className="md:hidden flex overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing select-none px-6"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {loopedCategories.map((cat, i) => (
          <Link
            key={`${cat.slug}-${i}`}
            href={`/productos/categorias/${cat.slug}`}
            className="group flex-shrink-0 w-1/2 flex items-center justify-center py-5 px-4 transition-all duration-200 hover:bg-[#F2F2F0]"
            draggable={false}
          >
            <Image
              src={cat.image}
              alt={cat.label}
              width={100}
              height={36}
              className="object-contain h-7 w-auto grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300 pointer-events-none"
            />
          </Link>
        ))}
      </div>

      {/* Desktop: 6-column grid */}
      <div className="hidden md:grid max-w-[1160px] mx-auto grid-cols-8 px-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/productos/categorias/${cat.slug}`}
            className="group flex items-center justify-center py-5 px-4 transition-all duration-200 hover:bg-[#F2F2F0]"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              width={100}
              height={36}
              className="object-contain h-7 w-auto grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
