import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size, color) => {
        const items = get().items
        const key = `${product.id}-${size}-${color}`
        const existing = items.find((i) => i.key === key)

        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, key, quantity, size, color }] })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity < 1) return get().removeItem(key)
        set({ items: get().items.map((i) => (i.key === key ? { ...i, quantity } : i)) })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.precio * i.quantity, 0)
      },
      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'moda-peru-cart' }
  )
)

export default useCartStore
