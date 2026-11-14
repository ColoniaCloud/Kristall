'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { formatPrecio, type Categoria, type Linea } from '@/data/lanzamiento'
import { trackEvent } from '@/lib/analytics'
import { EVENTO_IR_A_LINEA, type IrALinea } from './eventos'
import { CONTENEDOR, SECCION, TITULO } from './layout'
import { mensajeProducto, WhatsAppIcon, WhatsAppLink } from './whatsapp'

type Filtro = 'todos' | Categoria

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'standard', label: 'Standard' },
  { id: 'premium', label: 'Premium' },
]

/**
 * Celular: carrusel horizontal, una lámina por pantalla, se pasa con el pulgar.
 * Es el único `scroll-snap` de la página — el snap vertical se traba en el
 * navegador interno de Instagram y el usuario se va.
 * PC (`lg`): la misma pista se vuelve una grilla y se ven todas juntas.
 */

export default function Productos({ lineas, vigente }: { lineas: Linea[]; vigente: boolean }) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [activo, setActivo] = useState(0)
  /** Índice de variante (VLT) elegido por línea. Vive acá para que el simulador
   *  y el recomendador puedan abrir una lámina con el VLT ya marcado. */
  const [seleccion, setSeleccion] = useState<Record<string, number>>({})
  /** El usuario ya movió el carrusel: se apagan la pista de deslizar y el pulso del botón. */
  const [movido, setMovido] = useState(false)
  /** La pista "Deslizá" está en pantalla (se muestra una sola vez al llegar a la sección). */
  const [pistaVisible, setPistaVisible] = useState(false)
  const seccion = useRef<HTMLElement>(null)
  const pista = useRef<HTMLDivElement>(null)
  const zonaPista = useRef<HTMLDivElement>(null)

  const visibles = useMemo(
    () => (filtro === 'todos' ? lineas : lineas.filter((l) => l.categoria === filtro)),
    [lineas, filtro]
  )

  // Índice activo según qué card está más centrada en la pista.
  useEffect(() => {
    const el = pista.current
    if (!el) return
    let frame = 0
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!el) return
        const centro = el.scrollLeft + el.clientWidth / 2
        let mejor = 0
        let distancia = Infinity
        Array.from(el.children).forEach((c, i) => {
          const card = c as HTMLElement
          const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centro)
          if (d < distancia) {
            distancia = d
            mejor = i
          }
        })
        setActivo(mejor)
        if (el.scrollLeft > 8) {
          setMovido(true)
          setPistaVisible(false)
        }
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Pista de "deslizá": aparece una vez, cuando la sección ya está en pantalla,
  // y se va sola a los ~4 s o apenas el usuario mueve el carrusel. Solo en
  // celular (en PC la pista es una grilla y no hay nada que deslizar).
  useEffect(() => {
    const zonaEl = zonaPista.current
    const pistaEl = pista.current
    if (!zonaEl || !pistaEl) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.8) return
        io.disconnect()
        if (pistaEl.scrollWidth <= pistaEl.clientWidth + 1 || pistaEl.scrollLeft > 8) return
        setPistaVisible(true)
        timer = setTimeout(() => setPistaVisible(false), 4200)
      },
      { threshold: [0.8] }
    )
    io.observe(zonaEl)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [])

  function irA(i: number, behavior: ScrollBehavior = 'smooth') {
    const el = pista.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior })
  }

  // Pedidos del simulador y del recomendador: mostrar todas, marcar el VLT,
  // centrar la card y bajar hasta el carrusel.
  useEffect(() => {
    function onIrA(e: Event) {
      const { slug, sku } = (e as CustomEvent<IrALinea>).detail
      const i = lineas.findIndex((l) => l.slug === slug)
      if (i < 0) return
      const v = sku ? lineas[i].variantes.findIndex((x) => x.sku === sku) : -1
      // flushSync: la card tiene que estar renderizada (el filtro pudo
      // ocultarla) antes de medirla para el scroll.
      flushSync(() => {
        setFiltro('todos')
        if (v >= 0) setSeleccion((prev) => ({ ...prev, [slug]: v }))
      })
      const el = pista.current
      const card = el?.children[lineas.findIndex((l) => l.slug === slug)] as HTMLElement | undefined
      if (el && card && el.scrollWidth > el.clientWidth + 1) {
        // Carrusel (celular): centrar la card en la pista y bajar a la sección.
        irA(i, 'auto')
        setActivo(i)
        seccion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Grilla (PC): llevar la card al centro de la pantalla.
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      // Un destello dorado para que se vea cuál es.
      card?.animate(
        [{ boxShadow: '0 0 0 2px rgba(255,218,44,0.9)' }, { boxShadow: '0 0 0 2px rgba(255,218,44,0)' }],
        { duration: 1800, delay: 400, easing: 'ease-out' }
      )
    }
    window.addEventListener(EVENTO_IR_A_LINEA, onIrA)
    return () => window.removeEventListener(EVENTO_IR_A_LINEA, onIrA)
  }, [lineas])

  function cambiarFiltro(f: Filtro) {
    setFiltro(f)
    setActivo(0)
    pista.current?.scrollTo({ left: 0 })
    trackEvent('catalogo_filtro', { filtro: f })
  }

  return (
    <section ref={seccion} id="productos" className={`scroll-mt-4 ${SECCION}`}>
      <div className={`${CONTENEDOR} lg:flex lg:items-end lg:justify-between lg:gap-10`}>
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/55">La línea de lanzamiento</p>
          <h2 className={`mt-3 ${TITULO}`} style={{ fontFamily: 'var(--font-display)' }}>
            Elegí con qué vas a trabajar
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/60 lg:text-lg">
            Precio por rollo, en dólares.<span className="lg:hidden"> Deslizá para ver cada lámina.</span>
          </p>
        </div>

        <div role="tablist" aria-label="Filtrar por categoría" className="mt-6 flex shrink-0 gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={filtro === f.id}
              onClick={() => cambiarFiltro(f.id)}
              className={`h-10 rounded-full px-4 text-sm font-medium transition ${
                filtro === f.id ? 'bg-white text-[#0A0A0A]' : 'border border-white/15 text-white/70 hover:border-white/30 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div
          ref={pista}
          className="scrollbar-none mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[max(1.25rem,calc((100vw-36rem)/2))] pb-2 lg:mx-auto lg:mt-12 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-10 lg:pb-0 xl:grid-cols-4"
          aria-roledescription="carrusel"
          data-sin-barra
        >
          {visibles.map((linea, i) => (
            <Card
              key={linea.slug}
              linea={linea}
              vigente={vigente}
              prioridad={i === 0}
              idx={seleccion[linea.slug] ?? 0}
              onIdx={(n) => setSeleccion((prev) => ({ ...prev, [linea.slug]: n }))}
            />
          ))}
        </div>

        {/* Pista de deslizar: se apoya sobre la foto de la primera card, usando la
            misma caja que las cards para quedar centrada en ella. No intercepta toques. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-8 px-[max(1.25rem,calc((100vw-36rem)/2))] lg:hidden"
        >
          {/* Se observa esta caja (la foto de la primera card) y no toda la sección:
              la sección es más alta que la pantalla y nunca llegaría a la mitad visible. */}
          <div ref={zonaPista} className="grid aspect-[4/3] w-[86vw] max-w-[24rem] place-items-center">
            <div
              className={`flex items-center gap-3 rounded-full border border-[#FFDA2C]/60 bg-black/70 py-3 pl-5 pr-4 text-[#FFDA2C] shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur transition-all duration-500 ${
                pistaVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              <span className="text-base font-semibold text-white">Deslizá</span>
              <svg viewBox="0 0 64 24" width="56" height="21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="kf-flecha">
                <path className="kf-flecha-linea" d="M58 12H8" pathLength={1} />
                <path className="kf-flecha-punta" d="M18 3L8 12L18 21" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-xl items-center justify-between px-5 lg:hidden">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {visibles.map((l, i) => (
            <span
              key={l.slug}
              className={`h-2 rounded-full transition-all duration-300 ${i === activo ? 'w-7 bg-[#FFDA2C]' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="mr-1 text-sm font-medium tabular-nums text-white/75">
            {activo + 1} / {visibles.length}
          </span>
          <button
            type="button"
            onClick={() => irA(Math.max(0, activo - 1))}
            disabled={activo === 0}
            aria-label="Lámina anterior"
            className="grid size-12 place-items-center rounded-full border-2 border-white/60 bg-white/10 text-white transition active:scale-95 disabled:border-white/15 disabled:bg-transparent disabled:text-white/30"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => irA(Math.min(visibles.length - 1, activo + 1))}
            disabled={activo === visibles.length - 1}
            aria-label="Lámina siguiente"
            className="relative grid size-12 place-items-center rounded-full bg-[#FFDA2C] text-[#0A0A0A] transition active:scale-95 disabled:bg-transparent disabled:text-white/30 disabled:ring-2 disabled:ring-inset disabled:ring-white/15"
          >
            {/* Anillo que late hasta que el usuario mueve el carrusel por su cuenta. */}
            {!movido && activo === 0 && (
              <span aria-hidden="true" className="kf-pulso absolute inset-0 rounded-full bg-[#FFDA2C]" />
            )}
            <ChevronRight className="relative size-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  )
}

function Card({
  linea,
  vigente,
  prioridad,
  idx,
  onIdx,
}: {
  linea: Linea
  vigente: boolean
  prioridad: boolean
  idx: number
  onIdx: (n: number) => void
}) {
  const variante = linea.variantes[idx]
  const ref = useRef<HTMLElement>(null)
  const [vista, setVista] = useState(false)

  // Mide qué láminas se miran, y dispara la animación de las barras al entrar.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          setVista(true)
          trackEvent('catalogo_view_product', { linea: linea.slug })
          io.disconnect()
        }
      },
      { threshold: [0.6] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [linea.slug])

  const premium = linea.categoria === 'premium'

  return (
    <article
      ref={ref}
      aria-label={linea.nombre}
      className="flex w-[86vw] max-w-[24rem] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141414] transition-colors lg:w-auto lg:max-w-none lg:hover:border-white/25"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={linea.foto}
          alt={linea.variantes[0].vlt === null ? `Auto protegido con ${linea.nombre}` : `Vista a través de una lámina ${linea.nombre}`}
          fill
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 384px, 320px"
          className="object-cover"
          priority={prioridad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
              premium ? 'chip-premium' : 'chip-standard'
            }`}
          >
            {premium ? 'Premium' : 'Standard'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {linea.garantiaAnios} años
          </span>
        </div>
        <div className="absolute inset-x-5 bottom-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- logotipo SVG */}
          <img src={linea.logo} alt={linea.nombre} className="kf-logo-white h-7 w-auto" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">{linea.tecnologia}</p>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-white/70">{linea.descripcion}</p>

        {variante.vlt !== null ? (
          <>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-white/55">Transmisión de luz (VLT)</span>
              <span className="font-mono text-xs text-white/55">{variante.sku}</span>
            </div>
            <div className="mt-2 flex gap-2">
              {linea.variantes.map((v, i) => (
                <button
                  key={v.sku}
                  type="button"
                  aria-pressed={i === idx}
                  onClick={() => {
                    onIdx(i)
                    trackEvent('catalogo_vlt', { linea: linea.slug, sku: v.sku })
                  }}
                  className={`h-10 flex-1 rounded-xl text-sm font-semibold tabular-nums transition ${
                    i === idx ? 'bg-white text-[#0A0A0A]' : 'border border-white/15 text-white/70'
                  }`}
                >
                  {v.vlt}%
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <Barra label="Rechazo infrarrojo" valor={variante.ir} activa={vista} />
              <Barra label="Protección UV" valor={variante.uv} activa={vista} />
            </div>
          </>
        ) : (
          <ul className="mt-5 flex flex-wrap gap-2">
            {linea.rasgos?.map((r) => (
              <li key={r} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75">
                {r}
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 text-sm">
          <div className="bg-[#141414] px-3 py-2.5">
            <dt className="text-[11px] text-white/55">Espesor</dt>
            <dd className="mt-0.5 font-medium">{linea.espesor}</dd>
          </div>
          <div className="bg-[#141414] px-3 py-2.5">
            <dt className="text-[11px] text-white/55">Rollo</dt>
            <dd className="mt-0.5 font-medium">
              {linea.rollo.ancho.toFixed(2)} × {linea.rollo.largo} m
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-6">
          {vigente ? (
            <>
              <p className="text-xs text-white/55">Precio de lanzamiento · por rollo</p>
              <p
                className="mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.01em] tabular-nums"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {formatPrecio(linea.precio)}
                <span className="ml-2 text-sm font-medium tracking-normal text-white/55">+ IVA</span>
              </p>
            </>
          ) : (
            <p className="text-base text-white/70">Consultá el precio vigente por WhatsApp.</p>
          )}
          <WhatsAppLink
            mensaje={mensajeProducto(linea.nombre, variante.sku)}
            donde="card"
            linea={linea.slug}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl btn-primary text-[15px] transition active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5 text-[#25D366]" />
            Lo quiero para mi taller
          </WhatsAppLink>
        </div>
      </div>
    </article>
  )
}

function Barra({ label, valor, activa }: { label: string; valor: number | null; activa: boolean }) {
  if (valor === null) return null
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-semibold tabular-nums">{valor}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#EB3439] to-[#FFDA2C] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: activa ? `${valor}%` : '0%' }}
        />
      </div>
    </div>
  )
}
