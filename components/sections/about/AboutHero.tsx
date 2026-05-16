import Image from 'next/image'

export default function AboutHero() {
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
        className="absolute inset-0 object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-[#1A1A1A]/75" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1">
            <span className="w-4 h-[3px] rounded-sm bg-[#444]" />
            <span className="w-4 h-[3px] rounded-sm bg-[#CC0000]" />
            <span className="w-4 h-[3px] rounded-sm bg-[#E6A800]" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35">
            Nuestra historia
          </span>
        </div>

        <h1
          className="text-white leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            fontWeight: 500,
          }}
        >
          Ingeniería <span className="text-white/30">alemana,</span>
          <br />
          alcance global.
        </h1>

        <p className="text-sm text-white/45 max-w-[440px] leading-relaxed">
          Kristall Film es el resultado de décadas de investigación en materiales ópticos de
          precisión, aplicados hoy en la industria automotriz y arquitectónica de todo el mundo.
        </p>
      </div>

      <div
        className="absolute bottom-4 right-0 font-bold text-white/[0.03] select-none pointer-events-none leading-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '90px',
        }}
      >
        PRÄZISION
      </div>
    </section>
  )
}
