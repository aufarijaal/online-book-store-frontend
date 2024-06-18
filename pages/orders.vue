<script lang="ts" setup>
const config = useRuntimeConfig()

definePageMeta({
  middleware: ['authenticated', 'regular-user'],
})

useHead({
  title: `My Orders`,
  script: [
    {
      type: 'text/javascript',
      src: config.public.midtransSnapUrl,
      'data-client-key': config.public.midtransClientKey,
    },
  ],
})

const orders = ref()
const errorMsg = ref('')
const loading = ref(true)
const route = useRoute()
const router = useRouter()
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

async function getOrders() {
  loading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/orders`, {
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

  orders.value = (result.data.value as { message: string; data: any }).data.data
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
    path: route.path,
    query: {
      ...route.query,
      ...anotherParam
    }
  })
}

async function pay(token: string) {
  window.snap.pay(token)
}

onMounted(async () => {
  await getOrders()

  router.afterEach(async () => {
    await getOrders()
  })
})
</script>
<template>
  <div id="orders-page">
    <main class="container px-3 px-sm-0 d-flex flex-column" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="mb-3 fw-bold fs-5">Your Orders</div>

      <div class="d-flex gap-1 mb-3" style="width: max-content; align-self: end;">
        <select class="form-select form-select-sm" aria-label="Default select example"
          @change="(e) => re({ sortBy: (e.target as any)!.value })" :value="$route.query.sortBy ?? 'newest'">
          <option value="newest" selected>Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div class="placeholder-glow mb-3 w-100 d-flex flex-column gap-2" v-if="!orders && loading">
        <div class="placeholder rounded-1" v-for="n in 4" style="height: 326px"></div>
      </div>

      <OrderCard v-if="orders && !loading" v-for="order in orders" :order="order"
        @pay-if-unpaid="(token) => pay(token)" />

      <div class="text-black-50 text-center my-4" v-if="!loading && orders && !orders.length">
        You don't have any orders yet
      </div>

      <Pagination style="align-self: center;" :pagination-info="paginationInfo"
        :show-skeleton-if="loading && !orders" />
    </main>
  </div>
</template>

<style></style>
