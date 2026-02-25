import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export interface Product {
  id: number
  title: string
  img: string
  price: number
  sku: string
  barcode: string
  is_active: boolean
  category: string
  category_id: string
  created_at: string
  stock: number
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        categories: [] as { id: string; name: string }[],
        selectedCategory: 'all' as string,
    }),

    getters: {
        getStock: (state) => (id: number) => {
            const product = state.products.find(p => p.id === id)
            return product?.stock ?? 0
        },

        filteredProducts(state) {
            if (!state.selectedCategory ||state.selectedCategory === 'all') {
                return state.products
            }

            return state.products.filter(
                p => p.category_id === state.selectedCategory
            )
        }
    },

    actions: {
        async fetchCategories() {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name')

            if (error) {
                console.error(error)
                return
            }

            this.categories = data ?? []
        },

        async fetchProducts() {
            const { data, error } = await supabase
                .from('products')
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name)`)
                .eq('is_active', true)

            if (error) {
                console.error(error)
                return
            }

            this.products = data.map((item: any) => ({
                id: item.id,
                title: item.name,
                img: item.image_url,
                price: item.price,
                sku: item.sku,
                category: item.categories?.name ?? '',
                barcode: item.barcode,
                is_active: item.is_active,
                created_at: item.created_at,
                category_id: item.category_id,
                stock: 999
            }))
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