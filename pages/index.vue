<script lang="ts" setup>
import toRupiah from "@develoka/angka-rupiah-js";

definePageMeta({
  middleware: ["public-or-not-admin"],
});

useHead({
  title: "Garadia",
});

const bookResponse = ref<any>();
const errorMsg = ref("");

async function getBooks() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch("/api/v1/books?forHomePage=true", {
    headers: {
      Accept: "application/json",
    },
  });

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
  <div id="homepage" class="pt-5">
    <main class="d-flex flex-column">
      <section class="py-5 text-center container">
        <!-- Alert -->
        <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
          ></button>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-bold">Garadia</h1>
            <p class="lead text-muted">
              Enter a World of Books and Explore Our Online Bookstore for
              Endless Reading Pleasure
            </p>
          </div>
        </div>
      </section>

      <div class="new-arrivals py-5 bg-light">
        <div class="container">
          <div class="fs-4 fw-bold mb-3 text-center">Recommended for you</div>
          <div class="d-flex flex-wrap gap-3 justify-content-center">
            <NuxtLink
              v-if="bookResponse"
              v-for="book in bookResponse.data"
              style="width: 265px; height: 330px; text-decoration: none"
              :to="`/books/${book.slug}`"
            >
              <div class="card shadow-sm p-2">
                <img
                  :src="book.cover_image"
                  onerror="this.onerror=null; this.src='/fallback_image.jpg'"
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
        </div>
      </div>
    </main>
  </div>
</template>
