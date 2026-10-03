import Link from 'next/link'
import { Mail } from 'lucide-react'
import Cuenta from './Cuenta'
import { FlagStripe } from './Hero'
import { CONTENEDOR } from './layout'
import Reveal from './Reveal'
import { MENSAJE_GENERAL, WhatsAppIcon, WhatsAppLink } from './whatsapp'

export default function Cierre({
  vigente,
  hasta,
  hastaMs,
  ahoraMs,
}: {
  vigente: boolean
  hasta: string
  hastaMs: number
  ahoraMs: number
}) {
  return (
    <section
      data-sin-barra
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0A0A0A] via-[#160606] to-[#0A0A0A] pb-[max(3rem,env(safe-area-inset-bottom))] pt-16 lg:pt-24"
    >
      <Reveal className={CONTENEDOR}>
        {/* PC: el llamado a la izquierda; contador y botones a la derecha. */}
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <FlagStripe />
            <h2
              className="mt-5 text-[clamp(2.2rem,9vw,3.4rem)] font-semibold leading-[1] tracking-[-0.01em] lg:text-[4.5rem]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sumá Kristall a tu taller.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65 lg:text-lg">
              {vigente
                ? `Los precios de lanzamiento valen hasta el ${hasta}. Escribinos y te armamos el primer pedido.`
                : 'Escribinos y te pasamos la lista de precios vigente.'}
            </p>
          </div>

          <div>
            {vigente && (
              <div className="mt-6 lg:mt-0">
                <Cuenta hasta={hastaMs} ahora={ahoraMs} />
              </div>
            )}
            <WhatsAppLink
              mensaje={MENSAJE_GENERAL}
              donde="cierre"
              className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-base font-semibold text-[#0A0A0A] transition hover:bg-[#2fe072] active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5" />
              Escribir por WhatsApp
            </WhatsAppLink>
            <a
              href="mailto:contacto@kristallfilm.com"
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-[15px] text-white/80 transition hover:border-white/30 hover:text-white"
            >
              <Mail className="size-4" aria-hidden="true" />
              contacto@kristallfilm.com
            </a>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between text-xs text-white/50 lg:mt-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cat/logob.svg" alt="Kristall Film" width={96} height={22} className="h-5 w-auto opacity-60" />
          <Link href="/es" className="underline-offset-4 hover:underline">
            kristallfilm.com
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
