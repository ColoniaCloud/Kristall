/**
 * Bandera de Brasil. Mismo contrato que ArgentinaFlag/GermanyFlag/UKFlag: por defecto 20x14
 * y se achica pasando width/height (la barra superior la usa a 10x7).
 */
export default function BrazilFlag({ width = 20, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" fill="#009B3A" />
      <polygon points="10,1.8 18.2,7 10,12.2 1.8,7" fill="#FEDF00" />
      <circle cx="10" cy="7" r="3.2" fill="#002776" />
      <path d="M7 6.8 C8.5 6.2, 11.5 6.2, 13 6.8" stroke="#FFFFFF" strokeWidth="0.6" fill="none" />
    </svg>
  )
}
