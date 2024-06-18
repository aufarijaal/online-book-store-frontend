<script setup lang="ts">
defineProps<{
    htmlLabel: string
    error?: string
    wrapperClass?: string
    loading?: boolean
    id: string
}>()

const model = defineModel()
</script>

<template>
    <div :class="['mb-3', wrapperClass]">
        <label :for="id" class="form-label">{{ htmlLabel }}</label>
        <input class="form-control" :id="id" v-model="model" v-bind="$attrs" />
        <div class="form-text text-danger" :id="`${id}-addon`" v-show="error">{{ error }}</div>
    </div>
</template>
