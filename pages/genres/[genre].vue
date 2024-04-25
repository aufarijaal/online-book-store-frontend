<script lang="ts" setup>
import { titleCase } from "title-case";
import toRupiah from "@develoka/angka-rupiah-js";

const auth = useAuthStore();

definePageMeta({
  middleware: ["public-or-not-admin"],
});

const route = useRoute();
const genre = titleCase(route.params.genre as string).replace("-", " ");
const errorMsg = ref("");

useHead({
  title: `${genre} · Genre`,
});

const bookResponse = ref<any>();

async function getBooks() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/genres/get-books-by-genre-slug/${route.params.genre}`,
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

  bookResponse.value = result.data.value as BookResponse;
}

onMounted(async () => {
  await getBooks();
});
</script>

<template>
  <div id="genre-page">
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

      <div class="text-center text-muted">Genre</div>
      <div class="text-center fw-bold fs-4">
        {{ genre }}
      </div>

      <div class="d-flex flex-wrap gap-3 justify-content-center mt-4">
        <NuxtLink
          v-if="bookResponse"
          v-for="book in bookResponse.data"
          style="width: 265px; height: 330px; text-decoration: none"
          :to="`/books/${book.slug}`"
        >
          <div class="card shadow-sm p-2">
            <img
              :src="
                book.cover_image ??
                'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
              "
              :style="{
                height: '200px',
                width: '100%',
                objectFit: 'contain',
              }"
            />

            <div
              class="card-body text-center d-flex flex-column justify-content-center gap-2"
            >
              <div class="text-muted line-clamp-1">
                by {{ book.author ? book.author.name : "Unknown" }}
              </div>
              <div class="fw-bold line-clamp-1">{{ book.title }}</div>
              <div class="fw-bold text-success">
                {{ toRupiah(book.price, { floatingPoint: 0 }) }}
              </div>
            </div>
          </div>
        </NuxtLink>

        <div
          v-if="!bookResponse"
          v-for="n in 20"
          style="width: 265px; height: 330px"
          class="skeleton-box rounded"
        ></div>
      </div>
    </main>
  </div>
</template>

<style></style>
