/**
 * SocialIcons — fila de iconos de redes con relleno "slide" en hover.
 *
 * Cada icono se dibuja dos veces, una sobre otra:
 *  1. Capa base: el glifo en un gris neutro (`currentColor`, hereda del contenedor).
 *  2. Capa de marca: el mismo glifo pintado con el color institucional de la red,
 *     dentro de un contenedor con `overflow-hidden` cuya altura (o ancho) pasa de
 *     0 a 100% en hover. Como el SVG interno está anclado al borde opuesto, no se
 *     deforma: el color "entra deslizándose" y rellena el vector.
 *
 * Es un componente sin estado ni efectos — el hover es 100% CSS, así que puede
 * usarse tanto en Server como en Client Components. Respeta `prefers-reduced-motion`.
 *
 * @example Uso por defecto (las 5 redes, orden LinkedIn · Email · Facebook · Instagram · WhatsApp)
 * ```tsx
 * <SocialIcons />
 * ```
 *
 * @example Barra superior: iconos chicos y email según idioma
 * ```tsx
 * <SocialIcons size={15} gap={10} href={{ email: 'mailto:hi@kristallfilms.com' }} />
 * ```
 *
 * @example Footer oscuro: base blanca translúcida, dos redes, entrada lateral
 * ```tsx
 * <SocialIcons
 *   networks={['instagram', 'whatsapp']}
 *   size={20}
 *   direction="right"
 *   className="text-white/40"
 * />
 * ```
 *
 * Los links por defecto viven en {@link SOCIAL_LINKS} y los colores en
 * {@link SOCIAL_BRAND_COLOR}: editalos ahí para cambiarlos en todo el sitio, o
 * pasá `href` / `color` para sobrescribirlos en un uso puntual.
 */

export type SocialNetwork = 'linkedin' | 'email' | 'facebook' | 'instagram' | 'whatsapp'

/** Orden por defecto de la fila. */
export const SOCIAL_NETWORKS: readonly SocialNetwork[] = [
  'linkedin',
  'email',
  'facebook',
  'instagram',
  'whatsapp',
] as const

/**
 * Destinos por defecto. `email` y `whatsapp` apuntan a los canales reales de la
 * marca; los perfiles sociales hay que confirmarlos antes de publicar.
 */
export const SOCIAL_LINKS: Record<SocialNetwork, string> = {
  linkedin: 'https://www.linkedin.com/company/kristallfilm',
  email: 'mailto:hola@kristallfilm.com',
  facebook: 'https://www.facebook.com/kristallfilm',
  instagram: 'https://www.instagram.com/kristallfilm',
  whatsapp: 'https://wa.me/5491160484312',
}

/**
 * Color institucional de cada red. `email` no es una marca de terceros: usa el
 * acento de Kristall (`--accent`, #0A0A0A). Instagram se pinta con su degradé
 * oficial, así que su valor acá funciona solo como fallback.
 */
export const SOCIAL_BRAND_COLOR: Record<SocialNetwork, string> = {
  linkedin: '#0A66C2',
  email: 'var(--accent)',
  facebook: '#1877F2',
  instagram: '#E4405F',
  whatsapp: '#25D366',
}

/** Etiquetas accesibles por defecto (nombres propios: no se traducen). */
const SOCIAL_LABEL: Record<SocialNetwork, string> = {
  linkedin: 'LinkedIn',
  email: 'Email',
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
}

/**
 * Glifos sólidos, viewBox 0 0 24 24. Se usa el mismo path en la capa base y en la
 * de marca — así el relleno calza al píxel.
 */
const SOCIAL_PATH: Record<SocialNetwork, string> = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  email:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram:
    'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.741 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.072 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.439.645 1.439 1.439z',
  whatsapp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
}

/**
 * Id fijo del degradé de Instagram. Si hay varias instancias de `SocialIcons` en
 * la misma página el id se repite, pero todas las defs son idénticas: el
 * navegador resuelve contra la primera y el resultado es el mismo.
 */
const INSTAGRAM_GRADIENT_ID = 'kristall-social-instagram-gradient'

/** Borde desde el que entra el color al hacer hover. */
export type SocialSlideDirection = 'up' | 'down' | 'left' | 'right'

/**
 * Clases del "obturador" por dirección. Van escritas completas (sin interpolar)
 * para que el escaneo estático de Tailwind las detecte.
 */
const SLIDE_CLASS: Record<SocialSlideDirection, { shutter: string; glyph: string }> = {
  up: {
    shutter:
      'absolute inset-x-0 bottom-0 h-0 overflow-hidden transition-[height] duration-300 ease-out group-hover/social:h-full group-focus-visible/social:h-full motion-reduce:transition-none',
    glyph: 'absolute bottom-0 left-0',
  },
  down: {
    shutter:
      'absolute inset-x-0 top-0 h-0 overflow-hidden transition-[height] duration-300 ease-out group-hover/social:h-full group-focus-visible/social:h-full motion-reduce:transition-none',
    glyph: 'absolute top-0 left-0',
  },
  left: {
    shutter:
      'absolute inset-y-0 right-0 w-0 overflow-hidden transition-[width] duration-300 ease-out group-hover/social:w-full group-focus-visible/social:w-full motion-reduce:transition-none',
    glyph: 'absolute top-0 right-0',
  },
  right: {
    shutter:
      'absolute inset-y-0 left-0 w-0 overflow-hidden transition-[width] duration-300 ease-out group-hover/social:w-full group-focus-visible/social:w-full motion-reduce:transition-none',
    glyph: 'absolute top-0 left-0',
  },
}

function Glyph({
  network,
  size,
  color,
}: {
  network: SocialNetwork
  size: number
  color: string
}) {
  // Solo Instagram lleva degradé, y solo si no le pisaron el color por prop.
  const useGradient = network === 'instagram' && color === SOCIAL_BRAND_COLOR.instagram
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={useGradient ? `url(#${INSTAGRAM_GRADIENT_ID})` : color}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      {useGradient && (
        <defs>
          <linearGradient id={INSTAGRAM_GRADIENT_ID} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#F09433" />
            <stop offset="25%" stopColor="#E6683C" />
            <stop offset="50%" stopColor="#DC2743" />
            <stop offset="75%" stopColor="#CC2366" />
            <stop offset="100%" stopColor="#BC1888" />
          </linearGradient>
        </defs>
      )}
      <path d={SOCIAL_PATH[network]} />
    </svg>
  )
}

export interface SocialIconsProps {
  /** Redes a mostrar, en orden. Default: {@link SOCIAL_NETWORKS}. */
  networks?: readonly SocialNetwork[]
  /** Lado del icono en px (cuadrado). Default 18. */
  size?: number
  /** Separación entre iconos en px. Default 12. */
  gap?: number
  /** Desde dónde entra el color en hover. Default `'up'`. */
  direction?: SocialSlideDirection
  /** Sobrescribe el destino de una o más redes (p. ej. el mail según idioma). */
  href?: Partial<Record<SocialNetwork, string>>
  /** Sobrescribe el `aria-label` de una o más redes. */
  label?: Partial<Record<SocialNetwork, string>>
  /** Sobrescribe el color institucional de una o más redes. */
  color?: Partial<Record<SocialNetwork, string>>
  /**
   * Clases del contenedor. El color base se hereda vía `currentColor`, así que
   * se controla con una clase de texto acá (default: `text-[var(--text-muted)]`).
   */
  className?: string
}

export default function SocialIcons({
  networks = SOCIAL_NETWORKS,
  size = 18,
  gap = 12,
  direction = 'up',
  href,
  label,
  color,
  className = 'text-[var(--text-muted)]',
}: SocialIconsProps) {
  const slide = SLIDE_CLASS[direction]

  return (
    <ul className={`flex items-center ${className}`} style={{ gap }}>
      {networks.map(network => {
        const url = href?.[network] ?? SOCIAL_LINKS[network]
        const isExternal = !url.startsWith('mailto:') && !url.startsWith('tel:')
        return (
          <li key={network} className="flex">
            <a
              href={url}
              aria-label={label?.[network] ?? SOCIAL_LABEL[network]}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group/social relative block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
              style={{ width: size, height: size }}
            >
              {/* Capa base: neutra, siempre visible */}
              <Glyph network={network} size={size} color="currentColor" />
              {/* Capa de marca: se revela deslizándose */}
              <span className={slide.shutter}>
                <span className={slide.glyph} style={{ width: size, height: size }}>
                  <Glyph
                    network={network}
                    size={size}
                    color={color?.[network] ?? SOCIAL_BRAND_COLOR[network]}
                  />
                </span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
