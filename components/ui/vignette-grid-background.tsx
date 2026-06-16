import { cn } from '@/lib/utils'

interface GridVignetteBackgroundProps {
  size?: number
  x?: number
  y?: number
  horizontalVignetteSize?: number
  verticalVignetteSize?: number
  intensity?: number
  gridColor?: string
}

export function GridVignetteBackground({
  className,
  size = 48,
  x = 50,
  y = 50,
  horizontalVignetteSize = 100,
  verticalVignetteSize = 100,
  intensity = 0,
  gridColor = 'rgba(255,255,255,0.12)',
}: React.ComponentProps<'div'> & GridVignetteBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${
          100 - intensity
        }%, transparent 100%)`,
      }}
    />
  )
}
