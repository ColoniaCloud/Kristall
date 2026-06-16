import { Link } from '@/i18n/routing'

export default function ConcesionariasCTA() {
  return (
    <section className="bg-[#0A0A0A] py-[72px] px-10">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Columna izquierda */}
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 mb-4 block">
            LO QUE PEDIMOS · EL PRÓXIMO PASO
          </span>
          <h2
            className="font-medium text-white mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            }}
          >
            Sumá Kristall a tu salón y empezá a capturar ese margen.
          </h2>
          <p className="text-[15px] text-white/50 leading-relaxed mb-8">
            Te equipamos el salón, capacitamos a tu equipo y coordinamos con tu instalador.
            Vos solo lo ofrecés en cada entrega.
          </p>
          <Link
            href="/contacto?canal=concesionarias"
            className="btn-primary inline-block text-white px-7 py-3.5 rounded-lg text-sm font-medium transition-all"
          >
            Coordinar una reunión
          </Link>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#E6A800] rounded-2xl p-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#0A0A0A]/60 mb-2 block">
              COORDINEMOS UNA REUNIÓN
            </span>
            <p
              className="text-2xl font-medium text-[#0A0A0A]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ventas@kristallfilm.com
            </p>
          </div>

          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/30 mb-2 block">
              CONOCÉ LA MARCA
            </span>
            <p
              className="text-2xl font-medium text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              kristallfilm.com
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
