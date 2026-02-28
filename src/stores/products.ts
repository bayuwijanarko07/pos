import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Product, Category, ProductRow, Inventory, InventoryUpdate, InventoryInsert} from '@/types/product'
import { uploadProductImage } from '@/lib/storage'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        productMap: {} as Record<string, Product>,
        categories: [] as Category[],
        inventories: [] as Inventory[],
        selectedCategory: 'all' as string,
        isLoading: false,
        isFetched: false,
        error: null as string | null,
    }),

    getters: {
        allProducts: (state) => Object.values(state.productMap),
        allCategories: (state) => state.categories,
        allInventories: (state) => state.inventories,

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
            const totalStock =
            row.inventories?.reduce((sum, inv) => sum + (inv.stock ?? 0), 0) ?? 0
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
                stock: totalStock,
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
                .select('id, name, created_at')

            if (error) {
                this.error = error.message
                console.error(error)
                return
            }

            this.categories = data ?? []
        },

        async fetchInventories(force = false) {
            if (this.inventories.length && !force) return

            const { data, error } = await supabase
                .from('inventories')
                .select(`id,product_id,stock,updated_at, products!inner (id,name)`)

            if (error) {
                this.error = error.message
                console.error(error)
                return
            }

            this.inventories = (data ?? []).map((inv: any) => ({
                id: inv.id,
                product_id: inv.product_id,
                stock: inv.stock,
                updated_at: inv.updated_at,
                name: inv.products?.name ?? '-'
            }))
        },

        async createProduct(payload: {
            name: string
            sku: string
            barcode: string
            price: number
            image_url?: string
            category_id: string
            stock?: number
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
                    // cost: payload.cost ?? 0,
                    category_id: payload.category_id,
                    is_active: true,
                    image_url: ''
                })
                .select('id')
                .single()

                if (insertError) throw insertError
                
                const productId = inserted.id

                let imageUrl = ''

                if (payload.file) {
                    const upload = await uploadProductImage(inserted.id, payload.file)
                    imageUrl = upload.publicUrl

                    await supabase
                        .from('products')
                        .update({ image_url: imageUrl })
                        .eq('id', inserted.id)
                }

                 await supabase.from('inventories').insert({
                    product_id: productId,
                    stock: payload.stock ?? 0,
                })

                const { data, error } = await supabase
                    .from('products')
                    .select(`id,name,sku,price,image_url,barcode,is_active,category_id,created_at,categories(id,name),inventories(stock)`)
                    .eq('id', productId)
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

        async createCategory(payload: { name: string }) {
            this.error = null
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .insert({
                        name: payload.name,
                    })
                    .select()
                    .single()

                if (error) throw error

                this.categories.push(data)
                return data
            } catch (err: any) {
                this.error = err.message
                throw err
            }
        },

        async updateCategory(id: string, payload: { name: string }) {
            this.error = null
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .update({
                        name: payload.name,
                    })
                    .eq('id', id)
                    .select()
                    .single()

                if (error) throw error

                const index = this.categories.findIndex(c => c.id === id)
                if (index !== -1) {
                    this.categories[index] = data
                }

                Object.values(this.productMap).forEach(p => {
                    if (p.category_id === id) {
                        p.category = data.name
                    }
                })

                return data
            } catch (err: any) {
                this.error = err.message
                throw err
            }
        },

        async createInventory(payload: InventoryInsert) {
            this.error = null
            try {
                const { data, error } = await supabase
                    .from('inventories')
                    .insert({
                        product_id: payload.product_id,
                        stock: payload.stock,
                    })
                    .select()
                    .single()

                if (error) {
                    this.error = error.message
                    throw error
                }

                this.inventories.push({
                    id: data.id,
                    product_id: data.product_id,
                    stock: data.stock,
                })

                if (data.product_id) {
                    const product = this.productMap[data.product_id]

                    if (product) {
                        product.stock = data.stock
                        this.syncProductsArray()
                    }
                }

                return data
            } catch (err: any) {
                this.error = err.message
                throw err
            }
        },

        async updateInventory(payload: InventoryUpdate) {
            this.error = null

            if (!payload.id) {
                throw new Error('Inventory ID is required for update')
            }

            try {
                const { data, error } = await supabase
                    .from('inventories')
                    .update({
                        product_id: payload.product_id,
                        stock: payload.stock,
                    })
                    .eq('id', payload.id)
                    .select()
                    .single()

                if (error) {
                    this.error = error.message
                    throw error
                }

                const index = this.inventories.findIndex(
                    (inv) => inv.id === payload.id
                )

                if (index !== -1) {
                    this.inventories[index] = data
                }

                const product = this.productMap[data.product_id]

                if (product) {
                    product.stock = data.stock
                    this.syncProductsArray()
                }

                return data
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