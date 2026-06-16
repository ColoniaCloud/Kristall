import Image from 'next/image'

export default function PuntoHero() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden">
      <Image
        src="/porsche.png"
        alt="Punto Kristall"
        fill
        className="object-cover opacity-20"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      <div className="relative z-10 max-w-[1160px] mx-auto px-10 pt-20 pb-[72px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-[14px] w-6 overflow-hidden rounded-sm flex-shrink-0">
            <div className="flex-1 bg-[#1A1A1A]" />
            <div className="flex-1 bg-[#CC0000]" />
            <div className="flex-1 bg-[#E6A800]" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800]">
            Programa para instaladores
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold text-white leading-tight mb-2"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontFamily: 'var(--font-display)' }}
        >
          Suma tu taller como
          <span className="block text-[#CC0000]">Punto Kristall</span>
        </h1>

        {/* Body */}
        <p className="text-lg text-white max-w-[480px] leading-relaxed mb-10">
          Cuatro frentes que trabajan para tu taller: te traemos los clientes, te damos las
          herramientas para cerrar, te ponemos en escena y te respaldamos para crecer.
        </p>

      </div>
    </section>
  )
}
