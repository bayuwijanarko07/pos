import { defineStore } from 'pinia'

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
        cart: [] as CartItem []
    }),

    getters: {
        totalPrice: (state) =>
         state.cart.reduce((total, item) => {
            return total + item.price * item.qty
        }, 0),

        totalItems: (state) =>
        state.cart.reduce((total, item) => total + item.qty, 0)
    },

    actions: {
        addToCart(menu: Omit<CartItem, 'qty'>) {
            const existing = this.cart.find(item => item.id === menu.id)

            if (existing) {
                existing.qty += 1
            } else {
                this.cart.push({
                    ...menu,
                    qty: 1
                })
            }
        },
    },
    persist: true,
})