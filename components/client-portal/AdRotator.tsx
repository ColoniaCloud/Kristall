'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Ad } from '@/lib/client-portal/ads'

/**
 * La tanda de publicidad interna de un lugar del panel.
 *
 * Las piezas se cruzan con un fundido en vez de cortar: es el mismo cartel
 * cambiando de contenido, no algo nuevo que aparece y distrae de lo que la
 * persona vino a hacer.
 *
 * Todas las imágenes se montan a la vez y se alternan con opacidad, así el
 * cambio no espera una descarga. Son dos o tres piezas por lugar; si algún día
 * son diez, esto pasa a cargar bajo demanda.
 */
const INTERVALO_MS = 7000

export default function AdRotator({
  ads,
  sizes,
  className,
}: {
  ads: readonly Ad[]
  /** Qué ancho va a ocupar de verdad, para que Next sirva el archivo justo. */
  sizes: string
  className?: string
}) {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    // Una sola pieza no rota: no hay nada a lo que pasar.
    if (ads.length < 2) return
    const timer = setInterval(() => setActual((n) => (n + 1) % ads.length), INTERVALO_MS)
    return () => clearInterval(timer)
  }, [ads.length])

  if (ads.length === 0) return null

  // La proporción la marca la primera pieza: reserva el alto antes de que
  // cargue ninguna y evita que el resto de la pantalla salte.
  const [primera] = ads

  return (
    <div
      /* Sin fondo propio: cuando `max-h` recorta la proporción natural, el
         `object-contain` deja franjas a los costados, y con fondo se verían
         como un marco fuera de lugar. */
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ aspectRatio: `${primera.width} / ${primera.height}` }}
    >
      {ads.map((ad, i) => (
        <Image
          key={ad.src}
          src={ad.src}
          /* Decorativas para el lector de pantalla: son imágenes sin texto
             alternativo de ningún lado, y un alt inventado acá mentiría. */
          alt=""
          fill
          sizes={sizes}
          priority={i === 0}
          className={cn(
            // `contain` y no `cover`: si alguien sube una pieza con otra
            // proporción, se ve entera en vez de recortada.
            'object-contain transition-opacity duration-700 ease-in-out',
            i === actual ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
    </div>
  )
}
