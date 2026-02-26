<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800">
      {{ pageTitle }}
    </h2>
  </div>

  <component
    :is="currentComponent"
    :mode="uiStore.mode"
    :selected-id="uiStore.selectedId"
    :products="products"
  />
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

  type Mode = 'list' | 'create' | 'edit' | 'detail'

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