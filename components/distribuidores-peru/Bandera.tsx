import type { Pais } from '@/components/distribuidores-peru/paises'

/**
 * Banderita para la píldora del encabezado (18 × 12). Dibujadas a mano y
 * simplificadas: a este tamaño el sol es un punto dorado, no el escudo.
 * La versión sin país no tiene bandera.
 */
export default function Bandera({ pais }: { pais: Exclude<Pais, 'OTHER'> }) {
  return (
    <svg
      viewBox="0 0 18 12"
      className="h-3 w-[18px] shrink-0 rounded-[2px]"
      aria-hidden="true"
      focusable="false"
    >
      {pais === 'PE' && (
        <>
          <rect width="18" height="12" fill="#ffffff" />
          <rect width="6" height="12" fill="#D91023" />
          <rect x="12" width="6" height="12" fill="#D91023" />
        </>
      )}
      {pais === 'AR' && (
        <>
          <rect width="18" height="12" fill="#74ACDF" />
          <rect y="4" width="18" height="4" fill="#ffffff" />
          <circle cx="9" cy="6" r="1.35" fill="#F6B40E" />
        </>
      )}
      {pais === 'UY' && (
        <>
          <rect width="18" height="12" fill="#ffffff" />
          {/* Nueve franjas: cinco blancas y cuatro azules. */}
          {[1, 3, 5, 7].map((i) => (
            <rect key={i} y={(12 / 9) * i} width="18" height={12 / 9} fill="#0038A8" />
          ))}
          {/* El cantón blanco con el sol ocupa las cinco primeras franjas. */}
          <rect width="6.67" height="6.67" fill="#ffffff" />
          <circle cx="3.33" cy="3.33" r="1.7" fill="#FCD116" />
        </>
      )}
    </svg>
  )
}
