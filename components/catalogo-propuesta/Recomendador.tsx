'use client'

import { useState } from 'react'
import { ArrowRight, Car, ChevronDown, RotateCcw, ShieldCheck, ThermometerSun, Wallet } from 'lucide-react'
import { formatPrecio, type Linea, type Variante } from '@/data/lanzamiento'
import { trackEvent } from '@/lib/analytics'
import { irALinea } from './eventos'
import { mensajeProducto, WhatsAppIcon, WhatsAppLink } from './whatsapp'

type Objetivo = 'precio' | 'calor' | 'seguridad' | 'pintura'
type Tono = 'oscuro' | 'intermedio' | 'claro'

const OBJETIVOS: { id: Objetivo; label: string; icon: React.ElementType }[] = [
  { id: 'precio', label: 'Que sea económico', icon: Wallet },
  { id: 'calor', label: 'Que entre menos calor', icon: ThermometerSun },
  { id: 'seguridad', label: 'Seguridad en los vidrios', icon: ShieldCheck },
  { id: 'pintura', label: 'Proteger la pintura', icon: Car },
]

const TONOS: { id: Tono; label: string; detalle: string }[] = [
  { id: 'oscuro', label: 'Oscuro', detalle: 'VLT 5%' },
  { id: 'intermedio', label: 'Intermedio', detalle: 'VLT 15%' },
  { id: 'claro', label: 'Claro', detalle: 'VLT 50–80%' },
]

type Opcion = { linea: Linea; variante: Variante }

function enTono(vlt: number | null, tono: Tono) {
  if (vlt === null) return false
  if (tono === 'oscuro') return vlt <= 5
  if (tono === 'intermedio') return vlt > 5 && vlt <= 15
  return vlt >= 50
}

/**
 * Sale de los datos, no de una tabla fija: si cambia un precio o entra una
 * línea, la recomendación se reacomoda sola. Una opción por línea.
 */
function recomendar(lineas: Linea[], objetivo: Objetivo, tono: Tono | null): Opcion[] {
  const todas: Opcion[] = lineas.flatMap((linea) => linea.variantes.map((variante) => ({ linea, variante })))
  let lista: Opcion[]
  if (objetivo === 'pintura') lista = todas.filter((o) => o.variante.vlt === null)
  else if (objetivo === 'seguridad') lista = todas.filter((o) => /seguridad/i.test(o.linea.tecnologia))
  else {
    lista = todas.filter((o) => tono && enTono(o.variante.vlt, tono))
    const ir = (o: Opcion) => o.variante.ir ?? 0
    lista.sort((a, b) =>
      objetivo === 'precio' ? a.linea.precio - b.linea.precio || ir(b) - ir(a) : ir(b) - ir(a) || a.linea.precio - b.linea.precio
    )
  }
  const vistas = new Set<string>()
  return lista.filter((o) => (vistas.has(o.linea.slug) ? false : (vistas.add(o.linea.slug), true)))
}

/** Rechazo infrarrojo a partir del cual una lámina se ofrece como "de calor". */
const IR_ALTO = 80

/**
 * La segunda opción que se le muestra al taller, pensada como argumento de venta:
 * - si buscó precio, la más barata que ya rechaza mucho calor (el "por $X más");
 * - si buscó calor, la más barata que rechaza casi lo mismo (el "si el
 *   presupuesto es más ajustado").
 * Si no hay ninguna que cumpla, no se muestra nada: mejor eso que sugerir una
 * lámina que no resuelve lo que se pidió.
 */
function alternativa(objetivo: Objetivo, [mejor, ...resto]: Opcion[]): Opcion | undefined {
  const ir = (o: Opcion) => o.variante.ir ?? 0
  const porPrecio = [...resto].sort((a, b) => a.linea.precio - b.linea.precio)
  if (objetivo === 'precio') return porPrecio.find((o) => ir(o) >= IR_ALTO && ir(o) > ir(mejor))
  if (objetivo === 'calor')
    return porPrecio.find((o) => o.linea.precio < mejor.linea.precio && ir(o) >= Math.min(IR_ALTO, ir(mejor) - 10))
  return undefined
}

function porQue(objetivo: Objetivo, mejor: Opcion, alt: Opcion | undefined): { motivo: string; alternativa?: string } {
  const { linea, variante } = mejor
  if (objetivo === 'pintura') {
    return { motivo: `TPU autorreparable de ${linea.espesor}, con ${linea.garantiaAnios} años de garantía.` }
  }
  if (objetivo === 'seguridad') {
    return {
      motivo: `Refuerza el vidrio y retiene fragmentos, y además rechaza ${variante.ir}% del infrarrojo. ${linea.garantiaAnios} años de garantía.`,
    }
  }
  if (objetivo === 'precio') {
    return {
      motivo: `Es la opción más económica con VLT ${variante.vlt}%, y rechaza ${variante.ir}% del infrarrojo.`,
      alternativa: alt
        ? `Por ${formatPrecio(alt.linea.precio - linea.precio)} más, ${alt.linea.nombre} rechaza ${alt.variante.ir}% del calor.`
        : undefined,
    }
  }
  return {
    motivo: `Es la que más calor rechaza con VLT ${variante.vlt}%: ${variante.ir}% del infrarrojo.`,
    alternativa: alt
      ? `Si el presupuesto es más ajustado, ${alt.linea.nombre} rechaza ${alt.variante.ir}% por ${formatPrecio(alt.linea.precio)}.`
      : undefined,
  }
}

export default function Recomendador({ lineas, vigente }: { lineas: Linea[]; vigente: boolean }) {
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null)
  const [tono, setTono] = useState<Tono | null>(null)

  const necesitaTono = objetivo === 'precio' || objetivo === 'calor'
  const listo = objetivo !== null && (!necesitaTono || tono !== null)
  const opciones = listo ? recomendar(lineas, objetivo, tono) : []
  const [mejor] = opciones
  const alt = listo && mejor ? alternativa(objetivo, opciones) : undefined
  const texto = listo && mejor ? porQue(objetivo, mejor, alt) : null

  function elegirObjetivo(o: Objetivo) {
    setObjetivo(o)
    setTono(null)
    if (o === 'seguridad' || o === 'pintura') trackEvent('catalogo_recomendador', { objetivo: o })
  }

  function elegirTono(t: Tono) {
    setTono(t)
    trackEvent('catalogo_recomendador', { objetivo: objetivo ?? '', tono: t })
  }

  function reiniciar() {
    setObjetivo(null)
    setTono(null)
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-xl px-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/55">Asesor rápido</p>
        <h2
          className="mt-3 text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ¿Cuál le ofrezco a mi cliente?
        </h2>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#141414] p-5">
          <p className="text-sm font-medium text-white/60">1 · ¿Qué es lo que más le importa?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {OBJETIVOS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={objetivo === o.id}
                onClick={() => elegirObjetivo(o.id)}
                className={`flex min-h-[5.5rem] flex-col items-start justify-between rounded-2xl p-3.5 text-left text-[15px] font-medium leading-snug transition active:scale-[0.98] ${
                  objetivo === o.id ? 'bg-white text-[#0A0A0A]' : 'border border-white/10 bg-white/[0.03] text-white/85'
                }`}
              >
                <o.icon className="size-5" aria-hidden="true" />
                {o.label}
              </button>
            ))}
          </div>

          {necesitaTono && (
            <div className="kf-rise">
              <p className="mt-6 text-sm font-medium text-white/60">2 · ¿Qué tan oscuro lo quiere?</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {TONOS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={tono === t.id}
                    onClick={() => elegirTono(t.id)}
                    className={`rounded-2xl px-2 py-3 text-center transition active:scale-[0.98] ${
                      tono === t.id ? 'bg-white text-[#0A0A0A]' : 'border border-white/10 bg-white/[0.03] text-white/85'
                    }`}
                  >
                    <span className="block text-[15px] font-medium">{t.label}</span>
                    <span className={`mt-0.5 block text-xs ${tono === t.id ? 'text-black/55' : 'text-white/55'}`}>
                      {t.detalle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {listo && mejor && texto && (
            <div key={`${objetivo}-${tono}`} className="kf-rise mt-6 rounded-2xl border border-[#E6A800]/30 bg-gradient-to-b from-[#E6A800]/10 to-transparent p-5" aria-live="polite">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#E6A800]">Te recomendamos</p>
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- logotipo SVG */}
                <img src={mejor.linea.logo} alt={mejor.linea.nombre} className="kf-logo-white h-7 w-auto" />
                <span className="font-mono text-xs text-white/55">{mejor.variante.sku}</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">{texto.motivo}</p>
              {vigente && (
                <p className="mt-3 text-sm text-white/55">
                  <span
                    className="mr-1 text-2xl font-semibold text-white tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {formatPrecio(mejor.linea.precio)}
                  </span>
                  por rollo + IVA
                </p>
              )}
              {texto.alternativa && (
                <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/55">
                  {texto.alternativa}
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => irALinea({ slug: mejor.linea.slug, sku: mejor.variante.sku })}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-white/15 text-[15px] font-medium text-white"
                >
                  Ver lámina
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
                <WhatsAppLink
                  mensaje={mensajeProducto(mejor.linea.nombre, mejor.variante.sku)}
                  donde="recomendador"
                  linea={mejor.linea.slug}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-white text-[15px] font-semibold text-[#0A0A0A]"
                >
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  Pedir
                </WhatsAppLink>
              </div>
              <button
                type="button"
                onClick={reiniciar}
                className="mx-auto mt-4 flex items-center gap-1.5 text-sm text-white/55"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Empezar de nuevo
              </button>
            </div>
          )}
        </div>

        <Comparativa lineas={lineas} vigente={vigente} />
      </div>
    </section>
  )
}

/** Las líneas en una tabla, de la más económica a la más cara. */
function Comparativa({ lineas, vigente }: { lineas: Linea[]; vigente: boolean }) {
  const filas = [...lineas].sort((a, b) => a.precio - b.precio)
  const irMax = (l: Linea) => {
    const v = l.variantes.map((x) => x.ir).filter((x): x is number => x !== null)
    return v.length ? Math.max(...v) : null
  }

  return (
    <details
      className="group mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#141414]"
      onToggle={(e) => {
        if ((e.currentTarget as HTMLDetailsElement).open) trackEvent('catalogo_comparativa')
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
        Comparar las {filas.length} líneas
        <ChevronDown className="size-5 text-white/50 transition group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="overflow-x-auto border-t border-white/10">
        <table className="w-full text-left text-[13px]">
          <thead className="text-[11px] uppercase tracking-[0.1em] text-white/55">
            <tr>
              <th scope="col" className="py-2.5 pl-3 pr-1.5 font-medium">Línea</th>
              <th scope="col" className="px-1.5 py-2.5 text-right font-medium">IR</th>
              <th scope="col" className="px-1.5 py-2.5 text-right font-medium">Garantía</th>
              {vigente && <th scope="col" className="py-2.5 pl-1.5 pr-3 text-right font-medium">Rollo</th>}
            </tr>
          </thead>
          <tbody>
            {filas.map((l) => {
              const ir = irMax(l)
              return (
                <tr key={l.slug} className="border-t border-white/[0.06]">
                  <th scope="row" className="py-3 pl-3 pr-1.5 font-normal">
                    <button
                      type="button"
                      onClick={() => irALinea({ slug: l.slug })}
                      className="text-left"
                    >
                      <span className="block font-semibold text-white">{l.nombre}</span>
                      <span className="block text-xs text-white/55">{l.tecnologia}</span>
                    </button>
                  </th>
                  <td className="whitespace-nowrap px-1.5 py-3 text-right tabular-nums">{ir === null ? '—' : `${ir}%`}</td>
                  <td className="whitespace-nowrap px-1.5 py-3 text-right tabular-nums">{l.garantiaAnios} años</td>
                  {vigente && (
                    <td className="whitespace-nowrap py-3 pl-1.5 pr-3 text-right font-medium tabular-nums">{formatPrecio(l.precio)}</td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="px-5 pb-4 pt-1 text-xs text-white/55">
          IR: rechazo infrarrojo máximo de la línea. Precios por rollo, sin IVA. PPF viene en rollo de 1.52 × 15 m; el resto, 1.52 × 30 m.
        </p>
      </div>
    </details>
  )
}
