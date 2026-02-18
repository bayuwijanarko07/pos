import { defineStore } from 'pinia'

export interface Product {
  id: number
  title: string
  img: string
  price: number
  category: string
  stock: number
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[]
    }),

    getters: {
        getStock: (state) => (id: number) => {
            const product = state.products.find(p => p.id === id)
            return product?.stock ?? 0
        }
    },

    actions: {
        setProducts(products: Product[]) {
            this.products = products
        },

         decreaseStock(id: number, qty: number = 1) {
            const product = this.products.find(p => p.id === id)
            if (!product) return false
            if (product.stock < qty) return false

            product.stock -= qty
            return true
        },
        
        increaseStock(id: number, qty: number = 1) {
            const product = this.products.find(p => p.id === id)
            if (!product) return
            product.stock += qty
        }
    },
    persist: true,
})