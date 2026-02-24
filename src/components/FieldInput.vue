<template>
    <div class="flex flex-col gap-1">
        <label
            v-if="label"
            :for="id"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        >
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative">
            <input
                :id="id"
                v-model="model"
                :type="inputType"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :autocomplete="autocomplete"
            />

            <button
                v-if="isPassword"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                @click="togglePassword"
            >
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        label?: string
        type?: string
        placeholder?: string
        disabled?: boolean
        required?: boolean
        id?: string
        className?: string
        autocomplete?: string
        password?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'text',
        placeholder: '',
        disabled: false,
        required: false,
        password: false,
    })

    const model = defineModel<string>()

    const showPassword = ref(false)

    const isPassword = computed(() => {
        return props.password || props.type === 'password'
    })

    const inputType = computed(() => {
        if (isPassword.value) {
            return showPassword.value ? 'text' : 'password'
        }
        return props.type
    })

    const togglePassword = () => {
        showPassword.value = !showPassword.value
    }

    const baseClass =
        'w-full rounded-lg bg-transparent py-2 pl-3 pr-10 text-sm ' +
        'placeholder:text-gray-400 focus:outline-none transition disabled:opacity-50'

    const normalClass =
        'border border-zinc-200 text-zinc-800 ' +
        'dark:border-zinc-800' +
        'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'

    const inputClass = computed(() => [
        baseClass,
        normalClass,
        props.className,
    ])
</script>