<script lang="ts" setup>
import toRupiah from '@develoka/angka-rupiah-js'

const config = useRuntimeConfig()

definePageMeta({
  middleware: ['authenticated', 'regular-user'],
})

useHead({
  title: 'Check Out',
  script: [
    {
      type: 'text/javascript',
      src: config.public.midtransSnapUrl,
      'data-client-key': config.public.midtransClientKey,
    },
  ],
})

const pageData = ref()
const mainStore = useMainStore()
const snapToken = ref('')
const errorMsg = ref('')
const initialLoading = ref(true)

const totalAmount = computed(() => {
  if (!pageData.value.length) return 0

  let t = 0
  for (let i = 0; i < pageData.value.length; i++) {
    t += parseFloat(pageData.value[i].item_price)
  }

  return t
})

async function getCartItems() {
  initialLoading.value = true
  if (!mainStore.idstoCheckout.length) return navigateTo('/carts')

  let s = ''

  for (let i = 0; i < mainStore.idstoCheckout.length; i++) {
    s += `ids[]=${mainStore.idstoCheckout[i]}&`
  }

  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/checkout?${s.slice(0, -1)}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  pageData.value = (result.data.value as { message: string; data: any }).data.cartItems

  snapToken.value = (result.data.value as { message: string; data: any }).data.token

  initialLoading.value = false
}

async function pay() {
  window.snap.pay(snapToken.value)
}

onMounted(async () => {
  await getCartItems()
})
</script>

<template>
  <div id="carts-page">
    <main class="container px-3 px-sm-0" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="mb-4 fw-bold fs-5">Check out</div>

      <div class="mb-2">Items:</div>
      <CardCartInfoItem v-if="pageData" v-for="item in pageData" :cart-info="item" @read-detail="$emit('close')" />

      <div class="placeholder-glow d-flex flex-column gap-2" v-else>
        <div class="placeholder w-100 rounded-1" style="height: 124px" v-for="n in 3"></div>
      </div>

      <div style="height: 60px; width: 100%; position: fixed; bottom: 0; left: 0" class="d-flex">
        <div class="bg-secondary border w-100 container h-100 d-flex align-items-center justify-content-between"
          style="z-index: 10">
          <div>
            <div class="placeholder-glow" v-if="initialLoading">
              <div class="placeholder" style="width: 205px; height: 24px"></div>
            </div>
            <div v-else>
              Total Amount:
              <span class="text-success fw-bold">{{ toRupiah(totalAmount, { floatingPoint: 0 }) }}</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-4">
            <button class="btn btn-primary d-flex align-items-center gap-2" @click="pay" :disabled="initialLoading">
              <Icon name="ri:secure-payment-fill" size="24" />
              <span class="fw-bold">Pay</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
