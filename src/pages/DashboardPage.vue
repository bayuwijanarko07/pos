<template>
  <div class="grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 flex-1 overflow-y-auto">
    <Card class="p-5 md:p-6">

      <div class="flex items-center justify-between pb-10">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-15 h-15 bg-green-100 rounded">
            <Icon icon="mdi:dollar" class="text-green-500 text-2xl" />
          </div>
          <h5 class="text-gray-600">Total Revenue</h5>
        </div>

        <button class="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer">
          <Icon icon="mdi:dots-vertical" class="text-gray-600" />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon icon="mdi:dollar" class="text-green-500 text-3xl" />
          <h1 class="text-3xl">500000</h1>
        </div>

        <span class="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-600">
          <Icon icon="mdi:arrow-down" class="text-red-500" />
          <span class="text-gray-600">100%</span>
        </span>
      </div>
    </Card>

    <Card class="p-5 md:p-6">

      <div class="flex items-center justify-between pb-10">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-15 h-15 bg-yellow-100 rounded">
            <Icon icon="mdi:text-box-edit-outline" class="text-yellow-500 text-2xl" />
          </div>
          <h5 class="text-gray-600">Total Order</h5>
        </div>

        <button class="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer">
          <Icon icon="mdi:dots-vertical" class="text-gray-600" />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h1 class="text-3xl">4321</h1>
        </div>

        <span class="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-600">
          <Icon icon="mdi:arrow-up" class="text-green-500" />
          <span class="text-gray-600">100%</span>
        </span>
      </div>
    </Card>

    <Card class="p-5 md:p-6">

      <div class="flex items-center justify-between pb-10">
        <div class="flex items-center gap-4">
          <div class="flex items-center justify-center w-15 h-15 bg-gray-100 rounded">
            <Icon icon="mdi:store-clock-outline" class="text-gray-500 text-2xl" />
          </div>
          <h5 class="text-gray-600">Average Sell</h5>
        </div>

        <button class="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer">
          <Icon icon="mdi:dots-vertical" class="text-gray-600" />
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:dollar" class="text-green-500 text-3xl" />
          <h1 class="text-3xl">500</h1>
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