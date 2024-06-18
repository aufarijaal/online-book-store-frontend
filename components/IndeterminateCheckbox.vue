<script setup lang="ts">
const props = defineProps<{
    indeterminate: boolean
    checked?: boolean
    onChange?: (event: unknown) => void
    disabled?: boolean
}>()

const { indeterminate, checked, onChange, disabled } = toRefs(props)

const inputRef = ref<any>(null)
</script>

<template>
    <input class="form-check-input cursor-pointer" type="checkbox" ref="inputRef" :indeterminate="indeterminate"
        v-bind="$attrs" :checked="checked" @change="onChange" :disabled="disabled" />
</template>
