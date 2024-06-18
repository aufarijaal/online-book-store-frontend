<script lang="ts" setup>
definePageMeta({
  middleware: ['public-or-not-admin'],
})

useHead({
  title: 'Garadia',
})

const bookResponse = ref<any>()
const errorMsg = ref('')

async function getBooks() {
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/books?forHomePage=true', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  bookResponse.value = result.data.value as BookResponse
}

onMounted(async () => {
  await getBooks()
})
</script>

<template>
  <div id="homepage" class="pt-5">
    <main class="d-flex flex-column">
      <section class="py-5 text-center container">
        <!-- Alert -->
        <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-bold">Garadia</h1>
            <p class="lead text-muted">
              Enter a World of Books and Explore Our Online Bookstore for Endless Reading Pleasure
            </p>
          </div>

          <Carousel :images="[
            '/carousel-1.png',
            '/carousel-2.jpg',
            '/carousel-3.jpg',
          ]" :images-styles="{ height: '400px', objectFit: 'cover' }" />
        </div>
      </section>

      <div class="new-arrivals py-5 bg-light">
        <div class="container">
          <div class="fs-4 fw-bold mb-3 text-center">Recommended for you</div>
          <div class="d-flex flex-wrap gap-3 justify-content-center">
            <BookCard v-if="bookResponse" v-for="book in bookResponse.data" :book="book" />

            <div v-if="!bookResponse" class="placeholder-glow d-flex flex-wrap gap-3 justify-content-center">
              <div v-for="n in 20" style="width: 265px; height: 330px" class="placeholder rounded-1">
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
