<template>
    <div class="relative flex lg:flex-row flex-col gap-8">
        <div class="lg:w-3/4 lg:grid">
            <div class="flex flex-col gap-5">
                <label class="font-medium text-gray-600">
                    Informasi Inventori
                </label>
                <form class="rounded-xl bg-white p-5" @submit.prevent="submit">
                    <div class="grid grid-cols-2 gap-4">
                        <FieldSelect
                            id="category"
                            name="category"
                            v-model="form.product_id"
                            label="Nama Produk"
                            placeholder="Pilih Produk"
                            :options="products.map(c => ({
                                label: c.name,
                                value: c.id
                            }))"
                            required
                            prefixIcon="mdi:shape"
                        />
                         <FieldInput 
                            label="Persediaan"
                            type="number"
                            placeholder="Masukkan persediaan"
                            v-model="form.stock"
                        />
                    </div>
                    <div class="flex justify-end mt-5 gap-2">
                        <button
                            type="button"
                            @click="back()"
                            class="inline-flex cursor-pointer 
                            px-4 py-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                            <span>Batal</span>
                        </button>
                        <button type="submit"                     
                            class="inline-flex cursor-pointer
                            px-4 py-3 text-sm font-medium text-white bg-cyan-500 rounded-lg shadows hover:bg-cyan-600 transition"
                        >
                            <span>{{ isEdit ? 'Update' : 'Kirim' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useProductStore } from '@/stores/products'
    import type { Product, Inventory } from '@/types/product'
    import { useProductUIStore } from '@/stores/product-ui'

    const productStore = useProductStore()
    
    const props = defineProps<{
        mode: 'create' | 'edit'
        selectedId: string | null
        products: Product[]
        inventories: Inventory[]
    }>()

    const { back } = useProductUIStore()

    const form = reactive({
        id: '',
        product_id: '',
        stock: 0,
    })

    const isEdit = computed(() => props.mode === 'edit')

    const inventory = computed(() => {
        if (!props.selectedId) return null
        return props.inventories.find(p => p.id === props.selectedId) ?? null
    })

    watch(
        () => inventory.value,
        (inv) => {
            if (inv && isEdit.value) {
                form.id = inv.id
                form.product_id = inv.product_id
                form.stock = inv.stock
            } else {
                form.id = ''
                form.product_id = ''
                form.stock = 0
            }
        },
        { immediate: true }
    )

    const submit = async () => {
        if (!form.product_id) return

        if (isEdit.value) {
            await productStore.updateInventory({ ...form })
        } else {
            await productStore.createInventory({ ...form })
        }

        back()
    }
</script>