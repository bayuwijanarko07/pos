<template>
    <div class="z-1">
        <div class="relative flex lg:flex-row w-full h-screen justify-center flex-col">
            <div class="lg:w-1/2 w-full h-full lg:grid items-center hidden relative">

            </div>
            <div class="items-center justify-center flex flex-col lg:w-1/2 bg-gray-100 p-10">
                <div class="max-w-md w-full bg-white rounded-xl shadow p-10">
                    <div class="mt-5 sm:mb-8">
                        <h1 class="mb-2 font-semibold text-gray-800 text-3xl">Login</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400"> Input email dan katasandi untuk login!</p>
                    </div>
                    <form class="space-y-5" @submit.prevent="login">
                        <label for="email" type="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Email
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="email" type="email" for="email" name="email" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400">
                        <label for="password" type="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Katasandi
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input v-model="password" type="current-password" name="password" class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400">
                            <div class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                                <Icon icon="mdi:eye" />
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <label for="stayLogin" class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none">
                            <div class="relative">
                                <input type="checkbox" class="sr-only">
                                <div class="bg-transparent border-gray-300 mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"></div>
                            </div>
                            Biarkan tetap login
                            </label>
                            <div class="text-sm text-blue-500 hover:text-blue-600">
                                <a href="">Lupa katasandi?</a>
                            </div>
                        </div>
                        <button type="submit" :disabled="loading" class="flex items-center justify-center cursor-pointer w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">
                            Login
                        </button>
                        <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
                    </form>
                    <!-- <div class="relative py-3 sm:py-5">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-200"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="p-2 text-gray-400 bg-white sm:px-5 sm:py-2">Atau</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-3 sm:gap-5">
                        <button class="cursor-pointer inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800">
                            <Icon icon="mdi:google" />
                        </button>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { supabase } from '@/lib/supabase'
    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    const login = async () => {
        error.value = ''

        if (!email.value || !password.value) {
            error.value = 'Email dan katasandi wajib diisi'
            return
        }

        try {
            loading.value = true

            const { data, error: err } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })

            if (err) {
                error.value = err.message
                return
            }

            if (data.session) {
                await router.push('/')
            }

            } catch (e: any) {
                error.value = 'Terjadi kesalahan saat login'
            } finally {
                loading.value = false
            }
        }
</script>