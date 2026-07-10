'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function WarrantyLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/garantia/logout', { method: 'POST' })
    router.push('/garantia/acceder')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="mx-auto">
      Cerrar sesión
    </Button>
  )
}
