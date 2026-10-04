import { ChevronDown } from 'lucide-react'
import HeroVideo from './HeroVideo'
import Rotador from './Rotador'
import { CONTENEDOR } from './layout'
import { MENSAJE_GENERAL, WhatsAppIcon, WhatsAppLink } from './whatsapp'

export function FlagStripe({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex h-3 w-6 overflow-hidden rounded-[2px] shrink-0 ${className}`} aria-hidden="true">
      <span className="flex-1 bg-[#1A1A1A] ring-1 ring-inset ring-white/15" />
      <span className="flex-1 bg-[#CC0000]" />
      <span className="flex-1 bg-[#E6A800]" />
    </span>
  )
}

/**
 * Primera pantalla. Alto en `svh` y no `vh`: dentro del navegador de Instagram
 * la barra inferior tapa el contenido anclado abajo si se usa `100vh`.
 */
export default function Hero({ dias, vigente }: { dias: number; vigente: boolean }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <HeroVideo />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/35 to-[#0A0A0A]" />
      {/* En PC el texto va a la izquierda sobre un video apaisado: un velo lateral lo mantiene legible. */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/75 via-black/30 to-transparent lg:block" />

      <header className={`${CONTENEDOR} flex items-center justify-between pt-[max(1.25rem,env(safe-area-inset-top))] lg:pt-8`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG chico, no gana nada con el optimizador */}
        <img src="/cat/logob.svg" alt="Kristall Film" width={112} height={26} className="h-6 w-auto lg:h-7" />
        <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur">
          Para talleres
        </span>
      </header>

      <div className={`${CONTENEDOR} mt-auto pb-10 lg:pb-16`}>
        <p className="kf-rise mb-5 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#E6A800]">
          <FlagStripe />
          Lanzamiento · Línea Automotriz
        </p>

        <h1
          className="kf-rise-solid max-w-4xl text-[clamp(2.6rem,11vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.01em] lg:text-[6rem]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          8 láminas.
          <span className="block text-white/55">Un sistema para tu taller.</span>
        </h1>

        <p className="kf-rise-solid mt-5 max-w-md text-base leading-relaxed text-white/75 lg:mt-7 lg:max-w-xl lg:text-xl">
          Tecnología alemana a precio de lanzamiento, garantía digital en cada instalación y un portal para
          gestionar tu negocio desde el celular.
        </p>

        <p className="kf-rise mt-6 inline-flex items-center gap-2 rounded-full border border-[#CC0000]/50 bg-[#CC0000]/15 px-3.5 py-1.5 text-sm text-white [animation-delay:360ms]">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff3b3b] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-[#ff3b3b]" />
          </span>
          <Rotador
            textos={[
              // Pasado el 1/12 se cae el del precio y quedan los otros tres.
              ...(vigente
                ? [dias > 1 ? `Precio de lanzamiento · quedan ${dias} días` : 'Precio de lanzamiento · último día']
                : []),
              'Llegamos a toda la Argentina',
              'Sistema digital para instaladores',
              'Tu propia web de turnos',
            ]}
          />
        </p>

        <div className="kf-rise mt-8 flex flex-col gap-3 sm:flex-row lg:max-w-xl [animation-delay:480ms]">
          <a
            href="#productos"
            className="inline-flex h-14 sm:flex-1 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-[#0A0A0A] transition hover:bg-white/90 active:scale-[0.98]"
          >
            Ver los productos
          </a>
          <WhatsAppLink
            mensaje={MENSAJE_GENERAL}
            donde="hero"
            className="inline-flex h-14 sm:flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-base font-medium text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            Hablar con un asesor
          </WhatsAppLink>
        </div>

        <a href="#productos" aria-label="Bajar a los productos" className="mx-auto mt-8 flex w-fit text-white/55 lg:mx-0">
          <ChevronDown className="size-6 animate-bounce motion-reduce:animate-none" />
        </a>
      </div>
    </section>
  )
}
