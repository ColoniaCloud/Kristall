/**
 * Lo que se ve donde iría una lista que todavía no tiene nada.
 *
 * Va dentro del mismo panel que la lista llena, y no como un renglón de texto
 * gris suelto: desde que las tablas del portal viven en una superficie con
 * borde, un mensaje flotando al lado de ellas se lee como algo que no terminó
 * de cargar.
 *
 * Por ahora solo dice qué falta. El paso siguiente —darle a cada una la acción
 * que corresponde, porque una pantalla vacía es el mejor momento para decir
 * cuál es el próximo movimiento— es un cambio de producto, no de estructura.
 */
export default function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  )
}
