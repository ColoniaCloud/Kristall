'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PlayCircle } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { CONTENEDOR } from './layout'
import Reveal from './Reveal'

/**
 * "Probalo ahora": abre el portal de demostración. Repite la lógica de
 * `components/sections/PortalInstaladores.tsx` (POST /api/portal/demo y de ahí a
 * /cliente/taller); el endpoint ya limita a 5 demos por IP por hora.
 */
export default function Demo() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function entrar() {
    setCargando(true)
    setError(null)
    trackEvent('catalogo_demo_click')
    try {
      const res = await fetch('/api/portal/demo', { method: 'POST' })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setError(res.status === 429 && body?.error ? body.error : 'No pudimos abrir la demo. Probá de nuevo en un momento.')
        return
      }
      router.push('/cliente/taller')
      router.refresh()
    } catch {
      setError('No pudimos abrir la demo. Probá de nuevo en un momento.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className={`${CONTENEDOR} pb-16 lg:pb-24`}>
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141414] lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* <img> y no next/image: el optimizador congela los GIF animados. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portal-instaladores.gif"
            alt="Recorrido por el portal de instaladores"
            width={880}
            height={596}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          <div className="p-6 lg:p-10">
            <h2
              className="text-[1.9rem] font-semibold leading-tight tracking-[-0.01em] lg:text-[2.6rem]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No te lo contamos: probalo.
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/65">
              Entrá a un taller de prueba con datos ficticios y recorré el portal como si fuera tuyo. Sin registrarte.
            </p>
            <button
              type="button"
              onClick={entrar}
              disabled={cargando}
              className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
              {cargando ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <PlayCircle className="size-5" aria-hidden="true" />
              )}
              Abrir la demo del portal
            </button>
            {error && (
              <p role="alert" className="mt-3 text-sm text-[#ff8a8a]">
                {error}
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
