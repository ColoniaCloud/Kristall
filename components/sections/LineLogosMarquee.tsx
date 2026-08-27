'use client'

import Image from 'next/image'
import { lineaLogoSrc, type Linea } from '@/lib/catalogo'
import { useScrollTrack, edgeFadeStyle } from '@/components/sections/useScrollTrack'

interface LineLogosMarqueeProps {
  lineas: Linea[]
  direction?: 1 | -1
}

/** Fila de logos de línea en scroll horizontal infinito, atada al scroll vertical de la página. */
export default function LineLogosMarquee({ lineas, direction = -1 }: LineLogosMarqueeProps) {
  const logosTrack = useScrollTrack(direction)
  const loopedLineas = Array.from({ length: 8 }).flatMap(() => lineas)

  return (
    <div className="overflow-hidden" style={edgeFadeStyle}>
      <div ref={logosTrack} className="flex items-center whitespace-nowrap will-change-transform">
        {loopedLineas.map((linea, i) => (
          <div key={`${linea.slug}-${i}`} className="relative shrink-0 w-20 h-6 mx-5 opacity-40">
            <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain" sizes="80px" />
          </div>
        ))}
      </div>
    </div>
  )
}
