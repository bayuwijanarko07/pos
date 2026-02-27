<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800">
      {{ pageTitle }}
    </h2>
  </div>

  <div class="mb-6">
    <nav class="flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="cursor-pointer px-4 py-4 rounded-lg text-sm font-medium transition"
        :class="activeTab === tab.key
          ? 'bg-cyan-500 text-white shadow'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="mt-6">
      <div v-if="activeTab === 'products'">
        <component
          :is="currentComponent"
          :mode="uiStore.mode"
          :selected-id="uiStore.selectedId"
          :products="products"
        />
      </div>

      <div v-else-if="activeTab === 'category'">
        <p class="text-gray-600">Halaman Kategori</p>
      </div>

      <div v-else-if="activeTab === 'inventory'">
        <p class="text-gray-600">Halaman Inventory</p>
      </div>

      <div v-else-if="activeTab === 'location'">
        <p class="text-gray-600">Halaman Location</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import type { Component } from 'vue'
  import { useProductStore } from '@/stores/products'
  import { useProductUIStore } from '@/stores/product-ui'

  import ProductTable from '@/components/products/ProductTable.vue'
  import ProductForm from '@/components/products/ProductForm.vue'
  import ProductDetail from '@/components/products/ProductDetail.vue'

  const productStore = useProductStore()
  const uiStore = useProductUIStore()

  onMounted(() => {
    productStore.fetchProducts()
  })

  interface TabItem {
    key: TabKey
    label: string
  }

  type Mode = 'list' | 'create' | 'edit' | 'detail'
  type TabKey = 'products' | 'category' | 'inventory' | 'location'

  const activeTab = ref<TabKey>('products')

  const tabs: TabItem[] = [
    { key: 'products', label: 'Produk' },
    { key: 'category', label: 'Kategori' },
    { key: 'inventory', label: 'Inventori' },
    { key: 'location', label: 'Location' },
  ]

  const componentMap: Record<Mode, Component> = {
    list: ProductTable,
    create: ProductForm,
    edit: ProductForm,
    detail: ProductDetail,
  }

  const currentComponent = computed(() => componentMap[uiStore.mode])

  const pageTitle = computed(() => {
    switch (uiStore.mode) {
      case 'create': return 'Tambah Produk'
      case 'edit': return 'Edit Produk'
      case 'detail': return 'Detail Produk'
      default: return 'Produk'
    }
  })

  const products = computed(() => productStore.products)
</script>