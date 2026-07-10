'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  token: string
  onSkip?: () => void
}

export default function SetPasswordForm({ token, onSkip }: Props) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/garantia/${token}/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'Error al guardar la contraseña')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm font-medium text-emerald-700">
        Listo. Ya podés entrar con tu código y esta contraseña desde{' '}
        <Link href="/garantia/acceder" className="underline">
          /garantia/acceder
        </Link>
        .
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="password"
        placeholder="Elegí una contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={status === 'loading'} size="sm">
          {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Guardar'}
        </Button>
        {onSkip && (
          <Button type="button" variant="ghost" size="sm" onClick={onSkip}>
            Ahora no
          </Button>
        )}
      </div>
    </form>
  )
}
