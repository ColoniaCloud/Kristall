'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { Link } from '@/i18n/routing'
import TurneraMockup, { PASOS, type Paso } from './TurneraMockup'

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/** Cuánto dura cada paso antes de pasar al siguiente. */
const DURACION_PASO_MS = 6500

/**
 * Promoción del Portal de Instaladores en la home, centrada en la página
 * pública del taller con turnera: un teléfono recreado en código
 * (`TurneraMockup`) recorre los cuatro pasos —configurar, la página en
 * polariz.ar, el pedido de turno y la confirmación— y la lista de pasos al
 * costado avanza sola o se toca.
 *
 * El avance usa la animación CSS de la barra de progreso (`onAnimationEnd`):
 * pausarla es solo cambiar `animation-play-state`, sin timers que recalcular.
 * Se pausa con el mouse encima, con el foco adentro, fuera de pantalla y con
 * "reducir movimiento" (ahí no hay autoplay: los pasos se tocan).
 *
 * El botón de la demo repite la lógica de `components/client-portal/BotonDemo`
 * en vez de reusarlo: aquel vive dentro del portal (tema oscuro, `Button` de
 * shadcn) y avisa los errores con `toast`, que acá no se vería porque el layout
 * público no monta el `<Toaster />`. De ahí el aviso inline.
 */
export default function PortalInstaladores() {
  const t = useTranslations('portal_instaladores')
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

  const [activo, setActivo] = useState(0)
  const [encima, setEncima] = useState(false)
  const [foco, setFoco] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const enPantalla = useInView(ref, { amount: 0.2 })
  const reducido = useReducedMotion() ?? false
  const corriendo = enPantalla && !encima && !foco && !reducido
  const paso: Paso = PASOS[activo]

  async function entrar() {
    setCargando(true)
    setError(false)
    try {
      const res = await fetch('/api/portal/demo', { method: 'POST' })
      if (!res.ok) {
        setError(true)
        return
      }
      // `/cliente` queda fuera del middleware de i18n, así que va sin locale.
      router.push('/cliente/taller')
      router.refresh()
    } catch {
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  const siguiente = () => setActivo((i) => (i + 1) % PASOS.length)

  return (
    <section className="px-6 py-14 md:py-20 bg-[#F2F2F0] overflow-hidden" aria-labelledby="portal-instaladores-titulo">
      <motion.div
        ref={ref}
        className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-14 gap-y-8 md:items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUpVariants}
        // Solo mouse de verdad: en táctil el toque dispara "enter" sin "leave"
        // y el carrusel quedaría pausado para siempre.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setEncima(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setEncima(false)}
        // Idem el foco: el que deja un clic no cuenta, solo el de teclado.
        onFocusCapture={(e) => e.target.matches(':focus-visible') && setFoco(true)}
        onBlurCapture={() => setFoco(false)}
      >
        {/* Texto */}
        <div className="md:col-start-2 md:row-start-1 max-w-[520px]">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#EA580C] mb-3">{t('eyebrow')}</p>
          <h2
            id="portal-instaladores-titulo"
            className="text-[26px] md:text-[34px] leading-[1.15] font-medium text-[#0A0A0A] mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[15px] md:text-base text-[#5C5C5C] leading-relaxed">{t('desc')}</p>
        </div>

        {/* Teléfono. Es decorativo: lo que muestra está dicho en los pasos. */}
        <div className="md:col-start-1 md:row-start-1 md:row-span-3 py-4" aria-hidden="true">
          <TurneraMockup paso={paso} quieto={reducido} />
        </div>

        {/* Pasos */}
        <div className="md:col-start-2 md:row-start-2 max-w-[520px]">
          <div role="tablist" aria-label={t('steps_label')} className="grid grid-cols-4 gap-1.5 md:grid-cols-1 md:gap-1">
            {PASOS.map((p, i) => {
              const sel = i === activo
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={sel}
                  onClick={() => setActivo(i)}
                  className={`group relative rounded-lg overflow-hidden transition-colors text-center md:text-left px-1 pt-2 pb-2.5 md:px-4 md:py-3 ${
                    sel ? 'bg-white shadow-[var(--shadow-card)]' : 'hover:bg-white/60'
                  }`}
                >
                  <span className="flex flex-col items-center gap-1 md:flex-row md:gap-3">
                    <span
                      className={`grid place-items-center shrink-0 size-5 md:size-6 rounded-full text-[11px] md:text-xs font-semibold transition-colors ${
                        sel ? 'bg-[#0A0A0A] text-white' : 'bg-[#E4E4E2] text-[#5C5C5C]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-[11.5px] md:text-[15px] font-medium leading-tight ${sel ? 'text-[#0A0A0A]' : 'text-[#5C5C5C]'}`}>
                      <span className="md:hidden">{t(`steps.${p}.short`)}</span>
                      <span className="hidden md:inline">{t(`steps.${p}.title`)}</span>
                    </span>
                  </span>
                  {sel && (
                    <span className="hidden md:block mt-1 pl-9 text-sm text-[#5C5C5C] leading-relaxed">
                      {t(`steps.${p}.desc`)}
                    </span>
                  )}

                  {/* Barra de progreso: su fin de animación es lo que pasa al paso siguiente. */}
                  {sel && (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#E4E4E2]">
                      <span
                        key={`${activo}-${reducido}`}
                        className="block h-full origin-left bg-[#EA580C]"
                        style={
                          reducido
                            ? undefined
                            : {
                                animation: `turnera-progreso ${DURACION_PASO_MS}ms linear forwards`,
                                animationPlayState: corriendo ? 'running' : 'paused',
                              }
                        }
                        onAnimationEnd={siguiente}
                      />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {/* En celular la descripción del paso activo va debajo de las pestañas. */}
          <p className="md:hidden mt-3 text-sm text-[#5C5C5C] leading-relaxed min-h-[3em]" aria-live="polite">
            {t(`steps.${paso}.desc`)}
          </p>
        </div>

        {/* Botones */}
        <div className="md:col-start-2 md:row-start-3 max-w-[520px]">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={entrar}
              disabled={cargando}
              className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-white text-[15px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <PlayCircle className="size-4" aria-hidden="true" />
              )}
              {t('cta')}
            </button>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border-[0.5px] border-[#D4D4D2] bg-white text-[#0A0A0A] text-[15px] font-medium transition-colors hover:bg-[#FAFAF9]"
            >
              {t('cta_secondary')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="text-xs text-[#8A8A8A] leading-relaxed mt-3">{t('note')}</p>

          {error && (
            <p role="alert" className="text-xs text-[#CC0000] leading-relaxed mt-2">
              {t('error')}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  )
}
