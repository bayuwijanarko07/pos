<template>
    <div class="flex flex-col gap-1 w-full">
        <label
            v-if="label"
            :for="id"
            class="mb-1.5 block text-sm font-medium text-gray-700"
        >
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative w-full">
            <span
                v-if="prefixIcon"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            >
                <Icon :icon="prefixIcon" />
            </span>

            <select
                :id="id"
                :name="name"
                :value="model ?? ''"
                @change="onChange"
                :disabled="disabled"
                :required="required"
                :class="computedClass"
                :aria-invalid="!!error"
            >

                <option value="" disabled v-if="placeholder">
                    {{ placeholder }}
                </option>

                <option
                    v-for="opt in options"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ opt.label }}
                </option>
            </select>

            <Icon icon="mdi:chevron-up-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"/>

            <span
                v-if="suffixIcon"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            >
                <Icon :icon="suffixIcon" />
            </span>
        </div>

        <p v-if="hint && !error" class="text-xs text-gray-500">
            {{ hint }}
        </p>

        <p v-if="error" class="text-xs text-red-500">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
    interface Option {
        label: string
        value: string | number
    }

    interface Props {
        label?: string
        name?: string
        placeholder?: string
        disabled?: boolean
        required?: boolean
        id?: string
        className?: string
        error?: string
        hint?: string
        prefixIcon?: string
        suffixIcon?: string
        options: Option[]
    }

    const props = withDefaults(defineProps<Props>(), {
        placeholder: 'Pilih opsi',
        disabled: false,
        required: false,
        options: () => [],
    })

    const model = defineModel<string | number | null>()

    const onChange = (e: Event) => {
        const target = e.target as HTMLSelectElement
        model.value = target.value
    }

    const baseClass =
        'w-full rounded-lg bg-transparent py-2 text-sm appearance-none ' +
        'placeholder:text-gray-400 focus:outline-none transition disabled:opacity-50'

    const paddingClass = computed(() => {
        if (props.prefixIcon && props.suffixIcon) return 'pl-10 pr-10'
        if (props.prefixIcon) return 'pl-10 pr-3'
        if (props.suffixIcon) return 'pl-3 pr-10'
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