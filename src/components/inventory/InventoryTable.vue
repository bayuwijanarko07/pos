<template>
    <Card class="pt-2">
        <div class="flex flex-col gap-4 m-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-base font-medium text-gray-800">
                Daftar Inventori
            </h3>
            <div class="flex items-center gap-3">
                <FieldInput 
                    type="text"
                    placeholder="Cari Produk"
                />
                <button 
                    @click="openCreate()"
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
                                    <p class="font-medium text-gray-500 text-xs">Produk</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Persediaan</p>
                                </div>
                            </th>
                            <th class="px-5 py-3 sm:px-6">
                                <div class="flex items-center">
                                    <p class="font-medium text-gray-500 text-xs">Diubah pada</p>
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
                            v-for="(inv, index) in inventories" 
                            :key="inv.id"
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
                                        {{ inv.name || '-' }}
                                    </p>
                                </div>
                            </td>
                             <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{inv.stock}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center">
                                    <p class="text-gray-500 text-sm">
                                        {{inv.updated_at}}
                                    </p>
                                </div>
                            </td>
                            <td class="px-6 py-3.5">
                                <div class="flex items-center gap-1">
                                    <button 
                                        @click="openEdit(inv.id)"
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
    import type { Product, Inventory } from '@/types/product'
    import { useProductUIStore } from '@/stores/product-ui'
    const { openCreate, openEdit } = useProductUIStore()

    interface Props {
        products: Product[]
        inventories: Inventory[]
    }

    const props = defineProps<Props>()
</script>