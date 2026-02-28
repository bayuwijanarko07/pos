import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Product, Category, ProductRow } from '@/types/product'
import { uploadProductImage } from '@/lib/storage'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        productMap: {} as Record<string, Product>,
        categories: [] as Category[],
        selectedCategory: 'all' as string,
        isLoading: false,
        isFetched: false,
        error: null as string | null,
    }),

    getters: {
        allProducts: (state) => Object.values(state.productMap),
        allCategories: (state) => state.categories,

        getProductById: (state) => (id: string) => {
            return state.productMap[id]
        },

        getStock: (state) => (id: string) => {
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
                category: (row.categories as any)?.name ?? '',
                stock: row.inventories?.[0]?.stock ?? 0,
            }
        },

        syncProductsArray() {
            this.products = Object.values(this.productMap)
        },

        async fetchProducts(force = false) {
            if (this.isFetched && !force) return

            this.isLoading = true
            this.error = null

            const { data, error } = await supabase
                .from('products')
                .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                .eq('is_active', true)

            console.log(data)

            if (error) {
                this.error = error.message
                console.error(error)
                this.isLoading = false
                return
            }

            const map: Record<string, Product> = {}

            for (const row of data as ProductRow[]) {
                const product = this.mapRow(row)
                map[product.id] = product
            }

            this.productMap = map
            this.isFetched = true
            this.syncProductsArray()
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
            file?: File
        }) {
            this.error = null

            try {
                const { data: inserted, error: insertError  } = await supabase
                .from('products')
                .insert({
                    name: payload.name,
                    sku: payload.sku,
                    barcode: payload.barcode,
                    price: payload.price,
                    category_id: payload.category_id,
                    is_active: true,
                    image_url: ''
                })
                .select('id')
                .single()

                if (insertError) throw insertError
      
                let imageUrl = ''

                if (payload.file) {
                    const upload = await uploadProductImage(inserted.id, payload.file)
                    imageUrl = upload.publicUrl

                    await supabase
                        .from('products')
                        .update({ image_url: imageUrl })
                        .eq('id', inserted.id)
                }

                const { data, error } = await supabase
                    .from('products')
                    .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                    .eq('id', inserted.id)
                    .single()

                    if (error) throw error

                    const newProduct = this.mapRow(data as ProductRow)

                    this.productMap[newProduct.id] = newProduct
                    this.syncProductsArray()

                    return newProduct

            } catch (err: any) {
                this.error = err.message
                throw err
            }
        },

        async updateProduct(id: string, payload: Partial<Product> & { file?: File }) {
            this.error = null
            try {
                let imageUrl = payload.image_url

                if (payload.file) {
                    const upload = await uploadProductImage(id, payload.file)
                    imageUrl = upload.publicUrl
                }

                const updatePayload = {
                    name: payload.name,
                    sku: payload.sku,
                    barcode: payload.barcode,
                    price: payload.price,
                    category_id: payload.category_id,
                    is_active: payload.is_active,
                    image_url: imageUrl,
                }

                const { data, error } = await supabase
                    .from('products')
                    .update(updatePayload)
                    .eq('id', id)
                    .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                    .single()

                    if (error) {
                        this.error = error.message
                        console.error(error)
                        throw error
                    }

                    const updatedProduct = this.mapRow(data as ProductRow)

                    this.productMap[id] = updatedProduct
                    this.syncProductsArray()

                    return updatedProduct
            } catch (err: any) {
                this.error = err.message
                throw err
            }
        },

        decreaseStock(id: string, qty = 1) {
            const product = this.productMap[id]
            if (!product || product.stock < qty) return false

            product.stock -= qty
            return true
        },
        
        increaseStock(id: string, qty = 1) {
            const product = this.productMap[id]
            if (!product) return
            product.stock += qty
        },

        clearCache() {
            this.productMap = {}
            this.isFetched = false
        },
    },
      // persist: true
})