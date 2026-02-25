import { defineStore } from 'pinia'
import { useProductStore } from '@/stores/products'

export interface CartItem {
  id: number
  name: string
  image_url: string
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

    updateQty(id: number, newQty: number){
        const productStore = useProductStore()
        const item = this.cart.find(i => i.id === id)
        const stock = productStore.getStock(id)

        if (!item) return

        if (isNaN(newQty) || newQty < 1) {
            newQty = 1
        }
 
        const currentQty = item.qty
        const diff = newQty - currentQty
        const maxQty = item.qty + stock

        if (newQty > maxQty) {
            newQty = maxQty
        }

        if (diff > 0) {
            productStore.decreaseStock(id, diff)
        } else if (diff < 0) {
            productStore.increaseStock(id, Math.abs(diff))
        }

        item.qty = newQty
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
