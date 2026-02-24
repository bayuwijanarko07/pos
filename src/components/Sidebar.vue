<template>
    <aside :class="[
        'fixed flex flex-col top-0 left-0 z-50 h-screen w-30 bg-white text-gray-800',
    ]">
        <div class="flex items-center justify-center p-4">
            <h1 class="text-center font-bold">POS</h1>
        </div>

       <nav class="p-4 space-y-2">
            <router-link
                v-for="menu in topMenus"
                :key="menu.path"
                :to="menu.path"
                class="flex justify-center items-center rounded-lg p-5"
                :class="route.path === menu.path 
                    ? 'bg-cyan-400 text-white' 
                    : 'text-gray-600'"
                >
                <Icon :icon="menu.icon" class="text-xl"/>
            </router-link>
        </nav>

        <nav class="p-4 space-y-2 mt-auto">
            <router-link
                v-for="menu in bottomMenus"
                :key="menu.path"
                :to="menu.path"
                class="flex justify-center items-center rounded-lg p-5"
                :class="route.path === menu.path 
                ? 'bg-cyan-400 text-white' 
                : 'text-gray-600'"
            >
                <Icon :icon="menu.icon" class="text-xl" />
            </router-link>
        </nav>
    </aside>
</template>
<script setup lang="ts">

    const route = useRoute()

    const menus = [
        { label: 'Dashboard', path: '/', icon: "mdi:view-dashboard" },
        { label: 'Orders', path: '/orders', icon: "mdi:order-bool-descending-variant" },
        { label: 'Products', path: '/products', icon: "mdi:material" },
        { label: 'User', path: '/user', icon: "mdi:user" },
        { label: 'Settings', path: '/settings', icon: "mdi:settings" },
    ]

    const bottomMenus = computed(() =>
        menus.filter(menu => ['/user', '/settings'].includes(menu.path))
    )

    const topMenus = computed(() =>
        menus.filter(menu => !['/user', '/settings'].includes(menu.path))
    )
</script>