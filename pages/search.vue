<script lang="ts" setup>
definePageMeta({
  middleware: ['public-or-not-admin'],
})

const route = useRoute()
const router = useRouter()
const errorMsg = ref('')
const loading = ref(true)

useHead({
  title: `${route.query.q} · Search`,
})

const data = ref<any>()
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

async function getBooks() {
  if (!route.query.q) return loading.value = false

  loading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/books/search`, {
    headers: {
      Accept: 'application/json',
    },
    query: {
      ...route.query
    }
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  data.value = (result.data.value as any).data
  paginationInfo.value = {
    currentPage: (result.data.value as any).data.current_page,
    count: (result.data.value as any).data.count,
    from: (result.data.value as any).data.from,
    to: (result.data.value as any).data.to,
    total: (result.data.value as any).data.total,
    hasNextPage: (result.data.value as any).data.next_page_url !== null,
    hasPrevPage: (result.data.value as any).data.next_page_url !== null,
    pages: (result.data.value as any).data.links.slice(1, -1),
    lastPage: (result.data.value as any).data.last_page
  }

  loading.value = false
}

function re(anotherParam: Record<string, string | number>) {
  router.replace({
    path: '/search',
    query: {
      ...route.query,
      ...anotherParam
    }
  })
}

onMounted(async () => {
  await getBooks()

  router.afterEach(async () => {
    await getBooks()
  })
})
</script>

<template>
  <div id="search-result-page">
    <main class="container d-flex flex-column gap-5" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="text-center" v-if="!loading && !data && !!$route.query.q">
        <h5>Start searching for a book by typing the keyword in the search box above</h5>
      </div>

      <div v-if="!!$route.query.q">
        <div class="text-center text-muted">Search result for</div>
        <div class="text-center fw-bold fs-4">
          {{ $route.query.q }}
        </div>
      </div>

      <div class="d-flex flex-column" v-if="!!$route.query.q">
        <div style="align-self: end;" class="d-flex gap-1">
          <select class="form-select form-select-sm" aria-label="Default select example"
            @change="(e) => re({ sortBy: (e.target as any)!.value })" :value="$route.query.sortBy ?? 'title'">
            <option value="title" selected>Book title</option>
            <option value="author_name">Author name</option>
            <option value="price">Price</option>
          </select>

          <button type="button" class="btn btn-secondary btn-sm"
            @click="re({ sortDirection: $route.query.sortDirection === 'asc' ? 'desc' : 'asc' })">
            <Icon name="mdi:sort-ascending"
              v-if="!$route.query.sortDirection || $route.query.sortDirection === 'asc'" />
            <Icon name="mdi:sort-descending" v-else />
          </button>
        </div>
        <div class="d-flex flex-wrap gap-3 justify-content-center mt-4">
          <BookCard v-if="data" v-for="book in data.data" :book="book" />

          <div class="placeholder-glow d-flex flex-wrap gap-3 justify-content-center" v-if="!data && loading">
            <div v-for="n in 5" style="width: 265px; height: 330px" class="placeholder rounded-2">
            </div>
          </div>

          <div v-if="data && !data.data.length && !loading" class="mt-4 text-muted">No Result</div>

        </div>
      </div>

      <Pagination style="align-self: center;" :pagination-info="paginationInfo" :show-skeleton-if="loading && !data" />
    </main>
  </div>
</template>
