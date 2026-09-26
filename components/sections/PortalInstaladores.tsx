'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2, PlayCircle } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/**
 * Promoción del Portal de Instaladores en la home: el recorrido en GIF a la
 * izquierda, el texto y la entrada a la demo a la derecha.
 *
 * El botón repite la lógica de `components/client-portal/BotonDemo` en vez de
 * reusarlo: aquel vive dentro del portal (tema oscuro, `Button` de shadcn) y
 * avisa los errores con `toast`, que acá no se vería porque el layout público
 * no monta el `<Toaster />`. De ahí el aviso inline.
 */
export default function PortalInstaladores() {
  const t = useTranslations('portal_instaladores')
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

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

  return (
    <section className="px-6 py-10 bg-[#F2F2F0]">
      <motion.div
        className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-6 md:gap-10 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUpVariants}
      >
        {/* GIF del recorrido */}
        <div className="rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[var(--shadow-card)] bg-[#0A0A0A]">
          {/* <img> y no next/image: el optimizador congela los GIF animados,
              y acá la animación es justamente lo que se muestra. */}
          <img
            src="/portal-instaladores.gif"
            alt={t('alt')}
            width={880}
            height={596}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>

        {/* Texto y entrada a la demo */}
        <div className="max-w-[460px]">
          <h2
            className="text-2xl md:text-3xl font-medium text-[#0A0A0A] mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[15px] md:text-base text-[#5C5C5C] leading-relaxed mb-6">
            {t('desc')}
          </p>

          <button
            type="button"
            onClick={entrar}
            disabled={cargando}
            className="btn-primary inline-flex items-center gap-2 h-11 px-5 rounded-lg text-white text-[15px] font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <PlayCircle className="size-4" aria-hidden="true" />
            )}
            {t('cta')}
          </button>

          <p className="text-xs text-[#8A8A8A] leading-relaxed mt-3">
            {t('note')}
          </p>

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
