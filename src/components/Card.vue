<template>
    <div
        :class="[
            'rounded-xl bg-white hover:shadow',
            className,
        ]"
    > 
    <slot></slot>
    </div>
</template>
<script setup lang="ts">
    interface Props {
        className?: string
    }

    defineProps<Props>()
</script>
