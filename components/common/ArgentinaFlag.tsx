/**
 * Bandera de Argentina. Mismo contrato que GermanyFlag/UKFlag: por defecto 20x14
 * y se achica pasando width/height (la barra superior la usa a 10x7).
 * El Sol de Mayo se simplifica a un disco con rayos: a tamaños chicos se lee
 * como un punto cálido y no ensucia el vector.
 */
export default function ArgentinaFlag({ width = 20, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="4.67" fill="#74ACDF" />
      <rect y="4.67" width="20" height="4.66" fill="#FFFFFF" />
      <rect y="9.33" width="20" height="4.67" fill="#74ACDF" />
      <g stroke="#F6B40E" strokeWidth="0.4" strokeLinecap="round">
        <path d="M10 4.1v0.9M10 9v0.9M6.9 7h0.9M12.2 7h0.9" />
        <path d="M7.8 4.8l0.64 0.64M11.56 8.56l0.64 0.64M12.2 4.8l-0.64 0.64M8.44 8.56l-0.64 0.64" />
      </g>
      <circle cx="10" cy="7" r="1.55" fill="#F6B40E" stroke="#843511" strokeWidth="0.18" />
    </svg>
  )
}
