<script lang="ts" setup>
import type { NuxtError } from "#app";
const auth = useAuthStore();
const router = useRouter();

const props = defineProps({
  error: Object as () => NuxtError,
});

useHead({
  title: "Oops..",
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="error-container">
          <div class="error-code">{{ error?.statusCode }}</div>
          <div class="error-message">{{ error?.message }}</div>
          <a
            class="btn btn-primary btn-back"
            :href="auth.user?.is_admin === '1' ? '/admin' : '/'"
            >Back to home</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body,
html {
  height: 100%;
}
body {
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-container {
  text-align: center;
}
.error-code {
  font-size: 15rem;
  font-weight: bold;
  color: #dc3545;
}
.error-message {
  font-size: 2rem;
  color: #6c757d;
}
.btn-back {
  margin-top: 20px;
}
</style>
