<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <main class="lg:ml-30 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
    import Sidebar from '@/components/Sidebar.vue'
</script>
