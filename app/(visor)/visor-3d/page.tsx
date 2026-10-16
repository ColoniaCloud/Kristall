import type { Metadata } from 'next'
import Visor3D from '@/components/visor-3d/Visor3D'

export const metadata: Metadata = {
  title: { absolute: 'Visor 3D — Kristall Film' },
}

export default function Visor3DPage() {
  return (
    <main className="h-dvh w-full bg-[radial-gradient(ellipse_at_center,#2a2a2a_0%,#0A0A0A_70%)]">
      <Visor3D src="/visor-3d/silla-mockup-v2.glb" alt="Silla — modelo 3D" />
    </main>
  )
}
