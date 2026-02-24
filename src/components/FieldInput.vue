<template>
    <label 
        v-if="label"
        :for="id"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="baseClass"
    >
</template>

<script setup lang="ts">
   interface Props {
        label?: string
        modelValue?: string
        type?: string
        placeholder?: string
        disabled?: boolean
        required?: boolean
        id?: string
        class?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'text',
        placeholder: '',
        disabled: false,
        required: false,
        id: undefined,
    })

    const baseClass = "h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400"
</script>