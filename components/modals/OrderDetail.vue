<script lang="ts" setup>
import toRupiah from '@develoka/angka-rupiah-js'

const props = defineProps<{
  orderId: number
}>()
const emit = defineEmits(['close'])
const orderDetail = ref()

async function getData() {
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/orders/' + props.orderId, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    alert(result.error.value.message)
    return
  }

  orderDetail.value = (result.data.value as any).data
}

onMounted(async () => {
  await getData()

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') emit('close')
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', (e) => {
    if (e.key === 'Escape') emit('close')
  })
})
</script>

<template>
  <ModalsBaseModal title="Order Detail" @close="$emit('close')">
    <div class="custom-modal__body">
      <!-- Customer -->
      <div class="fw-bold text-sm mb-2">Customer:</div>
      <div class="fs-5 mb-3" v-if="orderDetail">
        {{ orderDetail.customer.name }}
      </div>
      <div class="placeholder-glow" v-else>
        <div class="placeholder" style="width: 100%; height: 30px;"></div>
      </div>

      <hr />

      <!-- Order Items -->
      <div class="fw-bold text-sm mb-2">Order Items:</div>
      <div class="card bg-secondary mb-3" style="width: 100%" v-for="item in orderDetail.order_items"
        v-if="orderDetail">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-center gap-4">
            <div>
              <img :src="item.book.cover_image" onerror="this.onerror=null; this.src='/fallback_image.jpg'"
                :alt="`${item.book.title}'s Cover Image`" style="max-height: 80px" v-if="item.book.cover_image" />
              <div v-else class="bg-light d-flex justify-content-center align-items-center"
                style="width: 53px; max-height: 80px; height: 80px">
                <Icon name="mdi:book" class="text-black-50" />
              </div>
            </div>
            <div style="flex-grow: 1">
              <h4 class="card-title text-lg">{{ item.book.title }}</h4>
              <div>
                <ul style="margin: 0 !important; padding: 0 !important">
                  <li class="d-flex justify-content-between align-items-center text-sm mb-2">
                    <div style="font-weight: 500">Qty</div>
                    <div>{{ item.qty }}</div>
                  </li>
                  <li class="d-flex justify-content-between align-items-center text-sm">
                    <div style="font-weight: 500">Item Price</div>
                    <div class="text-primary fw-bold">
                      {{ toRupiah(item.item_price, { floatingPoint: 0 }) }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton Order Items -->
      <div class="placeholder-glow" v-else>
        <div class="placeholder" style="width: 100%; height: 120px" v-for="n in 3"></div>
      </div>

      <div class="d-flex align-items-center justify-content-between" v-if="orderDetail">
        <div class="fs-6">Total Amount</div>
        <div class="fs-6 text-success fw-bold">
          {{ toRupiah(orderDetail.total_amount, { floatingPoint: 0 }) }}
        </div>
      </div>

      <!-- Skeleton Total Amount -->
      <div class="placeholder-glow" v-else>
        <div class="placeholder" style="width: 100%; height: 24px"></div>
      </div>
    </div>
  </ModalsBaseModal>
</template>
