<template>
    <aside class="sticky top-5 w-6/12 xl:w-4/12 lg:w-4/12 rounded bg-white flex flex-col h-full hover:shadow">
      <div class="p-4">
        <h5 class="text text-gray-800">
          Keranjang
        </h5>
   
      <div
        v-for="item in cartStore.cart"
        :key="item.id"
        class="flex items-center">
            <img :src="item.img" :alt="item.title" class="w-10 h-10 object-cover">
            <div>
                <p class="font-sm">{{ item.title }}</p>
                <p class="text-xs text-gray-400">
                    Rp {{ item.price }} x {{ item.qty }}
                </p>
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

    const cartStore = useCartStore()
</script>