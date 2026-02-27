<template>
  <div class="flex gap-4 mb-5">
    <button
      @click="setCategory('all')"
      :class="btnClass('all')">
      Semua
    </button>

    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="setCategory(cat.id)"
      :class="btnClass(cat.id)"
    >
      {{ cat.name }}
    </button>
  </div>

  <div class="flex sm:flex-row gap-4">
    <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
      
      <Card 
        v-for="menu in products" 
        :key="menu.id"
        class="cursor-pointer hover:shadow p-5 md:p-6 space-y-2"
        :class="menu.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''"
        @click="menu.stock > 0 && cartStore.addToCart(menu)"
      >
        <img
          :src="menu.image_url || '/placeholder.png'"
          :alt="menu.name"
          class="object-cover w-full h-40 rounded"
        />

        <div class="flex justify-between">
          <h5 class="font-medium text-muted">
            {{ menu.name }}
          </h5>

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
              {{ menu.category || 'Uncategorized' }}
            </span>
            <p class="text-sm text-muted">
              {{ formatPrice(menu.price) }}
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

  const categories = computed(() => productStore.categories ?? [])
  const products = computed(() => productStore.filteredProducts)
  
  const setCategory = (id: string) => {
    productStore.selectedCategory = id
  }

  watch(
    () => productStore.categories,
    (cats) => {
      if (!cats?.length) return

      const exists = cats.some(c => c.id === productStore.selectedCategory)
      if (!exists && productStore.selectedCategory !== 'all') {
        productStore.selectedCategory = 'all'
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    await Promise.all([
      productStore.fetchCategories(),
      productStore.fetchProducts()
    ])
  })

  const btnClass = (id: string) => {
    const active = productStore.selectedCategory === id

    return [
      'cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition',
      active
        ? 'bg-cyan-500 text-white shadow'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    ]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price)
  }
</script>