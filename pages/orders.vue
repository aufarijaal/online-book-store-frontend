<script lang="ts" setup>
import toRupiah from '@develoka/angka-rupiah-js'

const auth = useAuthStore()

definePageMeta({
  middleware: ['authenticated', 'regular-user'],
})

useHead({
  title: `My Orders`,
  script: [
    {
      type: 'text/javascript',
      src: 'https://app.sandbox.midtrans.com/snap/snap.js',
      'data-client-key': 'SB-Mid-client-ZBIk3xOtAcKZf7-v',
    },
  ],
})

const orders = ref()
const errorMsg = ref('')

async function getOrders() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/orders`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  orders.value = (result.data.value as { message: string; data: any }).data
}

async function pay(token: string) {
  window.snap.pay(token)
}

onMounted(async () => {
  await getOrders()
})
</script>
<template>
  <div id="orders-page">
    <main class="container px-3 px-sm-0" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="mb-3 fw-bold fs-5">Your Orders</div>

      <!-- <div class="form-group mb-4" style="width: max-content">
        <label for="selectSortBy" class="form-label">Sort by</label>
        <select class="form-select" id="selectSortBy">
          <option value="payment_status">Payment status</option>
          <option value="total_amount">Total Amount</option>
        </select>
      </div> -->

      <div class="card bg-secondary mb-3 w-100" v-if="orders" v-for="order in orders">
        <div class="card-body">
          <div class="mb-3 d-flex justify-content-between align-items-center">
            <span class="text-muted text-sm">Order ID: #{{ order.id }}</span>
            <span
              :class="[
                'badge',
                order.status === 'unpaid' ? 'bg-warning' : order.status === 'paid' ? 'bg-primary' : 'bg-danger',
              ]"
              >{{ order.status === 'unpaid' ? 'Unpaid' : order.status === 'paid' ? 'Paid' : 'Expired' }}</span
            >
          </div>
          <div>
            <div class="card bg-secondary mb-3 w-100" v-if="order.order_items" v-for="item in order.order_items">
              <div class="card-body">
                <div class="d-flex">
                  <div style="flex-shrink: 0">
                    <NuxtLink :to="`/books/${item.book.slug}`">
                      <img
                        :src="item.book.cover_image"
                        onerror="this.onerror=null; this.src='/fallback_image.jpg'"
                        :alt="`${item.book.title}'s Cover Image`"
                        style="max-height: 80px"
                      />
                    </NuxtLink>
                  </div>
                  <div class="ms-4" style="flex-grow: 1">
                    <NuxtLink
                      :to="`/books/${item.book.slug}`"
                      class="fw-bold"
                      style="text-decoration: none; color: unset"
                      >{{ item.book.title }}</NuxtLink
                    >
                    <div class="d-flex justify-content-between text-sm mt-3">
                      <div>Qty</div>
                      <div>{{ item.qty }}</div>
                    </div>
                    <div class="d-flex justify-content-between text-sm">
                      <div>Item Price</div>
                      <div class="text-primary">
                        {{ toRupiah(item.item_price, { floatingPoint: 0 }) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="d-flex align-items-center justify-content-end gap-2">
            <div>Total Amount:</div>
            <div class="fw-bold text-success">
              {{ toRupiah(order.total_amount, { floatingPoint: 0 }) }}
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-end gap-2 text-xs mt-2">
            <div>Order Date: {{ order.order_date }}</div>
          </div>

          <div class="d-flex align-items-center justify-content-end gap-2 text-xs mt-4">
            <button class="btn btn-success" @click="pay(order.token)" v-if="order.status === 'unpaid'">
              Finish Payment
            </button>

            <button
              disabled
              class="btn btn-primary"
              @click="() => {}"
              v-if="order.status === 'paid' || order.status === 'expired'"
            >
              Reorder
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
