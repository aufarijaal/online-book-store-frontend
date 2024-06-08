<script lang="ts" setup>
withDefaults(
  defineProps<{
    type: string
    title: string
    describedBy: string
    errorMessages?: string[]
    id: string
  }>(),
  {
    type: 'text',
  },
)
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ title }}</label>
    <input :type="type" class="form-control" :id="id" :aria-describedby="describedBy" required />
    <div :id="describedBy" class="form-text text-xs text-danger" v-if="errorMessages" v-for="message in errorMessages">
      {{ message }}
    </div>
  </div>
</template>
