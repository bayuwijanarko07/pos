<template>
    <div class="flex flex-col gap-1 w-full">
        <label
            v-if="label"
            :for="id"
            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        >
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative w-full">
            <span
                v-if="prefixIcon"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
                <Icon :icon="prefixIcon" />
            </span>

            <component
                :is="isTextarea ? 'textarea' : 'input'"
                :id="id"
                v-model="model"
                :type="inputType"
                :rows="rows"
                :placeholder="placeholder"
                :disabled="disabled"
                :autocomplete="autocomplete"
                :class="computedClass"
                :aria-invalid="!!error"
            />

            <button
                v-if="isPassword"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                @click="togglePassword"
            >
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
            </button>

            <span
                v-else-if="suffixIcon"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
                <Icon :icon="suffixIcon" />
            </span>

            <p v-if="hint && !error" class="text-xs text-gray-500">
            {{ hint }}
            </p>

            <p v-if="error" class="text-xs text-red-500">
            {{ error }}
            </p>
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
        textarea?: boolean
        rows?: number
        error?: string
        hint?: string
        prefixIcon?: string
        suffixIcon?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'text',
        placeholder: '',
        disabled: false,
        required: false,
        password: false,
        textarea: false,
        rows: 3,
    })

    const model = defineModel<string | number | null>()

    const showPassword = ref(false)

    const isTextarea = computed(() => props.textarea)

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
        'w-full rounded-lg bg-transparent py-2 text-sm ' +
        'placeholder:text-gray-400 focus:outline-none transition disabled:opacity-50'

    const paddingClass = computed(() => {
        if (props.prefixIcon && (props.suffixIcon || isPassword.value)) {
            return 'pl-10 pr-10'
        }
        if (props.prefixIcon) return 'pl-10 pr-3'
        if (props.suffixIcon || isPassword.value) return 'pl-3 pr-10'
        return 'pl-3 pr-3'
    })

    const stateClass = computed(() => {
    if (props.error) {
        return 'border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
    }
    return 'border border-zinc-200 text-zinc-800 ' +
            'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
    })

    const computedClass = computed(() => [
        baseClass,
        paddingClass.value,
        stateClass.value,
        props.className,
    ])
</script>