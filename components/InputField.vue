<script setup lang="ts">
defineProps<{
    label: string
    error?: string
    ariaDescribedby: string
    wrapperClass?: string
    loading?: boolean
}>()

const model = defineModel()
</script>

<template>
    <div class="placeholder-glow" v-if="loading">
        <div :class="['placeholder rounded-1', wrapperClass]" style="height: 39px; width: 100%"></div>
    </div>

    <div :class=[wrapperClass] v-else>
        <div class="input-group">
            <span class="input-group-text fw-bold">{{ label }}</span>
            <input :class="{ 'form-control': true, 'border border-danger': error }" v-model="model" v-bind="$attrs"
                :aria-describedby="ariaDescribedby" />
        </div>
        <div :id="ariaDescribedby" class="form-text text-xs text-danger" v-if="error">
            {{ error }}
        </div>
    </div>
</template>
