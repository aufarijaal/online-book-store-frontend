<script lang="ts" setup>
defineProps<{ address: Address }>()
defineEmits(['edit', 'delete'])
</script>

<template>
  <li class="address-item list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center">
    <div class="ms-2 me-auto w-100 mb-3 mb-md-0" style="flex-grow: 1">
      <span class="badge bg-primary rounded-pill mb-2" v-if="address.is_active">Active</span>
      <div class="fw-bold">{{ address.name }}</div>
      <div style="max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        <span class="text-xs">{{ address.full_address }}</span>
      </div>
    </div>

    <div class="address-actions p-2 border-0 border-md-start ms-2 d-flex gap-2 align-items-center"
      style="flex-shrink: 0">
      <button class="btn btn-light btn-sm" @click="$emit('edit')">Edit</button>
      <button class="btn btn-danger btn-sm" @click="$emit('delete')">Delete</button>
    </div>
  </li>
</template>

<style></style>
