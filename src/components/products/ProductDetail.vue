<template>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Detail Produk</h2>
    </div>
    <Card class="pt-2">
        <div class="w-full bg-white rounded-xl shadow p-10">

            <div v-if="!product" class="text-gray-500">
                Produk tidak ditemukan
            </div>

            <div v-else class="grid grid-cols-2 gap-6 text-sm">
                <div>
                    <p class="text-gray-500">Nama</p>
                    <p class="font-medium text-gray-800">{{ product.name }}</p>
                </div>

                <div>
                    <p class="text-gray-500">Kategori</p>
                    <p class="font-medium text-gray-800">{{ product.category }}</p>
                </div>

                <div>
                    <p class="text-gray-500">SKU</p>
                    <p class="font-medium text-gray-800">{{ product.sku }}</p>
                </div>

                <div>
                    <p class="text-gray-500">Barcode</p>
                    <p class="font-medium text-gray-800">{{ product.barcode }}</p>
                </div>

                <div>
                    <p class="text-gray-500">Harga</p>
                    <p class="font-medium text-gray-800">
                        {{ product.price }}
                    </p>
                </div>

                <div>
                    <p class="text-gray-500">Stock</p>
                    <p class="font-medium text-gray-800">{{ product.stock }}</p>
                </div>

                <div>
                    <p class="text-gray-500">Status</p>
                    <span
                        :class="product.is_active 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'"
                        class="px-2 py-1 rounded text-xs font-medium"
                    >
                        {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                </div>

                <div>
                    <p class="text-gray-500">Dibuat Pada</p>
                    <p class="font-medium text-gray-800">
                        {{ product.created_at }}
                    </p>
                </div>

            </div>


            <div class="flex mt-6">
                <button
                    type="button"
                    @click="back"
                    class="inline-flex cursor-pointer 
                    px-4 py-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
                >
                Kembali
                </button>
            </div>
        </div>
    </Card>
</template>
<script setup lang="ts">
    import { useProductUIStore } from '@/stores/product-ui'

    interface Product {
        id: number
        name: string
        category: string
        sku: string
        barcode: string
        price: number
        stock: number
        is_active: boolean
        created_at: string
    }

    const props = defineProps<{
        selectedId: number | null
        products: Product[]
    }>()

    const uiStore = useProductUIStore()
    const { back } = uiStore

    const product = computed(() => {
    if (!props.selectedId) return null
        return props.products.find(p => p.id === props.selectedId) ?? null
    })
</script>