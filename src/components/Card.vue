<template>
    <div
        :class="[
            'rounded bg-white hover:shadow',
            className,
        ]"
    >
        <div class="p-4">
            <div class="space-y-3">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    interface Props {
        className?: string
    }

    defineProps<Props>()
</script>
