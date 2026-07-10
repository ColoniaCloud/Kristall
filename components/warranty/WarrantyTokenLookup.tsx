'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function extractToken(value: string): string {
  const trimmed = value.trim()
  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('garantia')
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
  } catch {
    // no era una URL completa (ej. pegaron solo el token) — seguimos con el valor tal cual
  }
  return trimmed
}

export default function WarrantyTokenLookup() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const token = extractToken(value)
    if (!token) {
      setError('Pegá el link o el código que te dieron')
      return
    }
    router.push(`/garantia/${token}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        placeholder="https://kristallfilm.com/garantia/... o tu código"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-fit">
        Continuar
      </Button>
    </form>
  )
}
