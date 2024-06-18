<script lang="ts" setup>
const emits = defineEmits(['close'])

const cartItems = ref()
const selectedItemIds = ref<number[]>([])
const errorMsg = ref('')
const loading = ref(true)

async function getCartItems() {
  loading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/carts`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  cartItems.value = (result.data.value as { message: string; data: any }).data
  loading.value = false
}

onMounted(async () => {
  await getCartItems()
})
</script>

<template>
  <div class="custom-modal-backdrop">
    <div class="custom-modal">
      <div class="custom-modal__header">
        <div class="fw-bold">Your cart</div>
        <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
      </div>

      <div class="custom-modal__body px-2" style="max-height: 500px; overflow-y: auto">
        <!-- Alert -->
        <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="placeholder-glow d-flex flex-column gap-3" v-if="loading && !cartItems">
          <div v-for="n in 2" class="placeholder w-100 rounded-1" style="height: 80px"></div>
        </div>

        <CardCartInfoItem :show-check="false" v-if="cartItems && !loading" v-for="item in cartItems" :cart-info="item"
          :checked="selectedItemIds.includes(item.id)" @check="() => {
            if (item.unavailable) return
            selectedItemIds.push(item.id)
          }
            " @uncheck="() => {
              if (item.unavailable) return
              selectedItemIds = selectedItemIds.filter((id) => id !== item.id)
            }
              " @read-detail="$emit('close')" />

        <div class="text-muted text-sm py-4 text-center" v-if="!loading && cartItems && !cartItems.length">Your cart is
          empty</div>
      </div>

      <div class="custom-modal__footer" v-if="cartItems && cartItems.length">
        <NuxtLink class="btn btn-primary w-100" to="/carts" @click="$emit('close')"> Go to carts page </NuxtLink>
      </div>
    </div>
  </div>
</template>
