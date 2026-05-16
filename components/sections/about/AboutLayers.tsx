import { useTranslations } from 'next-intl'

const LAYERS = [
  {
    bg: 'bg-[#EBEBEA]',
    text: 'text-[#444]',
    name: 'Hard coat exterior',
    func: 'Resistencia a rayones',
  },
  {
    bg: 'bg-[#DCDCDA]',
    text: 'text-[#333]',
    name: 'Capa de color / metalizada',
    func: 'Control de transmisión',
  },
  {
    bg: 'bg-[#C8C8C6]',
    text: 'text-[#222]',
    name: 'Filtro IR / UV',
    func: 'Bloqueo espectral selectivo',
  },
  {
    bg: 'bg-[#ADADAB]',
    text: 'text-[#111]',
    name: 'Polyester base',
    func: 'Soporte estructural',
  },
  {
    bg: 'bg-[#888886]',
    text: 'text-white',
    name: 'Adhesivo micro-canales',
    func: 'Instalación sin burbujas',
  },
  {
    bg: 'bg-[#5C5C5A]',
    text: 'text-white',
    name: 'Liner de protección',
    func: 'Se retira en instalación',
  },
]

export default function AboutLayers() {
  const t = useTranslations('about')
  return (
    <section className="bg-[var(--surface)]" style={{ padding: '0 40px 64px' }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
          <div className="text-sm font-medium mb-5 text-[#0A0A0A]">
            {t('layers_title')}
          </div>
          <div className="flex flex-col gap-1.5">
            {LAYERS.map((l) => (
              <div
                key={l.name}
                className={`${l.bg} ${l.text} rounded-lg px-4 py-3 flex justify-between items-center`}
              >
                <span className="text-xs font-medium">{l.name}</span>
                <span className="text-[11px] opacity-60">{l.func}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
