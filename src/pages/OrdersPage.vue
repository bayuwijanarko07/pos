<template>
  <div class="flex gap-4 mb-5">
    <button
      @click="productStore.selectedCategory = 'all'"
      :class="btnClass('all')">
      Semua
    </button>

    <button
      v-for="cat in productStore.categories"
      :key="cat.id"
      @click="productStore.selectedCategory = cat.id"
      :class="btnClass(cat.id)">
      {{ cat.name }}
    </button>
  </div>

  <div class="flex sm:flex-row gap-4">
    <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
      
      <Card 
        v-for="menu in productStore.filteredProducts" 
        :key="menu.id"
        class="cursor-pointer hover:shadow p-5 md:p-6 space-y-2"
        :class="menu.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''"
        @click="menu.stock > 0 && cartStore.addToCart(menu)"
      >
        <img :src="menu.img" :alt="menu.title" class="object-cover">
        <div class="flex justify-between">
          <h5 class="font-medium text-muted">{{ menu.title }}</h5>
          <h5 class="font-medium text-muted">
            <span v-if="menu.stock > 0">
              Qty: {{ menu.stock }}
            </span>
            <span v-else class="text-red-500 font-semibold">
              Out of Stock
            </span>
          </h5>
        </div>
        <div class="flex justify-between">
            <span class="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">
              {{ menu.category }}
            </span>
            <p class="text-sm text-muted">
              {{ menu.price }}
            </p>
        </div>
      </Card>
    </div>

    <Cart :cart="cartStore.cart"/>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/stores/cart'
  import { useProductStore } from '@/stores/products'

  const cartStore = useCartStore()
  const productStore = useProductStore()

  onMounted(async () => {
    await productStore.fetchCategories()
    await productStore.fetchProducts()
  })
  
  const btnClass = (name: string) => {
    return [
      'cursor-pointer px-5 py-5 rounded',
      productStore.selectedCategory === name
        ? 'bg-cyan-500 text-white'
        : 'bg-gray-200'
    ]
  }
</script>