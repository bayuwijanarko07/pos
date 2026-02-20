<template>
  <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto">
    <Card class="p-5 md:p-6">

      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
            <Icon icon="mdi:dollar" class="text-green-500 text-2xl" />
          </div>
          <h5 class="text-gray-600">Total Revenue</h5>
        </div>

        <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer">
          <Icon icon="mdi:dots-vertical" class="text-gray-600" />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:dollar" class="text-green-500 text-3xl" />
          <h1 class="text-3xl">500000</h1>
        </div>

        <span class="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-600">
          <Icon icon="mdi:arrow-up" class="text-green-500" />
          <span class="text-gray-600">100%</span>
        </span>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
</script>