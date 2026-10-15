'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, ChevronDown, Lock, MapPin, X } from 'lucide-react'

/**
 * El teléfono de la sección del Portal de Instaladores en la home. Recrea en
 * HTML las cuatro pantallas del circuito de turnos con los datos reales de
 * polariz.ar/polarizados-del-sur (nombre, logo, portada, servicios y horario,
 * copiados a `public/turnera-demo/`). No llama a nada: es una animación.
 *
 * Los clientes que piden turno (Martina, Lucas) son inventados.
 *
 * Si cambian los datos de ese taller, esto no se entera: hay que actualizar los
 * textos en `portal_instaladores.mock` y las imágenes a mano.
 */

export const PASOS = ['config', 'landing', 'booking', 'agenda'] as const
export type Paso = (typeof PASOS)[number]

const NARANJA = '#EA580C'

/**
 * Avanza por fases en los milisegundos indicados; `quieto` salta al final.
 * Cada pantalla se monta de nuevo al cambiar de paso (`key`), así que arranca
 * siempre en la fase 0 sin tener que reiniciarla.
 */
function useFases(tiempos: readonly number[], quieto: boolean) {
  const [fase, setFase] = useState(0)
  useEffect(() => {
    if (quieto) return
    const ids = tiempos.map((ms, i) => setTimeout(() => setFase(i + 1), ms))
    return () => ids.forEach(clearTimeout)
  }, [tiempos, quieto])
  return quieto ? tiempos.length : fase
}

function Tipeo({ texto, quieto, retraso = 0 }: { texto: string; quieto: boolean; retraso?: number }) {
  const [tipeados, setN] = useState(0)
  const n = quieto ? texto.length : tipeados
  useEffect(() => {
    if (quieto) return
    let i = 0
    let intervalo: ReturnType<typeof setInterval> | undefined
    const inicio = setTimeout(() => {
      intervalo = setInterval(() => {
        i += 1
        setN(i)
        if (i >= texto.length) clearInterval(intervalo)
      }, 45)
    }, retraso)
    return () => {
      clearTimeout(inicio)
      clearInterval(intervalo)
    }
  }, [texto, quieto, retraso])

  return (
    <>
      {texto.slice(0, n)}
      {n < texto.length && <span className="inline-block w-px h-[1em] align-[-2px] bg-white/80 animate-pulse" />}
    </>
  )
}

/* ─────────────────────── Cabecera del portal ─────────────────────── */

function CabeceraPortal() {
  return (
    <div className="flex items-center justify-between px-3.5 h-10 border-b border-white/[0.08]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-stiker.png" alt="" width={72} height={13} className="h-[13px] w-auto" />
      <span className="flex items-center gap-1 rounded-md border border-white/15 px-2 py-[3px] text-[10px] text-white/85">
        Polarizados del Sur
        <ChevronDown className="size-3 opacity-60" />
      </span>
    </div>
  )
}

/* ─────────────────────── 1. Configuración ─────────────────────── */

const T_CONFIG = [1500, 3500] as const

function PantallaConfig({ quieto }: { quieto: boolean }) {
  const t = useTranslations('portal_instaladores.mock')
  const fase = useFases(T_CONFIG, quieto)
  const servicios = [t('svc1'), t('svc2'), t('svc3')]

  return (
    <div className="h-full bg-[#121212] text-white">
      <CabeceraPortal />
      <div className="px-3.5 pt-3.5">
        <p className="text-[17px] font-medium tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {t('config_title')}
        </p>
        <div className="mt-2.5 flex gap-4 border-b border-white/10 text-[10.5px]">
          <span className="pb-1.5 text-white/45">{t('tab_general')}</span>
          <span className="pb-1.5 border-b-2 border-white font-medium">{t('tab_public')}</span>
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-3 space-y-3">
          <div>
            <p className="text-[10px] text-white/55 mb-1">{t('address_label')}</p>
            <div className="flex items-center rounded-md border border-white/15 bg-black/30 px-2 h-7 text-[11px]">
              <span className="text-white/40">polariz.ar/</span>
              <span>
                <Tipeo texto="polarizados-del-sur" quieto={quieto} retraso={300} />
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-white/55 mb-1">{t('services_label')}</p>
            <ul className="space-y-1.5">
              {servicios.map((s, i) => {
                const on = fase >= 1
                return (
                  <li key={s} className="flex items-center justify-between text-[11px]">
                    <span className="truncate pr-2">{s}</span>
                    <span
                      className="relative h-[15px] w-[26px] shrink-0 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: on ? '#22C55E' : 'rgba(255,255,255,0.15)', transitionDelay: quieto ? '0ms' : `${i * 220}ms` }}
                    >
                      <span
                        className="absolute top-[2px] size-[11px] rounded-full bg-white transition-all duration-300"
                        style={{ left: on ? 13 : 2, transitionDelay: quieto ? '0ms' : `${i * 220}ms` }}
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-white/55 mb-1">{t('hours_label')}</p>
            <p className="text-[11px]">{t('hours_value')}</p>
          </div>
        </div>

        <div className="mt-3 h-8 rounded-lg flex items-center justify-center text-[11px] font-medium transition-colors duration-300"
          style={{ backgroundColor: fase >= 2 ? '#16A34A' : '#FFFFFF', color: fase >= 2 ? '#FFFFFF' : '#0A0A0A' }}
        >
          {fase >= 2 ? (
            <span className="flex items-center gap-1.5"><Check className="size-3.5" />{t('published')}</span>
          ) : (
            t('publish')
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── 2. Página pública ─────────────────────── */

const T_LANDING = [600, 2900] as const

function PortadaTaller({ boton }: { boton?: ReactNode }) {
  const t = useTranslations('portal_instaladores.mock')
  return (
    <div className="relative h-[232px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/turnera-demo/hero.webp" alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#0A0A0A]" />
      <div className="relative flex items-center justify-between px-3 pt-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/turnera-demo/logo.webp" alt="" className="h-[15px] w-auto" />
        <span className="text-[8px] text-white/80">{t('authorized')}</span>
      </div>
      <div className="relative mt-9 px-3 text-center">
        <p className="text-[19px] font-bold leading-tight tracking-tight text-white">Polarizados del Sur</p>
        <p className="mt-1 text-[9.5px] text-white/80">Av Chacabuco 2335 · {t('hours_short')}</p>
        <div className="mt-3.5 flex justify-center gap-2">
          {boton}
          <span className="rounded-full border border-green-500/70 px-3.5 py-1.5 text-[10.5px] font-semibold text-white">
            WhatsApp
          </span>
        </div>
      </div>
    </div>
  )
}

function PantallaLanding({ quieto }: { quieto: boolean }) {
  const t = useTranslations('portal_instaladores.mock')
  const fase = useFases(T_LANDING, quieto)
  const servicios = [
    { n: t('svc1'), d: t('svc1_desc'), p: '$ 350.000', tag: t('tag_booking') },
    { n: t('svc2'), d: t('svc2_desc'), p: '$ 450.000', tag: t('tag_visit') },
    { n: t('svc3'), d: t('svc3_desc'), p: '$ 250.000', tag: t('tag_booking') },
  ]

  return (
    <div className="h-full bg-[#0A0A0A] text-white">
      <PortadaTaller
        boton={
          <span className="relative">
            {fase >= 2 && !quieto && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: NARANJA }}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
            <span className="relative block rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold text-white" style={{ backgroundColor: NARANJA }}>
              {t('book')}
            </span>
          </span>
        }
      />
      <div className="px-3 pt-1">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-bold">{t('services_title')}</p>
          <p className="text-[8.5px] tracking-wider text-white/45 uppercase">{t('services_count')}</p>
        </div>
        <ul className="mt-2 space-y-1.5">
          {servicios.map((s, i) => (
            <motion.li
              key={s.n}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2"
              initial={quieto ? false : { opacity: 0, y: 10 }}
              animate={fase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.35, delay: quieto ? 0 : i * 0.15 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold truncate">{s.n}</p>
                  <p className="text-[9px] text-white/50 truncate">{s.d}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10.5px] font-semibold">{s.p}</p>
                  <p className="text-[7.5px] font-semibold tracking-wider" style={{ color: NARANJA }}>{s.tag}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────── 3. Pedido de turno ─────────────────────── */

const T_BOOKING = [900, 1900, 2800, 3300] as const

function PantallaTurno({ quieto }: { quieto: boolean }) {
  const t = useTranslations('portal_instaladores.mock')
  const fase = useFases(T_BOOKING, quieto)
  const dias = [
    { d: t('d1'), n: 20 },
    { d: t('d2'), n: 21 },
    { d: t('d3'), n: 22 },
    { d: t('d4'), n: 23 },
    { d: t('d5'), n: 24 },
  ]
  const horarios = ['09:00', '09:45', '10:30', '11:15', '14:00', '15:30']

  return (
    <div className="relative h-full bg-[#0A0A0A] text-white">
      <div className="opacity-40 pointer-events-none">
        <PortadaTaller />
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 top-[64px] rounded-t-2xl bg-[#121212] border-t border-white/10"
        initial={quieto ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between px-3.5 h-10 border-b border-white/10">
          <p className="text-[13px] font-bold">{t('book_title')}</p>
          <X className="size-3.5 text-white/60" />
        </div>

        <div className="px-3.5 pt-2.5">
          <div className="flex items-center gap-2 text-[9.5px]">
            <span className="flex items-center gap-1 text-white/60">
              <span className="grid place-items-center size-3.5 rounded-full bg-white/15"><Check className="size-2.5" /></span>
              {t('step_service')}
            </span>
            <span className="h-px w-3 bg-white/20" />
            <span className="flex items-center gap-1 font-medium">
              <span className="grid place-items-center size-3.5 rounded-full text-[8px]" style={{ backgroundColor: NARANJA }}>2</span>
              {t('step_time')}
            </span>
          </div>

          <div className="mt-2.5 rounded-lg border px-2.5 py-1.5 text-[10px]" style={{ borderColor: `${NARANJA}99`, backgroundColor: `${NARANJA}14` }}>
            {t('svc1')} · <span className="text-white/60">$ 350.000</span>
          </div>

          <p className="mt-3 text-[10px] font-medium">{t('pick_day')}</p>
          <div className="mt-1.5 grid grid-cols-5 gap-1">
            {dias.map((d, i) => {
              const sel = i === 1 && fase >= 1
              return (
                <span
                  key={d.n}
                  className="rounded-lg border py-1 text-center transition-colors duration-200"
                  style={{ borderColor: sel ? NARANJA : 'rgba(255,255,255,0.12)', backgroundColor: sel ? NARANJA : 'transparent' }}
                >
                  <span className="block text-[8px] uppercase opacity-70">{d.d}</span>
                  <span className="block text-[12px] font-semibold">{d.n}</span>
                </span>
              )
            })}
          </div>

          <p className="mt-3 text-[10px] font-medium">{t('pick_time')}</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {horarios.map((h, i) => {
              const ocupado = i === 1
              const sel = h === '10:30' && fase >= 2
              return (
                <span
                  key={h}
                  className="rounded-md border py-1.5 text-center text-[10.5px] transition-colors duration-200"
                  style={{
                    borderColor: sel ? NARANJA : 'rgba(255,255,255,0.12)',
                    backgroundColor: sel ? NARANJA : 'transparent',
                    opacity: ocupado ? 0.3 : 1,
                    textDecoration: ocupado ? 'line-through' : 'none',
                  }}
                >
                  {h}
                </span>
              )
            })}
          </div>

          <motion.div
            className="mt-3.5 h-8 rounded-full grid place-items-center text-[11px] font-semibold"
            style={{ backgroundColor: NARANJA, opacity: fase >= 2 ? 1 : 0.45 }}
            animate={fase === 3 && !quieto ? { scale: [1, 0.94, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {t('send')}
          </motion.div>
        </div>

        <AnimatePresence>
          {fase >= 4 && (
            <motion.div
              className="absolute inset-0 rounded-t-2xl bg-[#121212] grid place-items-center px-6 text-center"
              initial={quieto ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <motion.span
                  className="mx-auto grid place-items-center size-12 rounded-full bg-green-500/15 text-green-400"
                  initial={quieto ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                >
                  <Check className="size-6" strokeWidth={2.5} />
                </motion.span>
                <p className="mt-3 text-[15px] font-bold">{t('sent')}</p>
                <p className="mt-1 text-[10.5px] text-white/60 leading-snug">{t('sent_desc')}</p>
                <p className="mt-3 inline-block rounded-full border border-white/15 px-3 py-1 text-[10px]">
                  {t('d2')} 21 · 10:30 · {t('svc1')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ─────────────────────── 4. Agenda del instalador ─────────────────────── */

const T_AGENDA = [700, 2700] as const

function PantallaAgenda({ quieto }: { quieto: boolean }) {
  const t = useTranslations('portal_instaladores.mock')
  const fase = useFases(T_AGENDA, quieto)
  const confirmado = fase >= 2

  return (
    <div className="h-full bg-[#121212] text-white">
      <CabeceraPortal />
      <div className="px-3.5 pt-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-medium tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {t('inbox_title')}
          </p>
          <span className="relative">
            <Bell className="size-4 text-white/70" />
            {fase >= 1 && !confirmado && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full" style={{ backgroundColor: NARANJA }} />
            )}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-white/50 leading-snug">{t('inbox_desc')}</p>

        <div className="mt-3 space-y-2">
          <AnimatePresence initial={false}>
            {fase >= 1 && (
              <motion.div
                key="nuevo"
                className="rounded-xl border bg-[#1A1A1A] p-3 transition-colors duration-300"
                style={{ borderColor: confirmado ? 'rgba(34,197,94,0.45)' : `${NARANJA}AA` }}
                initial={quieto ? false : { opacity: 0, y: -14, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold">Martina G.</p>
                  <span
                    className="rounded-full px-2 py-[2px] text-[8.5px] font-semibold"
                    style={confirmado ? { backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ADE80' } : { backgroundColor: `${NARANJA}26`, color: '#FB923C' }}
                  >
                    {confirmado ? t('confirmed') : t('new')}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-white/60">{t('svc1')} · Toyota Corolla</p>
                <p className="mt-1.5 text-[10.5px]">{t('d2')} 21 · 10:30</p>
                {confirmado ? (
                  <p className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-green-400">
                    <Check className="size-3.5" />
                    {t('order_created')}
                  </p>
                ) : (
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <motion.span
                      className="h-7 rounded-md bg-white text-[#0A0A0A] text-[10.5px] font-medium grid place-items-center"
                      animate={fase >= 1 && !quieto ? { scale: [1, 1, 0.93, 1] } : { scale: 1 }}
                      transition={{ duration: 2, times: [0, 0.85, 0.93, 1] }}
                    >
                      {t('confirm')}
                    </motion.span>
                    <span className="h-7 rounded-md border border-white/15 text-[10.5px] grid place-items-center text-white/80">
                      {t('other_time')}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-xl border border-white/[0.08] bg-[#1A1A1A] p-3 opacity-60">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold">Lucas P.</p>
              <span className="rounded-full px-2 py-[2px] text-[8.5px] font-semibold bg-green-500/15 text-green-400">
                {t('confirmed')}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-white/60">{t('svc3')} · Scania R450</p>
            <p className="mt-1.5 text-[10.5px]">{t('d1')} 20 · 09:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── El teléfono ─────────────────────── */

const PANTALLAS: Record<Paso, (p: { quieto: boolean }) => ReactNode> = {
  config: PantallaConfig,
  landing: PantallaLanding,
  booking: PantallaTurno,
  agenda: PantallaAgenda,
}

export default function TurneraMockup({ paso, quieto }: { paso: Paso; quieto: boolean }) {
  const publica = paso === 'landing' || paso === 'booking'
  const url = publica ? 'polariz.ar/polarizados-del-sur' : 'kristallfilm.com/cliente/taller'
  const Pantalla = PANTALLAS[paso]

  return (
    <div className="relative mx-auto w-[264px] sm:w-[284px]">
      {/* Halo detrás del teléfono: naranja en la parte pública, neutro en el portal. */}
      <div
        className="absolute -inset-8 rounded-[3rem] blur-3xl transition-colors duration-700"
        style={{ backgroundColor: publica ? 'rgba(234,88,12,0.18)' : 'rgba(10,10,10,0.10)' }}
      />

      <div className="relative rounded-[2.5rem] bg-[#0A0A0A] p-[8px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.08)]">
        <div className="relative h-[500px] sm:h-[520px] overflow-hidden rounded-[2.05rem] bg-[#0A0A0A]">
          {/* Barra de estado */}
          <div className="relative flex h-7 items-center justify-between px-6 text-[10px] font-semibold text-white">
            <span>10:30</span>
            <span className="absolute left-1/2 top-[6px] h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/5" />
            <span className="flex gap-[2px]">
              <span className="h-[7px] w-[3px] rounded-[1px] bg-white" />
              <span className="h-[7px] w-[3px] rounded-[1px] bg-white" />
              <span className="h-[7px] w-[3px] rounded-[1px] bg-white/40" />
            </span>
          </div>

          {/* Barra del navegador */}
          <div className="px-3 pb-1.5">
            <div className="flex h-6 items-center justify-center gap-1 rounded-md bg-white/[0.08] text-[9.5px] text-white/70">
              {publica ? <MapPin className="size-2.5" /> : <Lock className="size-2.5" />}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {url}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute inset-x-0 top-[58px] bottom-0 overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={paso}
                className="absolute inset-0"
                initial={quieto ? { opacity: 0 } : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={quieto ? { opacity: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <Pantalla quieto={quieto} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
