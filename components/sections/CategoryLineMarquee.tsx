'use client'

import type { Linea } from '@/lib/catalogo'
import { useScrollTrack, edgeFadeStyle } from '@/components/sections/useScrollTrack'
import LineLogosMarquee from '@/components/sections/LineLogosMarquee'

interface CategoryLineMarqueeProps {
  label: string
  lineas: Linea[]
}

export default function CategoryLineMarquee({ label, lineas }: CategoryLineMarqueeProps) {
  const titleTrack = useScrollTrack(1)
  const titleUnits = Array.from({ length: 8 })

  return (
    <div className="py-6">
      <div className="overflow-hidden" style={edgeFadeStyle}>
        <div ref={titleTrack} className="flex whitespace-nowrap will-change-transform">
          {titleUnits.map((_, i) => (
            <span
              key={i}
              className="shrink-0 pr-8 text-[clamp(2rem,8vw,64px)] leading-none tracking-tight text-[#9A9A9A]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="font-bold">Kristall</span>{' '}
              <span className="font-normal">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <LineLogosMarquee lineas={lineas} direction={-1} />
      </div>
    </div>
  )
}
