<script setup lang="ts">
const emits = defineEmits(['close'])
const props = defineProps<{
    title: string
}>()
</script>
<template>
    <div class="custom-modal-backdrop">
        <div class="custom-modal">
            <div class="custom-modal__header">
                <h6 class="fw-bold">{{ title }}</h6>
                <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
            </div>

            <div class="custom-modal__body p-2" style="max-height: 500px; overflow-y: auto">
                <slot />
            </div>

            <!-- Footer -->
            <div class="custom-modal__footer">
                <button type="button" class="btn btn-light btn-sm" @click="$emit('close')">Cancel</button>
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>
