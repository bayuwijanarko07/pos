import { defineStore } from 'pinia'
import { useProductStore } from '@/stores/products'

export interface CartItem {
  id: number
  title: string
  img: string
  price: number
  category: string
  qty: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as CartItem[]
  }),

  getters: {
    totalPrice: (state) =>
      state.cart.reduce((total, item) => total + item.price * item.qty, 0),

    totalItems: (state) =>
      state.cart.reduce((total, item) => total + item.qty, 0)
  },

  actions: {
    addToCart(product: Omit<CartItem, 'qty'>) {
      const productStore = useProductStore()
      const stock = productStore.getStock(product.id)

      if (stock <= 0) return

      const existing = this.cart.find(item => item.id === product.id)

      if (existing) {
        existing.qty += 1
      } else {
        this.cart.push({
          ...product,
          qty: 1
        })
      }

      productStore.decreaseStock(product.id, 1)
    },

    increaseQty(id: number) {
      const productStore = useProductStore()
      const stock = productStore.getStock(id)

      if (stock <= 0) return

      const item = this.cart.find(i => i.id === id)
      if (!item) return

      item.qty += 1
      productStore.decreaseStock(id, 1)
    },

    decreaseQty(id: number) {
      const productStore = useProductStore()
      const item = this.cart.find(i => i.id === id)
      if (!item) return

      item.qty -= 1
      productStore.increaseStock(id, 1)

      if (item.qty <= 0) {
        this.removeFromCart(id)
      }
    },

    removeFromCart(id: number) {
      const productStore = useProductStore()
      const item = this.cart.find(i => i.id === id)
      if (!item) return

      productStore.increaseStock(id, item.qty)

      this.cart = this.cart.filter(i => i.id !== id)
    },

    clearCart() {
      const productStore = useProductStore()

      this.cart.forEach(item => {
        productStore.increaseStock(item.id, item.qty)
      })

      this.cart = []
    }
  },

  persist: true
})
