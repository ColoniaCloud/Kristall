'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Contenedor que marca `.is-in` cuando entra en pantalla, una sola vez. Los
 * hijos con `.kp-item` y `style={paso(n)}` entran escalonados (peru.css).
 */
export default function Aparece({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${visible ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  )
}
