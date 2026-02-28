<template>
    <div class="py-2">
        <button
            type="button"
            @click="back"
            class="inline-flex cursor-pointer 
            px-4 py-3 text-sm font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-300 transition"
        >
            <Icon icon="mdi:chevron-left" />
        </button>
    </div>
    <div class="relative flex lg:flex-row flex-col gap-8">
        <div class="lg:w-3/4 lg:grid">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-600">
                    Informasi Produk
                </label>
                <form class="rounded-xl bg-white p-5" @submit.prevent="submit">
                    <div class="grid grid-cols-2 gap-4">
                        <FieldInput 
                            label="Nama"
                            type="text"
                            placeholder="Masukkan nama"
                            v-model="form.name"
                            required
                        />
                        <FieldInput 
                            label="Harga"
                            type="number"
                            placeholder="Masukkan harga"
                            v-model="form.price"
                            required
                        />
                        <FieldInput 
                            label="SKU"
                            type="text"
                            placeholder="Masukkan SKU"
                            v-model="form.sku"
                        />
                        <FieldInput 
                            label="Barcode"
                            type="text"
                            placeholder="Masukkan Barcode"
                            v-model="form.barcode"
                        />
                        <FieldSelect
                            id="category"
                            name="category"
                            v-model="form.category_id"
                            label="Kategori"
                            placeholder="Pilih kategori"
                            :options="categories.map(c => ({
                                label: c.name,
                                value: c.id
                            }))"
                            required
                            prefixIcon="mdi:shape"
                        />
                        <FieldInput 
                            label="Persediaan"
                            type="number"
                            placeholder="Masukkan Persediaan"
                            disabled
                        />
                        <ToggleSwitch 
                            label="Status"
                            v-model="form.is_active"
                            placeholder="Status"
                            statusText
                        />
                    </div>
                    <div class="flex justify-end mt-5">
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
        <div class="lg:w-1/4 lg:grid">
            <div class="flex flex-col gap-2">
                <label class="font-medium text-gray-600">
                    Gambar Produk
                </label>
                <img 
                    v-if="previewUrl" 
                    :src="previewUrl" 
                    class="w-100 h-100 object-cover rounded-lg border border-gray-50"
                    alt="Preview"
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    @change="onFileChange"
                    class="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-50 file:text-cyan-600
                    hover:file:bg-cyan-100 cursor-pointer"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useProductStore } from '@/stores/products'
    import type { Product, Category } from '@/types/product'
    import { useProductUIStore } from '@/stores/product-ui'

    const productStore = useProductStore()

    
    const props = defineProps<{
        mode: 'create' | 'edit'
        selectedId: string | null
        products: Product[]
        categories: Category[]
    }>()

    const { back } = useProductUIStore()

    const form = reactive({
        name: '',
        sku: '',
        barcode: '',
        price: 0,
        category_id: '', 
        image_url: '',
        is_active: true,
    })

    const file = ref<File | null>(null)
    const previewUrl = ref<string>('')

    const onFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const selected = target.files?.[0] ?? null

        if (!selected) return

        if (!selected.type.startsWith('image/')) {
            alert('File harus berupa gambar')
            return
        }

        if (selected.size > 2 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 2MB')
            return
        }

        file.value = selected
        previewUrl.value = URL.createObjectURL(selected)
    }

    const isEdit = computed(() => props.mode === 'edit')

    const product = computed(() => {
        if (!props.selectedId) return null
        return props.products.find(p => p.id === props.selectedId) ?? null
    })

    watch(
        () => product.value,
        (prod) => {
            if (prod && isEdit.value) {
                form.name = prod.name
                form.price = prod.price
                form.barcode = prod.barcode
                form.sku = prod.sku
                form.category_id = prod.category_id
                form.image_url = prod.image_url
                form.is_active = prod.is_active ?? true
                previewUrl.value = prod.image_url || ''
                file.value = null
            } else {
                form.name = ''
                form.price = 0
                form.barcode = ''
                form.sku = ''
                form.category_id = ''
                form.image_url = ''
                previewUrl.value = ''
                form.is_active = true
                file.value = null
            }
        },
        { immediate: true }
    )

    const submit = async () => {
         if (isEdit.value && props.selectedId) {
            await productStore.updateProduct(props.selectedId, {
                ...form,
                file: file.value ?? undefined
            })
        } else {
            await productStore.createProduct({
                ...form,
                file: file.value ?? undefined
            })
        }

        back()
    }
</script>