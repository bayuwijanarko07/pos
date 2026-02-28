<template>
  <div class="flex flex-col gap-1 w-full">
    <span
      v-if="label"
      class="mb-1.5 block text-sm font-medium text-gray-700"
      :class="{ 'opacity-50': disabled }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>

    <div class="flex items-center gap-3">
      <div
        class="relative"
        :class="{ 'cursor-not-allowed opacity-50': disabled, 'cursor-pointer': !disabled }"
        @click="onToggle"
      >
        <input
          :id="id"
          type="checkbox"
          class="sr-only"
          v-model="localValue"
          :disabled="disabled"
        />

        <div
          class="block h-6 w-11 rounded-full transition-colors duration-300"
          :class="localValue ? 'bg-cyan-500' : 'bg-gray-200'"
        />

        <div
          class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-linear"
          :class="localValue ? 'translate-x-5' : 'translate-x-0'"
        />
      </div>

      <span v-if="statusText"
        class="text-sm font-medium transition-colors duration-200"
        :class="localValue ? 'text-cyan-600' : 'text-gray-500'"
      >
        {{ localValue ? activeText : inactiveText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
    interface Props {
        modelValue: boolean
        label?: string
        disabled?: boolean
        id?: string
        required?: boolean
        activeText?: string
        inactiveText?: string
        statusText?:boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        label: 'Status',
        disabled: false,
        id: 'status-toggle',
        activeText: 'Aktif',
        inactiveText: 'Nonaktif'
    })

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void
    }>()


    const localValue = computed({
        get: () => props.modelValue,
        set: (val: boolean) => emit('update:modelValue', val)
    })

    function onToggle() {
        if (props.disabled) return
        localValue.value = !localValue.value
    }
</script>