/**
 * Fuentes del sitio, autohospedadas con `next/font`.
 *
 * Antes las tres se declaraban en app/globals.css: DM Sans y Anybody con
 * `@import url('https://fonts.googleapis.com/...')` y Clash Display con un
 * `@font-face` que apuntaba a /fonts/. Eso serializaba el critical path en tres
 * niveles —el navegador bajaba nuestro CSS, ahí descubría el @import, bajaba la
 * hoja de Google, y ahí descubría los archivos de fuente—, así que el texto no
 * llegaba a su tipografía final hasta ~2.9 s (medido en producción).
 *
 * `next/font` las autohospeda bajo /_next/static/media, inyecta el @font-face en
 * el CSS crítico y emite el `<link rel="preload">` del archivo, con lo que los dos
 * saltos de descubrimiento desaparecen. De paso el sitio deja de pegarle a un
 * tercero para renderizar texto, y el CSP pudo perder fonts.googleapis.com y
 * fonts.gstatic.com (ver next.config.ts).
 *
 * Anybody no sobrevivió a la migración: estaba declarada como `--font-brand` y no
 * se usaba en ningún lado, así que era un @import bloqueante entero para una
 * fuente que nadie aplicaba.
 *
 * Las variables CSS que consume el resto del código (`--font-display`,
 * `--font-body`, con 80+ usos) no cambian de nombre: se redefinen en globals.css
 * apuntando a estas. Para que existan, `fontsClassName` tiene que estar en el
 * <html> de cada layout que renderiza uno — son cuatro: [locale], (client-portal),
 * (warranty) y el not-found raíz.
 */
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

/**
 * Variable font: se piden los ejes en vez de una lista de pesos, así viene un solo
 * archivo que cubre todo el rango. `opsz` es el eje de tamaño óptico que ya usaba
 * el @import anterior. Italic entra por `style` porque una variable font necesita
 * su archivo aparte para la cursiva.
 */
const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-dm-sans',
})

/**
 * El rango 200–700 es el mismo que declaraba el @font-face anterior, a propósito:
 * ampliarlo cambiaría cómo renderiza el texto que pide pesos fuera de rango (hay
 * un `font-black`, o sea 900, que hoy el navegador clampea a 700).
 */
const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  weight: '200 700',
  display: 'swap',
  variable: '--font-clash-display',
})

/** Clases que definen `--font-dm-sans` y `--font-clash-display`. Va en el <html>. */
export const fontsClassName = `${dmSans.variable} ${clashDisplay.variable}`
