'use client'

import Image from 'next/image'
import { CalendarCheck, Link2, Loader2, Search, Sparkles } from 'lucide-react'
import { FlagStripe } from './Hero'
import { CONTENEDOR, SECCION, TITULO } from './layout'
import Reveal from './Reveal'
import { useDemo } from './useDemo'
import { WhatsAppIcon } from './whatsapp'

const PUNTOS = [
  {
    icon: Link2,
    titulo: 'El link para tu bio',
    texto: 'Ponelo en Instagram, en tu WhatsApp Business o en una tarjeta. Una sola dirección con todo tu taller.',
  },
  {
    icon: CalendarCheck,
    titulo: 'Turnos a cualquier hora',
    texto: 'Tu cliente elige el servicio y pide turno aunque estés trabajando. Vos lo confirmás desde el portal.',
  },
  {
    icon: Search,
    titulo: 'Pensada para que te encuentren en Google',
    texto: 'Lleva el nombre de tu taller, tu zona y lo que hacés: los datos que Google usa para mostrarte.',
  },
]

/**
 * La página pública del taller en polariz.ar (repo `polarizar`, app/[handle]):
 * el instalador la publica desde Mi Taller → Configuración → Página pública.
 *
 * Sobre el SEO, a propósito "pensada para que te encuentren" y no "posicionás
 * primero": al 2026-10-04 polariz.ar tiene título y descripción por taller, pero
 * todavía no sitemap, robots.txt ni datos estructurados de negocio local.
 */
export default function PaginaTurnos() {
  // En la demo, Configuración abre directo en la pestaña de la página pública,
  // donde el prospecto elige su nombre y la publica bajo polariz.ar/demo/.
  const { entrar, cargando, error } = useDemo('/cliente/taller/configuracion', 'pagina-turnos')

  return (
    <section className={`${SECCION} overflow-hidden`}>
      <div className={`${CONTENEDOR} lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16`}>
        <div>
          <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#E6A800]">
            <FlagStripe />
            Tu página de turnos
          </p>
          <h2 className={`mt-3 ${TITULO}`} style={{ fontFamily: 'var(--font-display)' }}>
            Tu taller, con su propia página.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65 lg:text-lg">
            <span className="font-mono text-white">polariz.ar/tutaller</span> — la armás en minutos desde el portal,
            con tus fotos, tus servicios y tu horario. Es tuya: la marca que manda es la de tu taller.
          </p>

          <ul className="mt-8 space-y-5">
            {PUNTOS.map((p) => (
              <li key={p.titulo} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                  <p.icon className="size-5 text-white" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-white lg:text-base">{p.titulo}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-white/60">{p.texto}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold text-white">¿Qué es el SEO?</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">
              Es lo que hace que tu taller aparezca cuando alguien busca <em>“polarizado en Morón”</em> en Google, sin
              pagar publicidad. Cuanto mejor está armada tu página, más arriba te puede mostrar.
            </p>
          </div>

          <button
            type="button"
            onClick={entrar}
            disabled={cargando}
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 text-base font-semibold text-[#0A0A0A] transition hover:bg-white/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
          >
            {cargando ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-5" aria-hidden="true" />
            )}
            Armá la tuya en la demo
          </button>
          <p className="mt-2 text-xs text-white/55">Elegís el nombre y la publicás de prueba. Sin registrarte.</p>
          {error && (
            <p role="alert" className="mt-3 text-sm text-[#ff8a8a]">
              {error}
            </p>
          )}
        </div>

        <Reveal className="mt-14 lg:mt-0">
          <Telefono />
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Maqueta de la página de un taller en un celular. Dibujada y no una captura:
 * pesa casi nada, se ve nítida en cualquier pantalla y no depende de un taller
 * real. Los colores son los de polarizar (`app/globals.css`: tinta #1e242c,
 * acento #0284c7) para que se parezca a lo que el taller va a ver.
 */
function Telefono() {
  return (
    <div className="relative mx-auto w-[17.5rem] sm:w-[19rem] lg:w-[21rem]" aria-hidden="true">
      {/* Resplandor detrás del equipo. */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-[#0284c7]/20 blur-3xl" />

      <div className="overflow-hidden rounded-[2.6rem] border-[10px] border-[#1c1c1e] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        {/* Barra de dirección */}
        <div className="flex items-center justify-center bg-[#f6f8fa] px-4 pb-2 pt-6">
          <span className="rounded-full bg-white px-3 py-1 font-mono text-[11px] text-[#1e242c] shadow-sm ring-1 ring-[#c7ccd3]">
            polariz.ar/<strong>tallercarlos</strong>
          </span>
        </div>

        {/* Hero */}
        <div className="relative h-44">
          <Image src="/cat/top-KERAMX.jpg" alt="" fill sizes="(min-width: 1024px) 336px, 304px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-x-4 bottom-3 text-white">
            <p className="text-[19px] font-semibold leading-tight tracking-[-0.02em]">Taller Carlos</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/85">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Abierto ahora · Morón
            </p>
          </div>
        </div>

        <div className="space-y-3 px-4 pb-6 pt-4 text-[#1e242c]">
          <div className="flex gap-2">
            <span className="flex h-9 flex-1 items-center justify-center rounded-full bg-[#0284c7] text-[12px] font-semibold text-white">
              Agendar turno
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c7ccd3] text-[#25D366]">
              <WhatsAppIcon className="size-4" />
            </span>
          </div>

          <p className="pt-1 text-[13px] font-semibold">Servicios</p>
          {[
            ['Polarizado completo', 'Láminas Kristall'],
            ['Parabrisas nanocerámico', 'Rechazo de calor'],
            ['PPF en frente', 'Protección de pintura'],
          ].map(([nombre, detalle]) => (
            <div
              key={nombre}
              className="flex items-center justify-between rounded-xl border border-[#c7ccd3]/70 bg-[#f6f8fa] px-3 py-2"
            >
              <span>
                <span className="block text-[12px] font-semibold">{nombre}</span>
                <span className="block text-[10px] text-[#6b7480]">{detalle}</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#0284c7]">Turno</span>
            </div>
          ))}

          <p className="pt-1 text-center text-[10px] text-[#6b7480]">Instalador autorizado Kristall Film</p>
        </div>
      </div>

      {/* El "link de la bio", flotando al costado del equipo. */}
      <div className="absolute -left-6 top-24 rotate-[-4deg] rounded-2xl bg-white px-3 py-2 text-[#1e242c] shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:-left-12">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6b7480]">Link en la bio</p>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-[#0284c7]">
          <Link2 className="size-3.5" />
          polariz.ar/tallercarlos
        </p>
      </div>
    </div>
  )
}
