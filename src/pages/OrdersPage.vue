<template>
  <div class="flex sm:flex-row space-x-4 space-y-4">
    <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
      <Card 
        v-for="menu in menus" 
        :key="menu.id"
        class="cursor-pointer"
        @click="addToCart(menu)">
        <img :src="menu.img" :alt="menu.title" class="object-cover">
        <h5 class="font-medium text-muted">
          {{ menu.title }}
        </h5>
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
  import Card from '@/components/Card.vue'
  import Cart from '@/components/Cart.vue'
  import { useCartStore } from '@/stores/cart'

  const imageModules = import.meta.glob('@/assets/images/products/*', {
    eager: true,
    import: 'default'
  }) as Record<string, string>

  const getImage = (name: string): string => {
    const path = `/src/assets/images/products/${name}`
    return imageModules[path] ?? ''
  }

  const menus = [
    {
      id: 1,
      title: 'Iced Coffe Latte',
      img: getImage('coffe-latte.png'),
      price: 18000,
      category: 'drinks'
    },
    {
      id: 2,
      title: 'Iced Chocolate',
      img: getImage('ice-chocolate.png'),
      price: 12000,
      category: 'drinks'
    },
    {
      id: 3,
      title: 'Iced Tea',
      img: getImage('ice-tea.png'),
      price: 5000,
      category: 'drinks'
    },
    {
      id: 4,
      title: 'Iced Matcha Latte',
      img: getImage('matcha-latte.png'),
      price: 16000,
      category: 'drinks'
    },
  ]

  interface Menu {
    id: number
    title: string
    img: string
    price: number
    category: string
  }

  const cartStore = useCartStore()

  const addToCart = (menu: Menu) => {
    cartStore.addToCart(menu)
  }
</script>