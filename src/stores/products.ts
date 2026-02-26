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

interface Category {
  id: string
  name: string
}

interface ProductRow {
  id: number
  name: string
  sku: string
  price: number
  image_url: string
  barcode: string
  is_active: boolean
  category_id: string
  created_at: string
  categories: { id: string; name: string }[] | null
  inventories: { stock: number }[] | null
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        productMap: {} as Record<number, Product>,
        categories: [] as Category[],
        selectedCategory: 'all' as string,
        isLoading: false,
        isFetched: false,
        error: null as string | null,
    }),

    getters: {
        products: (state) => Object.values(state.productMap),
        allCategories: (state) => state.categories,

        getProductById: (state) => (id: number) => {
            return state.productMap[id]
        },

        getStock: (state) => (id: number) => {
            const product = state.products.find(p => p.id === id)
            return product?.stock ?? 0
        },

        filteredProducts(state) {
            const list = Object.values(state.productMap)

            if (!state.selectedCategory || state.selectedCategory === 'all') {
                return list
            }

            return list.filter(
                (p) => p.category_id === state.selectedCategory
            )
        },
    },

    actions: {
        mapRow(row: ProductRow): Product {
            return {
                id: row.id,
                name: row.name,
                image_url: row.image_url,
                price: row.price,
                sku: row.sku,
                barcode: row.barcode,
                is_active: row.is_active,
                created_at: row.created_at,
                category_id: row.category_id,
                category: row.categories?.[0]?.name ?? '',
                stock: row.inventories?.[0]?.stock ?? 0,
            }
        },

        async fetchProducts(force = false) {
            if (this.isFetched && !force) return

            this.isLoading = true
            this.error = null

            const { data, error } = await supabase
                .from('products')
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                .eq('is_active', true)

            if (error) {
                this.error = error.message
                console.error(error)
                this.isLoading = false
                return
            }

            const map: Record<number, Product> = {}

            for (const row of data as ProductRow[]) {
                const product = this.mapRow(row)
                map[product.id] = product
            }

            this.productMap = map
            this.isFetched = true
            this.isLoading = false
        },

        async fetchCategories(force = false) {
            if (this.categories.length && !force) return

            const { data, error } = await supabase
                .from('categories')
                .select('id, name')

            if (error) {
                this.error = error.message
                console.error(error)
                return
            }

            this.categories = data ?? []
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
                this.error = error.message
                console.error(error)
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
            this.productMap[newProduct.id] = newProduct

            return newProduct
        },

        async updateProduct(id: number, payload: Partial<Product>) {
            const { data, error } = await supabase
                .from('products')
                .update(payload)
                .eq('id', id)
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name)`)
                .single()

            if (error) {
                this.error = error.message
                console.error(error)
                throw error
            }

            const existing = this.productMap[id]
            if (!existing) return data

            const updated = this.mapRow({
                ...data,
                inventories: [{ stock: existing.stock }],
            })

            this.productMap[id] = updated
            const index = this.products.findIndex((p) => p.id === id)
            if (index !== -1) this.products[index] = updated

            return data
        },

        decreaseStock(id: number, qty = 1) {
            const product = this.productMap[id]
            if (!product || product.stock < qty) return false

            product.stock -= qty
            return true
        },
        
        increaseStock(id: number, qty = 1) {
            const product = this.productMap[id]
            if (!product) return
            product.stock += qty
        },

        clearCache() {
            this.productMap = {}
            this.isFetched = false
        },
    },

    persist: true,
})