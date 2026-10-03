/**
 * Ancho de las secciones: columna de celular (576 px) hasta `lg`, y en PC un
 * contenedor de 1280 px donde cada sección arma su propia grilla. Es el ancho
 * que necesitan las 4 cards por fila de productos; el resto lo comparte para
 * que los bordes de todas las secciones coincidan.
 */
export const CONTENEDOR = 'mx-auto w-full max-w-xl px-5 lg:max-w-7xl lg:px-10'

/** Espaciado vertical de sección. */
export const SECCION = 'py-16 lg:py-24'

/** Título de sección (h2). */
export const TITULO = 'text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.01em] lg:text-[3.5rem]'
