'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Linea } from '@/data/lanzamiento'
import { trackEvent } from '@/lib/analytics'
import { irALinea } from './eventos'
import { CONTENEDOR, SECCION, TITULO } from './layout'

/**
 * Contorno de la ventanilla del conductor en /cat/ingresar.jpg, en % de la foto.
 * Si se cambia la foto hay que volver a trazarlo; el contenedor mantiene la
 * proporción exacta de la imagen (1919×1282) para que los % coincidan.
 */
const VIDRIO =
  'polygon(53.5% 15.5%, 66% 11.5%, 78% 7.6%, 84.5% 6.3%, 87% 6.8%, 88.2% 8.6%, 87.6% 11.5%, 80.2% 38%, 79.2% 42.6%, 43.5% 44%, 41.8% 37%, 45.5% 31%)'

const TEXTOS: Record<number, string> = {
  5: 'Máxima privacidad: desde afuera casi no se ve el interior.',
  15: 'Oscuro y elegante, con buena visibilidad de día.',
  50: 'Control solar sin oscurecer demasiado el auto.',
  80: 'Casi transparente: no cambia el aspecto del auto.',
}

/**
 * Opacidad del velo para cada VLT. No es una medición: es una curva que se
 * acerca a cómo se percibe desde adentro (un 5% no es negro, se sigue viendo).
 */
function velo(vlt: number) {
  return 0.9 * Math.pow(1 - vlt / 100, 1.3)
}

export default function Simulador({ lineas }: { lineas: Linea[] }) {
  // Los VLT que existen en el lanzamiento, de más oscuro a más claro.
  const niveles = useMemo(
    () =>
      [...new Set(lineas.flatMap((l) => l.variantes.map((v) => v.vlt)).filter((v): v is number => v !== null))].sort(
        (a, b) => a - b
      ),
    [lineas]
  )
  const [i, setI] = useState(Math.min(1, niveles.length - 1))
  const vlt = niveles[i]

  const disponibles = lineas.flatMap((l) =>
    l.variantes.filter((v) => v.vlt === vlt).map((v) => ({ slug: l.slug, nombre: l.nombre, sku: v.sku }))
  )

  function elegir(n: number) {
    setI(n)
    trackEvent('catalogo_simulador', { vlt: niveles[n] })
  }

  return (
    <section className={SECCION}>
      {/* Celular: título, foto (a todo el ancho) y controles, uno abajo del otro.
          PC: la foto grande a la izquierda; título y controles a la derecha. */}
      <div className={`${CONTENEDOR} lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-x-14`}>
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/55">Simulador</p>
          <h2 className={`mt-3 ${TITULO}`} style={{ fontFamily: 'var(--font-display)' }}>
            ¿Qué tan oscuro?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/60 lg:text-lg">
            Así se ve desde el asiento del conductor. Mové la barra para cambiar el VLT.
          </p>
        </div>

        <div className="-mx-5 mt-8 sm:mx-0 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <div className="relative aspect-[1919/1282] w-full overflow-hidden sm:rounded-3xl">
            <Image
              src="/cat/ingresar.jpg"
              alt="Ventanilla del conductor vista desde adentro del auto"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 576px, 640px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 transition-[background-color] duration-500 ease-out motion-reduce:transition-none"
              style={{ clipPath: VIDRIO, backgroundColor: `rgba(8, 10, 12, ${velo(vlt)})` }}
              aria-hidden="true"
            />
            <div className="absolute bottom-3 left-3 rounded-2xl bg-black/60 px-4 py-2 backdrop-blur lg:bottom-5 lg:left-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">VLT</p>
              <p
                className="text-[2rem] font-semibold leading-none tabular-nums lg:text-[2.6rem]"
                style={{ fontFamily: 'var(--font-display)' }}
                aria-live="polite"
              >
                {vlt}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:col-start-2 lg:row-start-2 lg:mt-8 lg:self-start">
          <input
            type="range"
            min={0}
            max={niveles.length - 1}
            step={1}
            value={i}
            onChange={(e) => elegir(Number(e.target.value))}
            aria-label="Transmisión de luz visible"
            aria-valuetext={`${vlt}%`}
            className="h-10 w-full cursor-pointer accent-white"
          />
          <div className="flex justify-between">
            {niveles.map((n, k) => (
              <button
                key={n}
                type="button"
                onClick={() => elegir(k)}
                aria-pressed={k === i}
                className={`min-w-12 rounded-lg px-2 py-1.5 text-sm font-semibold tabular-nums transition hover:text-white ${
                  k === i ? 'text-white' : 'text-white/55'
                }`}
              >
                {n}%
              </button>
            ))}
          </div>

          <p className="mt-4 min-h-[3rem] text-[15px] leading-relaxed text-white/75 lg:text-base">{TEXTOS[vlt] ?? ''}</p>

          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/55">Disponible en</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {disponibles.map((d) => (
              <button
                key={d.sku}
                type="button"
                onClick={() => {
                  trackEvent('catalogo_simulador_ir', { linea: d.slug, sku: d.sku })
                  irALinea({ slug: d.slug, sku: d.sku })
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/[0.08] active:scale-[0.97]"
              >
                {d.nombre}
                <ArrowRight className="size-4 text-white/50" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
