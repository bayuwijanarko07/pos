<template>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="text-xl font-semibold text-gray-800">Profil Pengguna</div>
    </div>
    <Card class="p-5 md:p-6 space-y-2">
        <div class="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">Informasi Pribadi</div>
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl lg:p-6">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div class="grid grid-cols-1 gap-4">
                    <div class="flex items-center gap-4">
                        <img v-if="user?.avatar_url"
                            :src="user.avatar_url"
                            alt="avatar"
                            class="w-16 h-16 rounded-full object-cover"
                        />
                        <div v-else
                            class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                            <Icon icon="mdi:user" class="text-2xl"/>
                        </div>
                    </div>
                    <FieldImage @uploaded="handleAvatarUpdate" />
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Nama</p>
                        <p class="text-sm font-medium text-gray-800">{{ user?.full_name || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Email</p>
                        <p class="text-sm font-medium text-gray-800">{{ user?.email || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Telepon</p>
                        <p class="text-sm font-medium text-gray-800">{{ user?.phone || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Di Buat Pada</p>
                        <p class="text-sm font-medium text-gray-800">{{ user?.created_at || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>
<script setup lang="ts">
    import { supabase } from '@/lib/supabase'

    import FieldImage from '@/components/FieldImage.vue'

    type Profile = {
        id: string
        full_name: string | null
        phone: string | null
        avatar_url: string | null
        created_at: string
        email?: string | null
    }

    const user = ref<Profile | null>(null)
    const loading = ref(true)

    const fetchProfile = async () => {
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
            loading.value = false
            return
        }

        const authUser = authData.user

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

        if (profileError) {
            console.error(profileError)
        }

        user.value = {
            ...profileData,
            email: authUser.email,
            created_at: authUser.created_at
        }

        loading.value = false
    }

    const handleAvatarUpdate = (url: string) => {
        if (user.value) {
            user.value.avatar_url = url
        }
    }

    onMounted(fetchProfile)
</script>