const ITEMS = [
  {
    year: '1987',
    title: 'Origen en investigación óptica',
    desc: 'La tecnología de base nació en laboratorios de óptica de precisión en Alemania, orientada al control solar en vidriados industriales de alta exigencia.',
  },
  {
    year: '1999',
    title: 'Expansión al segmento vehicular',
    desc: 'La formulación multicapa se adapta para aplicaciones automotrices, alcanzando niveles de rechazo infrarrojo sin precedentes en láminas delgadas.',
  },
  {
    year: '2008',
    title: 'Certificación ISO y expansión global',
    desc: 'Obtención de certificaciones internacionales de calidad y primera expansión hacia mercados de América Latina y Asia Pacífico.',
  },
  {
    year: '2019',
    title: 'Línea PPF y tecnología self-healing',
    desc: 'Lanzamiento de la línea de Paint Protection Film con polímero de recuperación térmica, extendiendo la marca al segmento de protección de pintura premium.',
  },
  {
    year: '2024',
    title: 'Kristall Film en Argentina',
    desc: 'Dr Polarizados incorpora Kristall Film como marca premium de distribución regional, trayendo la tecnología alemana al mercado argentino y latinoamericano.',
  },
]

export default function AboutTimeline() {
  return (
    <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-8">
          Historia de la marca
        </div>

        <div className="flex flex-col gap-0">
          {ITEMS.map((item, idx) => {
            const isLast = idx === ITEMS.length - 1
            return (
              <div
                key={item.year}
                className="grid grid-cols-[72px_1px_1fr] gap-x-4 pb-7 last:pb-0"
              >
                <span className="text-[13px] font-medium text-[#9A9A9A] text-right pt-0.5 tracking-wide">
                  {item.year}
                </span>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0A0A0A] border border-[#C8C8C4] flex-shrink-0 mt-1" />
                  {!isLast && <div className="flex-1 w-px bg-[#E4E4E2] mt-1" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0A0A0A] mb-1">{item.title}</div>
                  <div className="text-xs text-[#5C5C5C] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
