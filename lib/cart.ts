import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  sku: string
  name: string
  category: string
  quantity: number
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(i => i.sku === item.sku)
        if (existing) {
          set({ items: get().items.map(i => i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] })
        }
        set({ isOpen: true })
      },
      removeItem: (sku) => set({ items: get().items.filter(i => i.sku !== sku) }),
      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter(i => i.sku !== sku) })
        } else {
          set({ items: get().items.map(i => i.sku === sku ? { ...i, quantity } : i) })
        }
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'kristall-cart' }
  )
)
