<template>
    <aside :class="[
        'fixed top-0 left-0 z-50 h-screen w-30 bg-white text-gray-800',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
        <div class="flex items-center justify-center p-4">
            <h1 class="text-center font-bold">POS</h1>
        </div>
       <nav class="p-4 space-y-2">
            <router-link
                v-for="menu in menus"
                :key="menu.path"
                :to="menu.path"
                class="block rounded-lg px-3 py-2 transition"
                :class="route.path === menu.path 
                    ? 'bg-blue-400 text-white' 
                    : 'text-gray-300 hover:bg-blue-400'"
                >
            {{ menu.name }}
            </router-link>
        </nav>
    </aside>
    <button
        class="fixed top-4 left-4 z-50 rounded-lg bg-white text-gray-800 p-2 lg:hidden"
        @click="toggleSidebar"
    >
    ☰
    </button>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()

    const menus = [
        { name: 'Dashboard', path: '/' },
        { name: 'Orders', path: '/orders' },
        { name: 'Products', path: '/products' },
    ]

    const isOpen = ref(false)

    const toggleSidebar = () => {
        isOpen.value = !isOpen.value
    }
</script>