<script setup lang="ts">
import dayjs from 'dayjs'
import toRupiah from '@develoka/angka-rupiah-js'

const route = useRoute()
const author = ref<Author>()
const books = ref()
const errorMsg = ref('')

useHead({
  title: `Author · Garadia`,
})

definePageMeta({
  middleware: ['public-or-not-admin'],
})

async function getAuthor() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/authors/${route.params.authorSlug}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  author.value = (result.data.value as { message: string; data: any }).data as any

  books.value = (result.data.value as any).data.books
}

onMounted(async () => {
  await getAuthor()
})
</script>

<template>
  <div id="author-detail-page">
    <main class="container" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="text-muted text-center">Author</div>
      <div class="fw-bold fs-4 text-center mt-2">{{ author?.name }}</div>
      <div class="text-center mt-2">
        🗓️ {{ dayjs(author?.dob, 'YYYY-MM-DD').format('MMMM DD YYYY') }} | 🌍
        {{ author?.nationality }}
      </div>

      <div class="d-flex flex-wrap gap-3 justify-content-center mt-4">
        <NuxtLink
          v-if="books"
          v-for="(book, i) in books"
          style="width: 265px; height: 330px; text-decoration: none"
          :to="`/books/${book.slug}`"
          :key="i"
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

            <div class="card-body text-center d-flex flex-column justify-content-center gap-2">
              <div class="text-muted line-clamp-1">by {{ book.author ? book.author.name : 'Unknown' }}</div>
              <div class="fw-bold line-clamp-1">{{ book.title }}</div>
              <div class="fw-bold text-success">
                {{ toRupiah(book.price, { floatingPoint: 0 }) }}
              </div>
            </div>
          </div>
        </NuxtLink>

        <div
          v-if="!books"
          v-for="(n, i) in 20"
          :key="i"
          style="width: 265px; height: 330px"
          class="skeleton-box rounded"
        ></div>
      </div>
    </main>
  </div>
</template>
