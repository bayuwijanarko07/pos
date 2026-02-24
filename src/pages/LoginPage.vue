<template>
    <div class="z-1">
        <div class="relative flex lg:flex-row w-full h-screen justify-center flex-col">
            <div class="lg:w-1/2 w-full h-full lg:grid items-center justify-center hidden relative">
                <img src="/src/assets/bg-1.png" alt="bg-1.png" class="object-fill">
            </div>
            <div class="items-center justify-center flex flex-col lg:w-1/2 bg-gray-100 p-10">
                <div class="max-w-md w-full bg-white rounded-xl shadow p-10">
                    <div class="mt-5 sm:mb-6">
                        <h1 class="mb-2 font-semibold text-gray-800 text-3xl">Login</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400"> Input email dan katasandi untuk login!</p>
                    </div>
                    <form class="space-y-5" @submit.prevent="handleLogin">
                        <FieldInput 
                            v-model="email"
                            label="Email"
                            type="email"
                            autocomplete="email"
                            placeholder="Masukkan email"
                            required
                            :disabled="loading"
                        />
                         <FieldInput 
                            v-model="password"
                            label="Katasandi"
                            type="password"
                            autocomplete="current-password"
                            placeholder="Masukkan Password"
                            required
                            password
                            :disabled="loading"
                        />
                        <div class="flex items-center justify-center">
                            <div class="text-sm text-cyan-500 hover:text-cyan-600">
                                <a href="">Lupa katasandi?</a>
                            </div>
                        </div>
                        <button type="submit"
                                :disabled="!canSubmit"                       
                                class="flex items-center justify-center cursor-pointer 
                                w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-cyan-500 shadow-theme-xs hover:bg-cyan-600">
                            <span v-if="!loading">Masuk</span>
                            <span v-else class="flex items-center gap-2">
                            <Icon icon="mdi:loading" class="w-4 h-4 animate-spin" />
                                Menunggu....
                            </span>
                        </button>
                        <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
                    </form>
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

    const canSubmit = computed(() => {
        return !loading.value
    })

    const handleLogin = async () => {
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