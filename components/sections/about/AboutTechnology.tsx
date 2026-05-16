const SPECS = [
  ['Bloqueo UV', '99%'],
  ['Rechazo IR (línea KERAMX)', 'hasta 95%'],
  ['Grosor de lámina', '1.5 mil — 8 mil'],
  ['Garantía de color', 'Sin decoloración'],
  ['Adhesivo', 'Micro-canales'],
  ['Claridad óptica', '98%'],
]

const BARS = [
  { label: 'Rechazo solar total', value: '94%', width: 94 },
  { label: 'Bloqueo infrarrojo', value: '95%', width: 95 },
  { label: 'Bloqueo UV', value: '99%', width: 99 },
  { label: 'Claridad óptica', value: '98%', width: 98 },
  { label: 'Durabilidad', value: '10+ años', width: 85 },
]

export default function AboutTechnology() {
  return (
    <section
      className="bg-[var(--surface)] border-t border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-6">
          Tecnología de producto
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Specs */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="text-sm font-medium mb-5 text-[#0A0A0A]">Especificaciones base</div>
            <div className="flex flex-col divide-y divide-[#E4E4E2]">
              {SPECS.map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3">
                  <span className="text-xs text-[#5C5C5C]">{label}</span>
                  <span className="text-xs font-medium text-[#0A0A0A]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="text-sm font-medium mb-5 text-[#0A0A0A]">Performance por línea</div>
            <div className="flex flex-col gap-5">
              {BARS.map(({ label, value, width }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#5C5C5C]">{label}</span>
                    <span className="text-xs font-medium text-[#0A0A0A]">{value}</span>
                  </div>
                  <div className="h-[3px] bg-[#E4E4E2] rounded-full">
                    <div
                      className="h-full bg-[#0A0A0A] rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
