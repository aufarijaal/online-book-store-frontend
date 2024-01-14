<template>
  <div class="d-inline">
    <svg
      class="arrow-up"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      v-if="order === 'asc'"
    >
      <path fill="currentColor" d="m7 15l5-5l5 5H7Z" />
    </svg>
    <svg
      class="arrow-down"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      v-else
    >
      <path fill="currentColor" d="m7 10l5 5l5-5H7Z" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  order: "asc" | "desc";
}>();
</script>

<style></style>
