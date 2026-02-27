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
                    required
                />
                <FieldInput 
                    label="Barcode"
                    type="text"
                    placeholder="Masukkan Barcode"
                    v-model="form.barcode"
                    required
                />
               <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-600">
                        Gambar Produk
                    </label>

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

                    <img 
                        v-if="previewUrl" 
                        :src="previewUrl" 
                        class="w-32 h-32 object-cover rounded-lg border"
                        alt="Preview"
                    />
                </div>
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
        category_id: '', 
        image_url: '',
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
                form.image_url = prod.image_url

                previewUrl.value = prod.image_url || ''
                file.value = null
            } else {
                form.name = ''
                form.price = 0
                form.category_id = ''
                form.image_url = ''
                previewUrl.value = ''
                file.value = null
            }
        },
        { immediate: true }
    )

    const submit = async () => {
         if (isEdit.value && props.selectedId) {
            await productStore.updateProduct(props.selectedId, {
                ...form,
                // file: file.value ?? undefined
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