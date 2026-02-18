<template>
  <div class="flex sm:flex-row gap-4">
    <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
      <Card 
        v-for="menu in productStore.products" 
        :key="menu.id"
        class="cursor-pointer"
        :class="menu.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''"
        @click="menu.stock > 0 && cartStore.addToCart(menu)">
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
  import { onMounted } from 'vue'
  import Card from '@/components/Card.vue'
  import Cart from '@/components/Cart.vue'
  import { useCartStore } from '@/stores/cart'
  import { useProductStore } from '@/stores/products'

  const cartStore = useCartStore()
  const productStore = useProductStore()

  const imageModules = import.meta.glob('@/assets/images/products/*', {
    eager: true,
    import: 'default'
  }) as Record<string, string>

  const getImage = (name: string): string => {
    const path = `/src/assets/images/products/${name}`
    return imageModules[path] ?? ''
  }

  onMounted(() => {
    if (productStore.products.length === 0) {
      productStore.setProducts([
        {
          id: 1,
          title: 'Iced Coffe Latte',
          img: getImage('coffe-latte.png'),
          price: 18000,
          category: 'drinks',
          stock: 15,
        },
        {
          id: 2,
          title: 'Iced Chocolate',
          img: getImage('ice-chocolate.png'),
          price: 12000,
          category: 'drinks',
          stock: 8,
        },
        {
          id: 3,
          title: 'Iced Tea',
          img: getImage('ice-tea.png'),
          price: 5000,
          category: 'drinks',
          stock: 6,
        },
        {
          id: 4,
          title: 'Iced Matcha Latte',
          img: getImage('matcha-latte.png'),
          price: 16000,
          category: 'drinks',
          stock: 8,
        },
      ])
    }
  })
</script>