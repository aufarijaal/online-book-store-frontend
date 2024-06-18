<script setup lang="ts">
import dayjs from 'dayjs'

useHead({
  title: `Author · Garadia`,
})

definePageMeta({
  middleware: ['public-or-not-admin'],
})

const data = ref()
const errorMsg = ref('')
const loading = ref(true)
const router = useRouter()
const route = useRoute()
const paginationInfo = ref<PaginationInfo>({
  currentPage: 0,
  count: 0,
  from: 0,
  to: 0,
  total: 0,
  hasNextPage: false,
  hasPrevPage: false,
  pages: [],
  lastPage: 0
})

async function getData(query?: any) {
  loading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/authors/${route.params.authorSlug}`, {
    headers: {
      Accept: 'application/json',
    },
    query
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  data.value = (result.data.value as any).data
  paginationInfo.value = {
    currentPage: (result.data.value as any).data.books.current_page,
    count: (result.data.value as any).data.books.count,
    from: (result.data.value as any).data.books.from,
    to: (result.data.value as any).data.books.to,
    total: (result.data.value as any).data.books.total,
    hasNextPage: (result.data.value as any).data.books.next_page_url !== null,
    hasPrevPage: (result.data.value as any).data.books.next_page_url !== null,
    pages: (result.data.value as any).data.books.links.slice(1, -1),
    lastPage: (result.data.value as any).data.books.last_page
  }

  loading.value = false
}

onMounted(async () => {
  await getData(route.query)

  router.afterEach(async (to, from, failure) => {
    await getData(to.query)
  })
})
</script>

<template>
  <div id="author-detail-page">
    <main class="container d-flex flex-column gap-5" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="placeholder-glow d-flex flex-column gap-1 align-items-center" v-if="loading && !data">
        <div class="placeholder" style="height: 24px; width: 100px;"></div>
        <div class="placeholder" style="height: 24px; width: 150px;"></div>
      </div>

      <div v-else>
        <div class="text-muted text-center">Author</div>
        <div class="fw-bold fs-4 text-center mt-2">{{ data?.author.name }}</div>
        <div class="text-center mt-2">
          🗓️ {{ dayjs(data?.author.dob, 'YYYY-MM-DD').format('MMMM DD YYYY') }} | 🌍
          {{ data.author?.nationality }}
        </div>
      </div>

      <div class="d-flex flex-wrap gap-3 justify-content-center mt-4" v-if="!loading && data">
        <BookCard v-for="(book, i) in data.books.data" :book="book" :key="i" />
      </div>

      <div class="placeholder-glow d-flex flex-wrap gap-3 justify-content-center mt-4" v-else>
        <div v-for="(n, i) in 10" :key="i" style="width: 265px; height: 330px" class="placeholder rounded-1"></div>
      </div>

      <Pagination style="align-self: center;" :pagination-info="paginationInfo" :show-skeleton-if="loading && !data" />
    </main>
  </div>
</template>
