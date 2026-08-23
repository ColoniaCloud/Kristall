/**
 * Carrito de cotización — no es un carrito de compra: no hay checkout ni
 * precios, solo junta productos para pedir una cotización en /carrito.
 * Persiste en localStorage (zustand/persist) para sobrevivir a la navegación
 * entre páginas.
 *
 * `skipHydration: true` + el `rehydrate()` manual en Header.tsx evitan el
 * mismatch de hidratación de Next: el server siempre renderiza el carrito
 * vacío (no tiene localStorage), así que hidratamos recién después del mount.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  codigo: string
  nombre: string
  lineaSlug: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (codigo: string) => void
  updateQuantity: (codigo: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.codigo === item.codigo)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.codigo === item.codigo ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity }] })
        }
        set({ isOpen: true })
      },
      removeItem: (codigo) => set({ items: get().items.filter((i) => i.codigo !== codigo) }),
      updateQuantity: (codigo, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.codigo !== codigo) })
        } else {
          set({ items: get().items.map((i) => (i.codigo === codigo ? { ...i, quantity } : i)) })
        }
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'kristall-cart', skipHydration: true },
  ),
)
