'use client'

import { useEffect, useRef, useState } from 'react'

const INTERVALO_MS = 2800

/**
 * Textos que pasan como un rodillo, de abajo hacia arriba, dentro de la
 * píldora del hero.
 *
 * - **El ancho no salta:** todos los textos se apilan invisibles en la misma
 *   celda y la píldora toma el ancho del más largo.
 * - **El loop no rebobina:** al final de la tira va una copia del primero; al
 *   llegar ahí se vuelve al índice 0 sin animación, y se ve como un giro continuo.
 * - **Movimiento reducido:** cambian igual, pero sin deslizarse.
 * - **Lectores de pantalla:** leen los textos juntos una sola vez (el rodillo es
 *   `aria-hidden`); anunciar cada cambio cada tres segundos sería ruido.
 */
export default function Rotador({ textos }: { textos: string[] }) {
  const [i, setI] = useState(0)
  const [animar, setAnimar] = useState(true)
  const sinMovimiento = useRef(false)
  const indice = useRef(0)

  useEffect(() => {
    indice.current = i
  }, [i])

  useEffect(() => {
    if (textos.length < 2) return
    sinMovimiento.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setInterval(() => {
      // Pasado del final quiere decir que el `transitionend` de la copia nunca
      // llegó: pasa con la pestaña en segundo plano (el navegador no corre la
      // transición) o al volver a Instagram desde otra app. Sin esto el rodillo
      // seguiría bajando hacia la nada y la píldora quedaría vacía.
      if (sinMovimiento.current || indice.current >= textos.length) {
        setAnimar(false)
        setI((n) => (n >= textos.length ? 0 : (n + 1) % textos.length))
      } else {
        setAnimar(true)
        setI((n) => n + 1)
      }
    }, INTERVALO_MS)
    return () => window.clearInterval(id)
  }, [textos.length])

  const tira = [...textos, textos[0]]

  return (
    <>
      <span className="sr-only">{textos.join('. ')}</span>
      {/* La máscara desvanece los bordes de la ventana: el texto que sale y el que
          entra se esfuman en vez de cortarse en seco, como un tambor que gira. */}
      <span
        aria-hidden="true"
        className="relative block h-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
      >
        {/* Medidor: define el ancho con el texto más largo. */}
        <span className="invisible grid">
          {textos.map((t) => (
            <span key={t} className="col-start-1 row-start-1 whitespace-nowrap leading-5">
              {t}
            </span>
          ))}
        </span>
        <span
          className={`absolute inset-x-0 top-0 flex flex-col ${animar ? 'transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]' : ''}`}
          style={{ transform: `translateY(-${i * 1.25}rem)` }}
          onTransitionEnd={() => {
            if (i === textos.length) {
              setAnimar(false)
              setI(0)
            }
          }}
        >
          {tira.map((t, k) => (
            <span key={k} className="block h-5 whitespace-nowrap leading-5">
              {t}
            </span>
          ))}
        </span>
      </span>
    </>
  )
}
