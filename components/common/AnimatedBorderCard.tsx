'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBorderCardProps {
  children: React.ReactNode
  className?: string
  borderRadius?: number
}

export default function AnimatedBorderCard({
  children,
  className,
  borderRadius = 12,
}: AnimatedBorderCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [perimeter, setPerimeter] = useState(9999)

  useEffect(() => {
    if (!containerRef.current) return

    const calculate = () => {
      if (!containerRef.current) return
      const { offsetWidth: w, offsetHeight: h } = containerRef.current
      const r = borderRadius
      const straight = 2 * (w - 2 * r) + 2 * (h - 2 * r)
      const curves = 2 * Math.PI * r
      setPerimeter(Math.round(straight + curves))
    }

    calculate()

    const observer = new ResizeObserver(calculate)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [borderRadius])

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={borderRadius - 1}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="1"
          strokeDasharray={perimeter}
          strokeDashoffset={hovered ? 0 : perimeter}
          style={{
            transition: hovered
              ? 'stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'stroke-dashoffset 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {children}
    </div>
  )
}
