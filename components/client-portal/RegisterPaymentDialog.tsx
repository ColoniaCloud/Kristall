'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Paperclip, Wallet, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/format'
import type { PendingSale } from '@/lib/client-portal/api'

/**
 * "Ya pagué esto" — el cliente lo avisa, no lo confirma.
 *
 * A propósito NO toca el saldo al enviar: el CRM lo deja pendiente hasta que
 * alguien de Kristall lo revisa. El texto de éxito dice "lo vamos a confirmar",
 * nunca "listo" — para no dar la impresión de que la deuda ya bajó.
 *
 * `pendingSales` son ventas REGULAR con saldo, tengan o no un plan de cuotas
 * armado — antes esto solo aparecía si había un plan, y una venta de
 * mostrador que tarda en cobrarse (alguien que dice "te transfiero más
 * tarde") no tenía ningún camino de autoservicio para avisarlo.
 */

/** La próxima cuota si la venta tiene plan; si no, el saldo total. */
function montoSugerido(venta: PendingSale): string {
  return String(venta.plan?.nextDue?.remaining ?? venta.remaining)
}

const TIPOS_IMAGEN = ['image/png', 'image/jpeg', 'image/webp']
const MAX_IMAGEN_BYTES = 8 * 1024 * 1024
const MAX_PDF_BYTES = 4 * 1024 * 1024
const LADO_MAX = 1600

/** Recomprime una foto en el navegador (como el logo del taller, pero con más lado: acá tiene que leerse un número de comprobante). */
async function achicarImagen(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * escala)
  const h = Math.round(bitmap.height * escala)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function leerComoDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Un PDF no se puede achicar como una foto: solo se topea el tamaño. */
async function comprobanteABase64(file: File): Promise<{ data: string; mime: string }> {
  if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF_BYTES) throw new Error('El PDF no puede pesar más de 4 MB')
    const dataUri = await leerComoDataUri(file)
    return { data: dataUri.split(',')[1] ?? '', mime: 'application/pdf' }
  }
  if (!TIPOS_IMAGEN.includes(file.type)) {
    throw new Error('Tiene que ser una foto (PNG, JPG o WEBP) o un PDF')
  }
  if (file.size > MAX_IMAGEN_BYTES) throw new Error('La imagen no puede pesar más de 8 MB')
  const dataUri = await achicarImagen(file)
  return { data: dataUri.split(',')[1] ?? '', mime: 'image/jpeg' }
}

const METODOS = [
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'OTHER', label: 'Otro' },
] as const

export default function RegisterPaymentDialog({
  pendingSales,
  trigger,
  ventaInicial,
}: {
  pendingSales: PendingSale[]
  /**
   * El botón que lo abre. Por defecto el grande de la cabecera; las otras
   * entradas —el aviso de vencidas, cada cuota impaga, la barra del celular—
   * pasan el suyo para que cada una pese lo que tiene que pesar en su lugar.
   */
  trigger?: React.ReactNode
  /**
   * Qué compra viene elegida al abrir. La entrada que nace al lado de una
   * cuota sabe de cuál se trata; obligar a buscarla de nuevo en el select
   * sería pedirle a la persona que repita algo que ya dijo con el clic.
   */
  ventaInicial?: string
}) {
  const router = useRouter()
  const inputFile = useRef<HTMLInputElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [procesandoArchivo, setProcesandoArchivo] = useState(false)
  const porDefecto =
    pendingSales.find((v) => v.saleId === ventaInicial) ?? pendingSales[0]
  const [saleId, setSaleId] = useState(porDefecto?.saleId ?? '')
  const [amount, setAmount] = useState(() => (porDefecto ? montoSugerido(porDefecto) : ''))
  const [method, setMethod] = useState<string>('TRANSFER')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [comprobante, setComprobante] = useState<{ nombre: string; data: string; mime: string } | null>(null)

  if (pendingSales.length === 0) return null

  const ventaSeleccionada = pendingSales.find((v) => v.saleId === saleId) ?? pendingSales[0]

  function elegirVenta(id: string) {
    setSaleId(id)
    const venta = pendingSales.find((v) => v.saleId === id)
    if (venta) setAmount(montoSugerido(venta))
  }

  async function elegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setProcesandoArchivo(true)
    try {
      const { data, mime } = await comprobanteABase64(file)
      setComprobante({ nombre: file.name, data, mime })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No pudimos procesar ese archivo')
    } finally {
      setProcesandoArchivo(false)
    }
  }

  function reset() {
    setSaleId(porDefecto?.saleId ?? '')
    setAmount(porDefecto ? montoSugerido(porDefecto) : '')
    setMethod('TRANSFER')
    setReference('')
    setNotes('')
    setComprobante(null)
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const monto = Number(amount)
    if (!Number.isFinite(monto) || monto <= 0) {
      toast.error('Poné un monto mayor a cero')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch('/api/portal/payment-declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saleId,
          amount: monto,
          method,
          reference: reference.trim() || undefined,
          notes: notes.trim() || undefined,
          receipt: comprobante?.data,
          receiptMimeType: comprobante?.mime,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos declarar el pago')
        return
      }
      toast.success('Pago declarado. Lo vamos a confirmar en breve.')
      setAbierto(false)
      reset()
      router.refresh()
    } catch {
      toast.error('Sin conexión. Probá de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog
      open={abierto}
      onOpenChange={(open) => {
        setAbierto(open)
        if (!open) reset()
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="h-11 gap-2 px-5 text-base font-semibold">
            <Wallet className="size-5" />
            Registrar un pago
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="crm-theme">
        <DialogHeader>
          <DialogTitle>Registrar un pago</DialogTitle>
          <DialogDescription>
            Contanos que ya pagaste. Lo vamos a revisar y confirmar — todavía no descuenta de tu
            saldo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={enviar} className="flex flex-col gap-4">
          {pendingSales.length > 1 ? (
            <div className="flex flex-col gap-1.5">
              <Label>Compra</Label>
              <Select value={saleId} onValueChange={elegirVenta}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pendingSales.map((v) => (
                    <SelectItem key={v.saleId} value={v.saleId}>
                      Compra #{v.saleNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Compra #{ventaSeleccionada.saleNumber}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monto-declarado">Monto</Label>
            <Input
              id="monto-declarado"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
            {ventaSeleccionada.plan?.nextDue ? (
              <p className="text-xs text-muted-foreground">
                Próxima cuota: {formatCurrency(ventaSeleccionada.plan.nextDue.remaining)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Saldo total: {formatCurrency(ventaSeleccionada.remaining)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Método</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METODOS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="referencia-pago">Referencia (opcional)</Label>
            <Input
              id="referencia-pago"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Últimos dígitos, número de operación…"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notas-pago">Notas (opcional)</Label>
            <Textarea
              id="notas-pago"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Comprobante (opcional)</Label>
            <input
              ref={inputFile}
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              className="hidden"
              onChange={elegirArchivo}
            />
            {comprobante ? (
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{comprobante.nombre}</span>
                <button
                  type="button"
                  onClick={() => setComprobante(null)}
                  className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Quitar comprobante"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={procesandoArchivo}
                onClick={() => inputFile.current?.click()}
                className="self-start"
              >
                {procesandoArchivo ? <Loader2 className="size-4 animate-spin" /> : <Paperclip className="size-4" />}
                Adjuntar foto o PDF
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando || procesandoArchivo}>
              {enviando && <Loader2 className="size-4 animate-spin" />}
              Declarar pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
