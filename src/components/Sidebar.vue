<template>
    <aside :class="[
        'fixed top-0 left-0 z-50 h-screen w-30 bg-white text-gray-800',
    ]">
        <div class="flex items-center justify-center p-4">
            <h1 class="text-center font-bold">POS</h1>
        </div>
       <nav class="p-4 space-y-2">
            <router-link
                v-for="menu in menus"
                :key="menu.path"
                :to="menu.path"
                class="flex justify-center items-center rounded-lg p-5"
                :class="route.path === menu.path 
                    ? 'bg-blue-400 text-white' 
                    : 'text-gray-600'"
                >
                <Icon :icon="menu.icon" class="text-xl"/>
            </router-link>
        </nav>
    </aside>
</template>
<script setup lang="ts">

    const route = useRoute()

    const menus = [
        { name: 'Dashboard', path: '/', icon: "mdi:view-dashboard" },
        { name: 'Orders', path: '/orders', icon: "mdi:order-bool-descending-variant" },
        { name: 'Products', path: '/products', icon: "mdi:material" },
    ]
</script>