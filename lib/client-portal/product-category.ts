/**
 * El rubro de un producto, y cómo se escribe en pantalla.
 *
 * Vive en su propio archivo, separado de `client-portal/api.ts`, por una razón
 * concreta: `api.ts` llega —vía `crm/api.ts`— a `next/headers`, que solo existe
 * del lado del servidor. Un componente de cliente que importe un **valor** de
 * ahí arrastra todo ese módulo al bundle del navegador y el build falla.
 *
 * Con los tipos no pasa, porque TypeScript los borra al compilar. Con
 * `PRODUCT_CATEGORY_LABELS`, que es un objeto de verdad, sí.
 *
 * Es la clase de acoplamiento que no se ve leyendo el import: dice
 * `@/lib/client-portal/api` y parece inofensivo. Por eso las constantes que
 * necesitan las dos mitades viven acá, donde no hay nada del servidor que
 * arrastrar.
 */
export type ProductCategory = 'AUTOMOTIVE' | 'ARCHITECTURAL' | 'PPF'

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  AUTOMOTIVE: 'Automotriz',
  ARCHITECTURAL: 'Arquitectura',
  PPF: 'PPF',
}
