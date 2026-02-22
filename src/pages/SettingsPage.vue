<template>
    <button @click="logout" class="flex items-center justify-center cursor-pointer w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">Logout</button>
</template>
<script setup lang="ts">
    import { supabase } from '@/lib/supabase'
    const router = useRouter()

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }
</script>