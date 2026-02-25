<template>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Tambah Produk</h2>
    </div>
    <Card class="pt-2">
        <div class="w-full bg-white rounded-xl shadow p-10">
            <div class="flex justify-between">
                <button
                    type="button"
                    @click="back"
                    class="inline-flex cursor-pointer 
                    px-4 py-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
                >
                    Kembali
                </button>
                <button type="submit"                     
                    class="inline-flex cursor-pointer
                    px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg shadows hover:bg-red-600 transition"
                >
                    <span>Hapus</span>
                </button>
            </div>
        </div>
    </Card>
</template>
<script setup lang="ts">
    import { useProductUIStore } from '@/stores/product-ui'

    const { back } = useProductUIStore()
</script>