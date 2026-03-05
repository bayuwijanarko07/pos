<template>
  <aside class="sticky top-5 w-6/12 xl:w-4/12 lg:w-4/12 rounded-xl bg-white flex flex-col h-full hover:shadow">
    <div class="p-4">

      <div class="flex justify-between mb-5">
        <p class="text-muted">Nomor Order</p>
        <p class="text-sm text-gray-500">{{ orderStore.order?.invoice_no ?? '-' }}</p>
      </div>

      <div class="flex justify-between mb-5">
        <p class="text-muted">Kasir</p>
        <p class="text-sm text-gray-500">{{ userStore.cashierName }}</p>
      </div>

      <div
        v-for="item in cartStore.cart"
        :key="item.id"
        class="flex mb-1 p-1 bg-zinc-50 rounded"
      >
        <img
          :src="item.image_url"
          :alt="item.name"
          class="rounded h-10 w-10 mr-2 object-cover"
        >

        <div class="flex flex-col justify-center grow">
          <span class="text-xs">{{ item.name }}</span>
          <span class="text-xs text-gray-400">
            Rp {{ item.price }}
          </span>
        </div>

        <div class="flex items-center gap-2">

          <button
            class="px-2 py-1 bg-gray-300 rounded disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="item.qty <= 1"
            @click="decreaseQty(item.id)"
          >
            -
          </button>

          <input
            class="w-10 text-center bg-gray-100 rounded py-1 disabled:cursor-not-allowed disabled:opacity-50"
            type="number"
            min="1"
            :max="getStock(item.id) + item.qty"
            :value="item.qty"
            @change="updateQty(item.id, $event)"
          >

          <button
            class="px-2 py-1 bg-gray-300 rounded disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="getStock(item.id) <= 0"
            @click="increaseQty(item.id)"
          >
            +
          </button>

          <button
            class="cursor-pointer px-2 py-2 bg-red-500 text-white rounded text-xs disabled:cursor-not-allowed disabled:opacity-50"
            @click="removeItem(item.id)"
          >
            <Icon icon="mdi:trash" class="text-lg"/>
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
import { Icon } from '@iconify/vue'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'

const cartStore = useCartStore()
const productStore = useProductStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const getStock = (id: string): number => {
  return productStore.getStock(id)
}

const increaseQty = (id: string): void => {
  cartStore.increaseQty(id)
}

const decreaseQty = (id: string): void => {
  cartStore.decreaseQty(id)
}

const updateQty = (id: string, event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)

  if (!Number.isNaN(value)) {
    cartStore.updateQty(id, value)
  }
}


onMounted(async () => {
  if (!orderStore.order) {
    await orderStore.createOrder(userStore.user.id)
  }
})

const removeItem = (id: string): void => {
  cartStore.removeFromCart(id)
}
</script>