<script lang="ts" setup>
import { Toaster } from 'vue-sonner';

</script>
<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <Toaster position="top-center" :duration="2000" rich-colors />
    <NuxtPage />
  </NuxtLayout>
</template>
