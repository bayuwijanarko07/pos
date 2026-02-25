<template>
    <Card class="pt-2">
        <div class="w-full bg-white rounded-xl shadow p-10">
            <form class="space-y-5" @submit.prevent="submit">
                <FieldInput 
                    label="Nama"
                    type="text"
                    placeholder="Masukkan nama"
                    v-model="form.name"
                    required
                />
                <select v-model="form.category_id" required>
                    <option value="" disabled>Pilih Kategori</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </option>
                </select>
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
                        px-4 py-3 text-sm font-medium text-white bg-cyan-500 rounded-lg shadows hover:bg-cyan-600 transition"
                    >
                    <span>{{ isEdit ? 'Update' : 'Kirim' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </Card>
</template>
<script setup lang="ts">
    import { useProductStore } from '@/stores/products'
    import { useProductUIStore } from '@/stores/product-ui'

    const props = defineProps<{
        mode: 'create' | 'edit'
        selectedId: number | null
    }>()

    const productStore = useProductStore()
    const { back } = useProductUIStore()

    const form = reactive({
        name: '',
        sku: '',
        barcode: '',
        price: 0,
        category_id: '1', 
        image_url: '',
    })

    const isEdit = computed(() => props.mode === 'edit')

    const product = computed(() => {
        if (!props.selectedId) return null
        return productStore.getProductById(props.selectedId)
    })

    const categories = computed(() => productStore.allCategories)

    watch(
        () => product.value,
        (prod) => {
            if (prod && isEdit.value) {
                form.name = prod.name
                form.price = prod.price
                form.category_id = prod.category_id
            } else {
                form.name = ''
                form.price = 0
                form.category_id = ''
            }
        },
        { immediate: true }
    )

    const submit = async () => {
        if (isEdit.value && props.selectedId) {
            await productStore.updateProduct(props.selectedId, form)
        } else {
            await productStore.createProduct(form)
        }

        await productStore.fetchProducts()
        back()
    }

</script>