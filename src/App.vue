<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'auth' 
    ? AuthLayout 
    : DefaultLayout
})

</script>