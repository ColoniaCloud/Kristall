import Link from 'next/link'
import { Mail } from 'lucide-react'
import { FlagStripe } from './Hero'
import Reveal from './Reveal'
import { MENSAJE_GENERAL, WhatsAppIcon, WhatsAppLink } from './whatsapp'

export default function Cierre({ vigente, hasta }: { vigente: boolean; hasta: string }) {
  return (
    <section data-sin-barra className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0A0A0A] via-[#160606] to-[#0A0A0A] px-5 pb-[max(3rem,env(safe-area-inset-bottom))] pt-16">
      <Reveal className="mx-auto max-w-xl">
        <FlagStripe />
        <h2
          className="mt-5 text-[clamp(2.2rem,9vw,3.4rem)] font-semibold leading-[1] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Sumá Kristall a tu taller.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/65">
          {vigente
            ? `Los precios de lanzamiento valen hasta el ${hasta}. Escribinos y te armamos el primer pedido.`
            : 'Escribinos y te pasamos la lista de precios vigente.'}
        </p>
        <WhatsAppLink
          mensaje={MENSAJE_GENERAL}
          donde="cierre"
          className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-base font-semibold text-[#0A0A0A] transition active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-5" />
          Escribir por WhatsApp
        </WhatsAppLink>
        <a
          href="mailto:contacto@kristallfilm.com"
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 text-[15px] text-white/80"
        >
          <Mail className="size-4" aria-hidden="true" />
          contacto@kristallfilm.com
        </a>

        <div className="mt-14 flex items-center justify-between text-xs text-white/35">
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
