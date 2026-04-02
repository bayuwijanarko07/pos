<template>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Profil Pengguna</h2>
    </div>
    <Card class="p-5 md:p-6 space-y-2">
        <div class="flex items-center justify-between mb-5 lg:mb-7">
            <div class="text-lg font-semibold text-gray-800">Informasi Pribadi</div>
            <button v-if="!isEditing" @click="startEdit" class="px-3 py-1.5 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">Edit Profil</button>
        </div>
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
                    <FieldImage @uploaded="handleAvatarUpdate" />
                </div>
            </div>
        </div>
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl lg:p-6">
            <div>
                <p class="mb-2 text-xs leading-normal text-gray-500">Nama</p>
                <input v-if="isEditing" v-model="editForm.full_name" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <p v-else class="text-sm font-medium text-gray-800">{{ userStore.profile?.full_name || '-' }}</p>
            </div>
            <div>
                <p class="mb-2 text-xs leading-normal text-gray-500">Email</p>
                <p class="text-sm font-medium text-gray-800">{{ userStore.profile?.email || '-' }}</p>
            </div>
            <div>
                <p class="mb-2 text-xs leading-normal text-gray-500">Telepon</p>
                <input v-if="isEditing" v-model="editForm.phone" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <p v-else class="text-sm font-medium text-gray-800">{{ userStore.profile?.phone || '-' }}</p>
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
        <div v-if="isEditing" class="flex justify-end gap-3 mb-6">
            <button @click="cancelEdit" class="px-4 py-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">Cancel</button>
            <button @click="saveEdit" :disabled="isSaving" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600 disabled:opacity-50">
                <Icon v-if="isSaving" icon="mdi:loading" class="animate-spin" />
                Simpan
            </button>
        </div>
        <button @click="logout" class="flex items-center justify-center cursor-pointer w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600">Logout</button>
    </Card>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import { supabase } from '@/lib/supabase'
    import { formatDateTime } from '@/utils/formatDate'
    import FieldImage from '@/components/FieldImage.vue'
    import { useUserStore } from '@/stores/user'

    const router = useRouter()
    const userStore = useUserStore()

    const isEditing = ref(false)
    const isSaving = ref(false)
    const editForm = ref({
        full_name: '',
        phone: ''
    })

    const startEdit = () => {
        editForm.value.full_name = userStore.profile?.full_name || ''
        editForm.value.phone = userStore.profile?.phone || ''
        isEditing.value = true
    }

    const cancelEdit = () => {
        isEditing.value = false
    }

    const saveEdit = async () => {
        if (!userStore.profile?.id) return
        
        isSaving.value = true
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: editForm.value.full_name,
                phone: editForm.value.phone
            })
            .eq('id', userStore.profile.id)

        isSaving.value = false

        if (!error) {
            await userStore.fetchUser()
            isEditing.value = false
        } else {
            console.error('Error updating profile:', error)
            alert('Gagal mengupdate profil')
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleAvatarUpdate = (url: string) => {
        if (userStore.profile) {
            userStore.profile.avatar_url = url
        } else {
            userStore.fetchUser()
        }
    }

    onMounted(() => {
        userStore.fetchUser()
        userStore.initAuthListener()
    })

</script>