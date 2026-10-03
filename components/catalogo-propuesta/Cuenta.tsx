'use client'

import { useSyncExternalStore } from 'react'

/** Un solo reloj de 1 s para todos los contadores de la página. */
function suscribir(aviso: () => void) {
  const id = setInterval(aviso, 1000)
  return () => clearInterval(id)
}
const segundoActual = () => Math.floor(Date.now() / 1000)

/**
 * Cuenta regresiva hasta el fin del precio de lanzamiento.
 *
 * En el servidor y en la hidratación usa la hora con que se generó la página
 * (`ahora`); recién después pasa al reloj del navegador. Así el HTML no difiere
 * entre servidor y cliente aunque la página venga cacheada de hace una hora.
 */
export default function Cuenta({ hasta, ahora }: { hasta: number; ahora: number }) {
  const segundo = useSyncExternalStore(suscribir, segundoActual, () => Math.floor(ahora / 1000))
  const resto = Math.max(0, Math.floor(hasta / 1000) - segundo)

  const partes = [
    { valor: Math.floor(resto / 86400), label: 'días' },
    { valor: Math.floor((resto % 86400) / 3600), label: 'horas' },
    { valor: Math.floor((resto % 3600) / 60), label: 'min' },
    { valor: resto % 60, label: 'seg' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-label={`Quedan ${partes[0].valor} días`}>
      {partes.map((p) => (
        <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-center">
          <p
            className="text-[1.9rem] font-semibold leading-none tabular-nums"
            style={{ fontFamily: 'var(--font-display)' }}
            aria-hidden="true"
          >
            {String(p.valor).padStart(2, '0')}
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-white/45" aria-hidden="true">
            {p.label}
          </p>
        </div>
      ))}
    </div>
  )
}
