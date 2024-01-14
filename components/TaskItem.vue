<script lang="ts" setup>
import type { Task } from '~/types/types'

defineProps<{
  task: Task
}>()
</script>

<template>
  <div class="task-item d-flex justify-content-between align-items-center px-3 border-bottom" style="height: 3rem">
    <div class="text-muted">
      {{ task.name }}
    </div>
    <check-icon class="text-muted" style="width: 32px; height: 32px" v-show="!task.done" />
    <check-icon-solid class="text-success" style="width: 32px; height: 32px" v-show="task.done" />
  </div>
</template>
