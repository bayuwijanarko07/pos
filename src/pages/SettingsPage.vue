<template>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Profil Pengguna</h2>
    </div>
    <Card class="p-5 md:p-6 space-y-2">
        <div class="mb-5 text-lg font-semibold text-gray-800 lg:mb-7">Informasi Pribadi</div>
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl lg:p-6">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div class="grid grid-cols-1 gap-4">
                    <div class="flex items-center gap-4">
                        <img v-if="userStore.profile?.avatar_url"
                            :src="userStore.profile.avatar_url"
                            alt="avatar"
                            class="w-16 h-16 rounded-full object-cover"
                        />
                        <div v-else
                            class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                            <Icon icon="mdi:user" class="text-2xl"/>
                        </div>
                    </div>
                    <!-- <FieldImage @uploaded="handleAvatarUpdate" /> -->
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Nama</p>
                        <p class="text-sm font-medium text-gray-800">{{ userStore.profile?.full_name || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Email</p>
                        <p class="text-sm font-medium text-gray-800">{{ userStore.profile?.email || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Telepon</p>
                        <p class="text-sm font-medium text-gray-800">{{ userStore.profile?.phone || '-' }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Di Buat Pada</p>
                        <p class="text-sm font-medium text-gray-800">{{ formatDateTime(userStore.profile?.created_at ?? undefined) }}</p>
                    </div>
                    <div>
                        <p class="mb-2 text-xs leading-normal text-gray-500">Role</p>
                        <p class="text-sm font-medium text-gray-800">
                            {{ userStore.profile?.roles?.join(', ') || '-' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <button @click="logout" class="flex items-center justify-center cursor-pointer w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">Logout</button>
    </Card>
</template>
<script setup lang="ts">
    import { supabase } from '@/lib/supabase'
    import { formatDateTime } from '@/utils/formatDate'
    // import FieldImage from '@/components/FieldImage.vue'
    import { useUserStore } from '@/stores/user'

    const router = useRouter()
    const userStore = useUserStore()

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // const handleAvatarUpdate = (url: string) => {
    //     if (user.value) {
    //         user.value.avatar_url = url
    //     }
    // }

    onMounted(() => {
        userStore.fetchUser()
        userStore.initAuthListener()
    })

</script>