'use client'

import { formatPrecio, type Categoria, type Linea } from '@/data/lanzamiento'
import { formatPesos, type Cotizacion } from '@/lib/cotizacion'
import { irALinea } from './eventos'
import { CONTENEDOR, SECCION, TITULO } from './layout'

const GRUPOS: { categoria: Categoria; titulo: string }[] = [
  { categoria: 'standard', titulo: 'Standard' },
  { categoria: 'premium', titulo: 'Premium' },
]

const vltDe = (l: Linea): string => {
  const v = l.variantes.map((x) => x.vlt).filter((x): x is number => x !== null)
  return v.length ? v.join(', ') : 'Transparente'
}

/**
 * La lista completa en una sola pantalla: una fila por línea, ordenada de la
 * más barata a la más cara dentro de cada categoría. Es lo primero que mira un
 * taller que ya sabe qué quiere, así que el precio es lo único grande.
 * Va al final de la página, como resumen. Tocar una fila sube a la lámina en el carrusel.
 */
export default function ListaPrecios({
  lineas,
  cotizacion,
}: {
  lineas: Linea[]
  cotizacion: Cotizacion | null
}) {
  return (
    <section id="precios" className={`scroll-mt-4 ${SECCION}`}>
      <div className={CONTENEDOR}>
        <h2 className={TITULO} style={{ fontFamily: 'var(--font-display)' }}>
          Resumen de precios
        </h2>
        <p className="mt-3 text-base leading-relaxed text-white/60 lg:text-lg">
          Todas las líneas juntas, por rollo, en dólares{cotizacion ? ' y en pesos' : ''}. Tocá una para volver a su
          lámina.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 lg:mt-10">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Precio por rollo de cada línea, en dólares{cotizacion ? ' y en pesos' : ''}</caption>
            <thead className="text-[13px] text-white/55">
              <tr className="border-b border-white/10">
                <th scope="col" className="py-3 pl-4 pr-2 font-medium lg:pl-7">
                  Línea
                </th>
                <th scope="col" className="hidden px-2 py-3 font-medium lg:table-cell">
                  VLT
                </th>
                <th scope="col" className="hidden px-2 py-3 font-medium lg:table-cell">
                  Garantía
                </th>
                <th scope="col" className={`px-2 py-3 text-right font-medium ${cotizacion ? '' : 'pr-4 lg:pr-7'}`}>
                  Dólares
                </th>
                {cotizacion && (
                  <th scope="col" className="py-3 pl-2 pr-4 text-right font-medium lg:pr-7">
                    Pesos
                  </th>
                )}
              </tr>
            </thead>

            {GRUPOS.map(({ categoria, titulo }) => {
              const filas = lineas.filter((l) => l.categoria === categoria).sort((a, b) => a.precio - b.precio)
              if (!filas.length) return null
              return (
                <tbody key={categoria}>
                  <tr className="bg-white/[0.04]">
                    <th
                      scope="rowgroup"
                      colSpan={cotizacion ? 5 : 4}
                      className="px-4 py-2 text-left text-sm font-medium text-[#FFDA2C] lg:px-7"
                    >
                      {titulo}
                    </th>
                  </tr>
                  {filas.map((l) => (
                    <tr
                      key={l.slug}
                      onClick={() => irALinea({ slug: l.slug })}
                      className="cursor-pointer border-t border-white/[0.07] transition-colors hover:bg-white/[0.04]"
                    >
                      <th scope="row" className="py-3 pl-4 pr-1 text-left font-normal lg:py-4 lg:pl-7">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            irALinea({ slug: l.slug })
                          }}
                          className="block rounded text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFDA2C]"
                        >
                          <span className="block text-lg font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            {l.nombre}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-white/55">{l.tecnologia}</span>
                        </button>
                      </th>
                      <td className="hidden px-2 py-4 text-[15px] tabular-nums text-white/80 lg:table-cell">{vltDe(l)}</td>
                      <td className="hidden px-2 py-4 text-[15px] tabular-nums text-white/80 lg:table-cell">
                        {l.garantiaAnios} años
                      </td>
                      <td
                        className={`whitespace-nowrap px-2 py-3.5 text-right text-[0.95rem] font-semibold tabular-nums lg:py-4 lg:text-[1.5rem] ${
                          cotizacion ? '' : 'pr-4 lg:pr-7'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {formatPrecio(l.precio)}
                        <span className="block text-[11px] font-normal leading-none text-white/55 lg:mt-0.5 lg:text-xs">+ IVA</span>
                      </td>
                      {cotizacion && (
                        <td
                          className="whitespace-nowrap py-3.5 pl-2 pr-4 text-right text-[0.95rem] font-semibold tabular-nums text-white/55 lg:py-4 lg:pr-7 lg:text-[1.5rem]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {formatPesos(l.precio * cotizacion.venta)}
                          <span className="block text-[11px] font-normal leading-none text-white/55 lg:mt-0.5 lg:text-xs">+ IVA</span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              )
            })}
          </table>
        </div>

        {cotizacion && (
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/55 lg:text-sm">
            Pesos al dólar oficial del Banco Nación (venta): {formatPesos(cotizacion.venta)}, al {cotizacion.fecha}. La
            cotización cambia a diario, por eso el monto en pesos es de referencia.
          </p>
        )}
      </div>
    </section>
  )
}
