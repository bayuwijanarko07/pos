<template>
    <Card class="pt-2">
        <div class="flex flex-col gap-4 m-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-base font-medium text-gray-800">
                Daftar Produk
            </h3>
            <div class="flex items-center gap-3">
                <FieldInput 
                    type="text"
                    placeholder="Cari Produk"
                />
                <button 
                    @click="openCreate"
                    class="inline-flex cursor-pointer items-center gap-2 bg-green-400 rounded-lg px-3 py-2 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-green-500"
                >
                    Tambah
                </button>
            </div>
        </div>
        <div class="p-4 border-gray-800 sm:p-6">
            <div class="max-w-full overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="border-gray-500 border-y">
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">No</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Nama</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Kategori</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">SKU</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">No Barcode</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Harga</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Stock</p>
                                </div> 
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Status</p>
                                </div> 
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Dibuat Pada</p>
                                </div> 
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Aksi</p>
                                </div> 
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800">
                        <tr 
                            v-for="(prod, index) in productStore.products" 
                            :key="prod.id"
                        >
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{ index + 1}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.name}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.category}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.sku}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.barcode}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.price}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.stock}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        <span 
                                            :class="prod.is_active 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-red-100 text-red-600'"
                                            class="px-2 py-1 rounded text-xs font-medium"
                                        >
                                            {{ prod.is_active ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{prod.created_at}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="openDetail(prod.id)"
                                        class="rounded bg-gray-400 p-1 text-white text-sm cursor-pointer"
                                    >
                                        <Icon icon="mdi:eye" class="w-4 h-4"/>
                                    </button>
                                    <button 
                                        @click="openEdit(prod.id)"
                                        class="rounded bg-yellow-400 p-1 text-white text-sm cursor-pointer">
                                        <Icon icon="mdi:edit" class="w-4 h-4"/>
                                    </button>
                                    <button 
                                        class="rounded bg-red-400 p-1 text-white text-sm cursor-pointer">
                                        <Icon icon="mdi:trash" class="w-4 h-4"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Card>
</template>
<script setup lang="ts">
    import { useProductStore } from '@/stores/products'
    import { useProductUIStore } from '@/stores/product-ui'

    const productStore = useProductStore()
    const { openCreate, openEdit, openDetail } = useProductUIStore()

    onMounted(async () => {
        await productStore.fetchCategories()
        await productStore.fetchProducts()
    })
</script>