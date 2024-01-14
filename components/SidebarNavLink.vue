<script lang="ts" setup></script>

<template>
  <NuxtLink
    class="nav-link text-white d-flex align-items-center gap-3"
    style="cursor: pointer"
    v-bind="$attrs"
  >
    <slot />
  </NuxtLink>
</template>

<style></style>
