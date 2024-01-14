<script setup lang="ts">
import dayjs from "dayjs";

const route = useRoute();
const author = ref<Author>();
const errorMsg = ref("");

async function getAuthor() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/authors/${route.params.authorSlug}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message;
    return;
  }

  author.value = (result.data.value as { message: string; data: any })
    .data as any;
}

onMounted(async () => {
  await getAuthor();
});
</script>

<template>
  <div id="author-detail-page">
    <main class="container" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="text-muted text-center">Author</div>
      <div class="fw-bold fs-4 text-center mt-2">{{ author?.name }}</div>
      <div class="text-center mt-2">
        🗓️ {{ dayjs(author?.dob, "YYYY-MM-DD").format("MMMM DD YYYY") }} | 🌍
        {{ author?.nationality }}
      </div>
    </main>
  </div>
</template>
