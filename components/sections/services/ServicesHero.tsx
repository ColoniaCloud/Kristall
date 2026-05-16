import Image from 'next/image'
import GermanyFlag from '@/components/common/GermanyFlag'

export default function ServicesHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#1A1A1A]"
      style={{ padding: '72px 40px 64px' }}
    >
      <Image
        src="/porsche.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2.5">
          <GermanyFlag />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/50">
            Servicios profesionales
          </span>
        </div>

        <h1
          className="font-[var(--font-display)] text-white max-w-[500px] mt-4 mb-4 leading-[1.1]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
          }}
        >
          Soluciones para la industria automotriz
        </h1>

        <p className="text-sm text-white/55 max-w-[420px] leading-relaxed">
          Desde la instalación profesional en concesionarias hasta el software de gestión
          operativa. Kristall Film acompaña todo el proceso.
        </p>

        <div className="flex gap-3 mt-8">
          <div className="bg-white/6 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <div
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              48hs
            </div>
            <div className="text-[11px] text-white/45 mt-1">
              Tiempo de respuesta promedio
            </div>
          </div>
          <div className="bg-white/6 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <div
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              100%
            </div>
            <div className="text-[11px] text-white/45 mt-1">
              Garantía de instalación
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
