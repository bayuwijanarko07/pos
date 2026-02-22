<template>
    <input type="file" accept="image/*" @change="onFileChange" />
</template>
<script setup lang="ts">

    import { supabase } from '@/lib/supabase'

    const emit = defineEmits<{
    (e: 'uploaded', url: string): void
    }>()

    const avatarUrl = ref<string | null>(null)

    const uploadAvatar = async (file: File) => {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) throw new Error('Not authenticated')

    const filename = file.name
    const filePath = `${user.id}/${filename}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    await supabase
        .from('profiles')
        .upsert({
        id: user.id,
        avatar_url: publicUrl
        })

    return publicUrl
    }

    const onFileChange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const url = await uploadAvatar(file)
        avatarUrl.value = url

        emit('uploaded', url)
    }
</script>