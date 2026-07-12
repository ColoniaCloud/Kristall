'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const schema = z.object({
  to: z.string().email('Ingresá un email válido'),
  recipientName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function SendWarrantyEmailDialog({
  open,
  onOpenChange,
  installationCode,
  productName,
  activationToken,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  installationCode: string
  productName: string
  activationToken: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/portal/installations/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.to,
          recipientName: data.recipientName,
          installationCode,
          productName,
          activationToken,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'Error al enviar el email')
        setStatus('error')
        return
      }
      toast.success('Email enviado')
      setStatus('idle')
      onOpenChange(false)
      reset()
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="crm-theme">
        <DialogHeader>
          <DialogTitle>Enviar garantía por mail</DialogTitle>
          <DialogDescription>
            Le enviamos al cliente su clave de garantía ({installationCode}) y el link para activarla o
            consultarla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to">Email del cliente</Label>
            <Input id="to" type="email" {...register('to')} placeholder="cliente@email.com" />
            {errors.to && <span className="text-sm text-destructive">{errors.to.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipientName">Nombre (opcional)</Label>
            <Input id="recipientName" {...register('recipientName')} />
          </div>

          {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

          <Button type="submit" disabled={status === 'loading'} className="w-fit">
            {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Enviar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
