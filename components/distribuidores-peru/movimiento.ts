/**
 * Ayudas de estilo para las animaciones de peru.css. Viven fuera de Aparece.tsx
 * porque ese archivo es 'use client' y la página (servidor) no puede llamar
 * funciones de un módulo de cliente.
 */

/** Demora escalonada de un `.kp-item`: `style={paso(2)}` entra 200 ms después del primero. */
export function paso(i: number): React.CSSProperties {
  return { '--i': i } as React.CSSProperties
}

/** Demora de una entrada al cargar (`.kp-in`, `.kp-regla`), en milisegundos. */
export function demora(ms: number): React.CSSProperties {
  return { '--d': `${ms}ms` } as React.CSSProperties
}
