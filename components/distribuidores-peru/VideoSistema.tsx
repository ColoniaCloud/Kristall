'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

/**
 * Video de YouTube con "fachada": hasta que el usuario toca, es solo la miniatura
 * (un JPG de ~40 KB) y un botón. El iframe de YouTube pesa cerca de 1 MB de
 * JavaScript; cargarlo de entrada frenaría la página en el celular.
 * Se usa youtube-nocookie para no dejar cookies de YouTube antes del play.
 * Requiere en el CSP: frame-src youtube-nocookie y img-src i.ytimg.com.
 */
export default function VideoSistema({ id, titulo }: { id: string; titulo: string }) {
  const [activo, setActivo] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141414] lg:rounded-3xl">
      {activo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setActivo(true)
            trackEvent('peru_video_play', { video: id })
          }}
          className="group absolute inset-0 block size-full text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E6A800]"
          aria-label={`Reproducir el video: ${titulo}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- miniatura remota de YouTube, fuera del optimizador */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-20 place-items-center rounded-full bg-[#E6A800] text-[#0A0A0A] shadow-[0_12px_40px_rgba(230,168,0,0.35)] transition duration-300 group-hover:scale-105 lg:size-24">
              <Play className="ml-1 size-8 fill-current lg:size-9" aria-hidden="true" />
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4 lg:inset-x-8 lg:bottom-6">
            <span className="text-base font-semibold leading-tight text-white lg:text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              {titulo}
            </span>
            <span className="shrink-0 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              Ver el video
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
