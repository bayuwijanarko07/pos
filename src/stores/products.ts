import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export interface Product {
  id: number
  name: string
  image_url: string
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

        allProducts (state) {
            return state.products
        },

        allCategories (state) {
            return state.categories
        },

        filteredProducts(state) {
            if (!state.selectedCategory ||state.selectedCategory === 'all') {
                return state.products
            }

            return state.products.filter(
                p => p.category_id === state.selectedCategory
            )
        },

        getProductById: (state) => {
            return (id: number) => state.products.find(p => p.id === id)
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
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                .eq('is_active', true)

            if (error) {
                console.error(error)
                return
            }

            this.products = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                image_url: item.image_url,
                price: item.price,
                sku: item.sku,
                category: item.categories?.name ?? '',
                barcode: item.barcode,
                is_active: item.is_active,
                created_at: item.created_at,
                category_id: item.category_id,
                stock: item.inventories?.[0]?.stock ?? 0
            }))
        },

        async createProduct(payload: {
                name: string
                sku: string
                barcode: string
                price: number
                image_url?: string
                category_id: string
            }) {
            const { data, error } = await supabase
                .from('products')
                .insert({
                    name: payload.name,
                    sku: payload.sku,
                    barcode: payload.barcode,
                    price: payload.price,
                    image_url: payload.image_url ?? '',
                    category_id: payload.category_id,
                    is_active: true
                })
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories:category_id (id,name)`)
                .single()

            if (error) {
                console.error('Create product error:', error)
                throw error
            }

            const newProduct: Product = {
                id: data.id,
                name: data.name,
                image_url: data.image_url,
                price: data.price,
                sku: data.sku,
                barcode: data.barcode,
                is_active: data.is_active,
                created_at: data.created_at,
                category: data.categories?.[0]?.name ?? '',
                category_id: data.category_id,
                stock: 0
            }

            this.products.unshift(newProduct)

            return newProduct
        },

        async updateProduct(id: number, payload: Partial<Product>) {
            const { data, error } = await supabase
                .from('products')
                .update({
                    name: payload.name,
                    sku: payload.sku,
                    barcode: payload.barcode,
                    price: payload.price,
                    image_url: payload.image_url,
                    category_id: payload.category_id,
                })
                .eq('id', id)
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name)`)
                .single()

            if (error) {
                console.error('Update product error:', error)
                throw error
            }

            const index = this.products.findIndex(p => p.id === id)
            if (index !== -1) {
                this.products[index] = {
                    ...this.products[index],
                    ...data,
                    category: data.categories?.[0]?.name ?? '',
                    stock: 0
                }
            }

            return data
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