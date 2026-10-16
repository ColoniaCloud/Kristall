'use client'

import { createElement, useEffect, useRef, useState } from 'react'

/**
 * Visor de un .glb con <model-viewer> (Google). Se importa en el cliente porque
 * el custom element toca `window` al registrarse. Todo se sirve desde nuestro
 * origen: el CSP no permite scripts de CDNs (next.config.ts).
 */
export default function Visor3D({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLElement>(null)
  const [progreso, setProgreso] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    import('@google/model-viewer')
    const el = ref.current
    if (!el) return
    const onProgress = (e: Event) =>
      setProgreso((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress)
    const onError = () => setError(true)
    el.addEventListener('progress', onProgress)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('progress', onProgress)
      el.removeEventListener('error', onError)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      {createElement('model-viewer', {
        ref,
        src,
        alt,
        'camera-controls': '',
        'touch-action': 'pan-y',
        'auto-rotate': '',
        'auto-rotate-delay': '3000',
        'interaction-prompt': 'none',
        'shadow-intensity': '1',
        exposure: '1',
        'environment-image': 'neutral',
        style: { width: '100%', height: '100%', backgroundColor: 'transparent' },
      })}

      {progreso < 1 && !error && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto w-48">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-white transition-[width]"
              style={{ width: `${Math.round(progreso * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-white/60">Cargando modelo…</p>
        </div>
      )}

      {error && (
        <p className="absolute inset-0 grid place-items-center text-sm text-white/70">
          No se pudo cargar el modelo.
        </p>
      )}

      {progreso >= 1 && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs text-white/50">
          Arrastrá para girar · pellizcá o usá la rueda para acercar
        </p>
      )}
    </div>
  )
}
