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
        <component
          :is="currentComponent"
          :mode="currentMode"
          :selected-id="selectedId"
          :products="products"
          :categories="categories"
          :inventories="inventories"
        />
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
  import CategoryTable from '@/components/category/CategoryTable.vue'
  import CategoryForm from '@/components/category/CategoryForm.vue'
  import InventoryTable from '@/components/inventory/InventoryTable.vue'
  import InventoryForm from '@/components/inventory/InventoryForm.vue'

  const productStore = useProductStore()
  const uiStore = useProductUIStore()

  onMounted(async () => {
    await Promise.all([
      productStore.fetchProducts(),
      productStore.fetchCategories(),
      productStore.fetchInventories(),
    ])
  })

  interface TabItem {
    key: TabKey
    label: string
  }

  type Mode = 'list' | 'create' | 'edit' 
  type TabKey = 'products' | 'category' | 'inventory'

  const tabs: TabItem[] = [
    { key: 'products', label: 'Produk' },
    { key: 'category', label: 'Kategori' },
    { key: 'inventory', label: 'Inventori' },
  ]

  const componentRegistry: Record<TabKey, Record<Mode, Component>> = {
    products: {
      list: ProductTable,
      create: ProductForm,
      edit: ProductForm,
    },
    category: {
      list: CategoryTable,
      create: CategoryForm,
      edit: CategoryForm,
    },
    inventory: {
      list: InventoryTable,
      create: InventoryForm,
      edit: InventoryForm,
    }
  }

  const currentComponent = computed(() => {
    return componentRegistry[uiStore.activeModule][currentMode.value]
  })

  const activeTab = computed({
    get: () => uiStore.activeModule,
    set: (val) => uiStore.setModule(val),
  })

  const currentMode = computed(() => 
    uiStore.modeMap[uiStore.activeModule]
  )

  const selectedId = computed(() => 
    uiStore.selectedIdMap[uiStore.activeModule]
  )

  const pageTitle = computed(() => {
    const module = uiStore.activeModule
    const mode = currentMode.value

    const moduleLabelMap = {
      products: 'Produk',
      category: 'Kategori',
      inventory: 'Inventori',
      location: 'Lokasi',
    }

    if (mode === 'create') return `Tambah ${moduleLabelMap[module]}`
    if (mode === 'edit') return `Edit ${moduleLabelMap[module]}`
    return moduleLabelMap[module]
  })

  const products = computed(() => productStore.allProducts)
  const categories = computed(() => productStore.categories)
  const inventories = computed(() => productStore.inventories)
</script>