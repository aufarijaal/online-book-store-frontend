<script lang="ts" setup>
import toRupiah from '@develoka/angka-rupiah-js'
import dayjs from 'dayjs'

const emits = defineEmits(['refresh', 'close'])

const errorMsg = ref<{
  name: string[]
  description: string[]
}>()

const orderItems = ref<{ book: Book; qty: number; item_price: number }[]>([])
const qtyCount = ref(1)
const books = ref<Book[]>()
const selectedBook = ref<Book>()
const selectedCustomer = ref<User>()
const customers = ref<Pick<User, 'id' | 'name'>[]>()

const itemPricePreview = computed(() => {
  if (selectedBook.value && books.value) {
    return selectedBook.value.price * qtyCount.value
  } else {
    return 0
  }
})

const totalAmount = computed(() => {
  if (selectedBook.value && books.value) {
    return orderItems.value.reduce((acc, obj) => acc + obj.item_price, 0)
  } else {
    return 0
  }
})

function addOrderItem() {
  if (selectedBook.value) {
    const existingItemIndex = orderItems.value.findIndex((item) => item.book.id === selectedBook.value?.id)

    if (existingItemIndex !== -1) {
      orderItems.value[existingItemIndex].qty += qtyCount.value
      orderItems.value[existingItemIndex].item_price += qtyCount.value * selectedBook.value.price
    } else {
      orderItems.value.push({
        book: toRaw(selectedBook.value),
        qty: qtyCount.value,
        item_price: qtyCount.value * selectedBook.value.price,
      })
    }

    qtyCount.value = 1
  }
}

function removeOrderItem(index: number) {
  orderItems.value = orderItems.value.filter((item, i) => i !== index)
}

async function getBooks() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/admin/books?forDropdown=true', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    alert(result.error.value.message)
    return
  }

  books.value = (result.data.value as any).data
}

async function getCustomers() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/admin/customers?forDropdown=true', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    alert(result.error.value?.message)
    return
  }

  customers.value = (result.data.value as any).data as Author[]
}

async function submit() {
  await useApiFetch('/sanctum/csrf-cookie')

  const form = {
    user_id: selectedCustomer.value?.id,
    order_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    total_amount: totalAmount.value,
    order_items: orderItems.value.map((item) => {
      return {
        book: toRaw(item.book),
        qty: item.qty,
        item_price: item.item_price,
      }
    }),
  }

  const result = await useApiFetch('/api/v1/admin/orders', {
    method: 'POST',
    body: form,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    alert(result.error.value.message)
    errorMsg.value = result.error.value?.data.errors
    return
  }
  emits('refresh')
  emits('close')
}

function incrementQty() {
  qtyCount.value = qtyCount.value + 1
}

function decrementQty() {
  if (qtyCount.value === 1) return
  qtyCount.value = qtyCount.value - 1
}

onMounted(async () => {
  await getBooks()
  await getCustomers()
})
</script>

<template>
  <div class="custom-modal-backdrop">
    <div class="custom-modal">
      <div class="custom-modal__header">
        <div>Add new order</div>
        <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
      </div>

      <div class="custom-modal__body">
        <div class="text-sm fw-bold mb-2">Order Items:</div>
        <div>
          <div class="text-muted text-sm text-center my-3" v-if="!orderItems.length">No Order Items</div>

          <!-- Order Item card -->
          <div
            class="card bg-secondary mb-3"
            style="width: 100%; position: relative"
            v-for="(item, index) in orderItems"
            v-else
          >
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center gap-4">
                <div>
                  <img
                    :src="item.book.cover_image"
                    onerror="this.onerror=null; this.src='/fallback_image.jpg'"
                    :alt="`${item.book.title}'s Cover Image`"
                    style="max-height: 80px"
                    v-if="item.book.cover_image"
                  />
                  <div
                    v-else
                    class="bg-light d-flex justify-content-center align-items-center"
                    style="width: 53px; max-height: 80px; height: 80px"
                  >
                    <BookIcon class="text-black-50" />
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

            <button
              class="btn btn-danger btn-sm"
              :style="{
                width: 'max-content',
                height: 'max-content',
                position: 'absolute',
                right: '-10px',
                top: '-10px',
              }"
              @click="removeOrderItem(index)"
            >
              <TrashIcon />
            </button>
          </div>

          <div class="d-flex align-items-center justify-content-between" v-if="orderItems">
            <div>Total Amount:</div>
            <div class="text-primary fw-bold">
              {{ toRupiah(totalAmount, { floatingPoint: 0 }) }}
            </div>
          </div>
        </div>

        <hr />

        <div class="order-item-selector row row-cols-2">
          <!-- Cover image -->
          <div class="col-3">
            <img
              :src="selectedBook?.cover_image"
              onerror="this.onerror=null; this.src='/fallback_image.jpg'"
              :alt="`${selectedBook?.title}'s Cover Image`"
              style="height: 100%; width: 100%; object-fit: contain"
              v-if="selectedBook && selectedBook?.cover_image"
            />

            <div
              v-else
              class="bg-light d-flex justify-content-center align-items-center"
              style="width: 100%; height: 100%"
            >
              <BookIcon class="text-black-50" />
            </div>
          </div>

          <div class="col-9">
            <!-- Customer Selector -->
            <div class="input-group mb-3">
              <label class="input-group-text" for="customer-selector">Customer</label>
              <select class="form-select" id="customer-selector" v-model="selectedCustomer" v-if="customers">
                <option selected disabled>Choose...</option>
                <option v-for="customer in customers" :value="customer">
                  {{ customer.id }}
                  •
                  {{ customer.name }}
                </option>
              </select>
            </div>

            <!-- Book selector -->
            <div class="input-group mb-3">
              <label class="input-group-text" for="book-selector">Book</label>
              <select class="form-select" id="book-selector" v-model="selectedBook" v-if="books">
                <option selected disabled>Choose...</option>
                <option v-for="book in books" :value="book">
                  <!-- • -->
                  {{ book.title }}
                </option>
              </select>
            </div>

            <!-- Item Price -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="text-sm">Item Price</div>
              <div class="text-sm fw-bold text-success">
                {{ toRupiah(itemPricePreview, { floatingPoint: 0 }) }}
              </div>
            </div>

            <!-- Qty -->
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-sm">Qty {{ `(${selectedBook?.stock_qty ?? 0})` }}</div>
              <div class="form-group">
                <div class="input-group input-group-sm">
                  <button
                    class="btn btn-outline-success"
                    type="button"
                    id="button-decrease-book-count"
                    :disabled="qtyCount === 1"
                    @click="decrementQty"
                  >
                    -
                  </button>
                  <span class="border-top border-bottom text-sm px-3 d-flex align-items-center">{{ qtyCount }}</span>
                  <button
                    class="btn btn-outline-success"
                    type="button"
                    id="button-increase-book-count"
                    @click="incrementQty"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="row gap-2 mt-3">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm col"
                :disabled="!selectedBook"
                @click="addOrderItem"
              >
                Add
              </button>

              <button
                type="button"
                class="btn btn-outline-danger btn-sm col-2"
                @click="
                  () => {
                    selectedBook = undefined
                    qtyCount = 1
                  }
                "
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="custom-modal__footer">
        <button type="button" class="btn btn-light btn-sm" @click="$emit('close')">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" @click="submit" :disabled="orderItems.length === 0">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
