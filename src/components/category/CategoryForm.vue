<template>
    <div class="relative flex lg:flex-row flex-col gap-8">
        <div class="lg:w-3/4 lg:grid">
            <div class="flex flex-col gap-5">
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
    import type { Category } from '@/types/product'
    import { useProductUIStore } from '@/stores/product-ui'

    const productStore = useProductStore()
    
    const props = defineProps<{
        mode: 'create' | 'edit'
        selectedId: string | null
        categories: Category[]
    }>()

    const { back } = useProductUIStore()

    const form = reactive({
        name: '',
    })

    const isEdit = computed(() => props.mode === 'edit')

    const category = computed(() => {
        if (!props.selectedId) return null
        return props.categories.find(p => p.id === props.selectedId) ?? null
    })

    watch(
        () => category.value,
        (cat) => {
            if (cat && isEdit.value) {
                form.name = cat.name
            } else {
                form.name = ''
            }
        },
        { immediate: true }
    )

    const submit = async () => {
         if (isEdit.value && props.selectedId) {
            await productStore.updateCategory(props.selectedId, {
                ...form,
            })
        } else {
            await productStore.createCategory({
                ...form,
            })
        }

        back()
    }
</script>