/**
 * El simulador y el recomendador llevan al carrusel con la lámina (y el VLT)
 * ya elegidos. Van por un evento del DOM y no por contexto de React porque son
 * secciones hermanas que la página arma desde el servidor.
 */
export const EVENTO_IR_A_LINEA = 'catalogo:ir-a-linea'

export type IrALinea = { slug: string; sku?: string }

export function irALinea(detalle: IrALinea) {
  window.dispatchEvent(new CustomEvent<IrALinea>(EVENTO_IR_A_LINEA, { detail: detalle }))
}
