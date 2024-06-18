<script setup lang="ts">
defineProps<{
    label: string
    error?: string
    ariaDescribedby: string
    id?: string
}>()

const model = defineModel()
</script>

<template>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="model" :id="id" :aria-describedby="ariaDescribedby">
        <label class="form-check-label" :for="id">
            {{ label }}
        </label>
        <div :id="ariaDescribedby" class="form-text text-xs text-danger" v-if="error">
            {{ error }}
        </div>
    </div>
</template>
