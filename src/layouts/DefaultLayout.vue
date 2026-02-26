<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar />
    <main class="lg:ml-30 p-6">
      <div class="mx-auto max-w-(--breakpoint-2xl) p-4 pb-20 md:p-6 md:pb-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import Sidebar from '@/components/Sidebar.vue'
</script>
