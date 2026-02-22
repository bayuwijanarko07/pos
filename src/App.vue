<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'auth' 
    ? AuthLayout 
    : DefaultLayout
})

</script>