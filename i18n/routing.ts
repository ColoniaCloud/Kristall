import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['es', 'en', 'de', 'pt'],
  defaultLocale: 'es'
})

/**
 * Tipo único de locale, derivado del routing. Antes cada componente repetía el
 * union a mano ('es' | 'en' | 'de') y por eso `pt` quedó afuera del selector del
 * menú mobile, del footer y del blog sin que nada lo marcara.
 */
export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
