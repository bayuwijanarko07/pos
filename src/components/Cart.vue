<template>
    <aside class="sticky top-5 w-6/12 xl:w-4/12 lg:w-4/12 rounded bg-white flex flex-col h-full hover:shadow">
        <div class="p-4">
            <div class="justify-between mb-5">
                <p class="text-muted">Order Summary</p>
                <p class="text-sm text-gray-500">#12345</p>
            </div>
   
            <div
                v-for="item in cartStore.cart"
                :key="item.id"
                class="flex mb-1 p-1 bg-zinc-200 rounded">
                <img :src="item.img" :alt="item.title" class="rounded h-10 w-10 mr-2 object-cover">
                <div>
                    <p class="text-xs">{{ item.title }}</p>
                    <p class="text-xs text-gray-400">
                        Rp {{ item.price }} x {{ item.qty }}
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <button
                        class="px-2 bg-gray-200 rounded"
                        @click="decreaseQty(item)"
                        >
                        -
                    </button>

                    <button
                        class="px-2 bg-gray-200 rounded"
                        :disabled="getStock(item.id) <= 0"
                        @click="increaseQty(item)"
                    >
                        +
                    </button>

                    <button
                        class="px-2 bg-red-500 text-white rounded text-xs"
                        @click="removeItem(item)"
                        >
                        Hapus
                    </button>
                </div>
            </div>

            <div class="mt-4 font-bold">
                Total: Rp {{ cartStore.totalPrice }}
            </div>
        </div>
    </aside>
</template>
<script setup lang="ts">
    import { useCartStore } from '@/stores/cart'
    import { useProductStore } from '@/stores/products'

   const cartStore = useCartStore()
    const productStore = useProductStore()

    const getStock = (id: number) => {
        return productStore.getStock(id)
    }

    const increaseQty = (item: any) => {
        cartStore.increaseQty(item.id)
    }

    const decreaseQty = (item: any) => {
        cartStore.decreaseQty(item.id)
    }

    const removeItem = (item: any) => {
        cartStore.removeFromCart(item.id)
    }
</script>