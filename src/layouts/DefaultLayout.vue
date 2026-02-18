<template>
  <div class="min-h-screen bg-gray-100">
    <AppSidebar />
    <main class="lg:ml-64 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
    import AppSidebar from '@/components/AppSidebar.vue'
</script>
