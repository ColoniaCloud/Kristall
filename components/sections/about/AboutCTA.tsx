import { Link } from '@/i18n/routing'

export default function AboutCTA() {
  return (
    <section style={{ margin: '0 40px 40px' }}>
      <div
        className="max-w-[1160px] mx-auto bg-[#1A1A1A] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
        style={{ padding: '40px' }}
      >
        <div>
          <h3
            className="text-white mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
          >
            ¿Querés trabajar con Kristall Film?
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Sumá tecnología alemana a tu negocio. Contactá al equipo y recibí una propuesta en 24
            hs.
          </p>
        </div>
        <Link
          href="/contacto"
          className="bg-white text-[#0A0A0A] px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/90 transition-opacity whitespace-nowrap"
        >
          Contactar →
        </Link>
      </div>
    </section>
  )
}
