<script lang="ts" setup>
import toRupiah from '@develoka/angka-rupiah-js'

const props = defineProps<{
  cartInfo: any
  checked?: boolean
  showCheck?: boolean
}>()
const emits = defineEmits(['check', 'uncheck', 'readDetail'])
</script>

<template>
  <div
    class="d-flex align-items-center"
    :title="cartInfo.unavailable ? 'This item is unavailable due to insufficient stock.' : cartInfo.book.title"
  >
    <div class="form-check" v-if="showCheck">
      <input
        class="form-check-input"
        type="checkbox"
        @change="
          (e) => {
            if ((e.target as HTMLInputElement).checked) {
              $emit('check')
            } else $emit('uncheck')
          }
        "
        :checked="checked"
        :disabled="cartInfo.unavailable"
      />
    </div>
    <div
      :class="['card bg-secondary mb-3', cartInfo.unavailable ? 'border-danger' : '']"
      :style="{
        width: '100%',
        userSelect: cartInfo.unavailable ? 'none' : 'auto',
        cursor: cartInfo.unavailable ? 'not-allowed' : 'default',
      }"
    >
      <div class="card-body p-3 pb-4" style="position: relative">
        <div class="d-flex justify-content-between align-items-center gap-4">
          <NuxtLink :to="`/books/${cartInfo.book.slug}`" @click="$emit('readDetail')">
            <img
              :src="cartInfo.book.cover_image"
              onerror="this.onerror=null; this.src='/fallback_image.jpg'"
              :alt="`${cartInfo.book.title}'s Cover Image`"
              style="max-height: 80px"
            />
          </NuxtLink>
          <div style="flex-grow: 1">
            <h4 class="card-title text-lg">{{ cartInfo.book.title }}</h4>
            <div>
              <ul style="margin: 0 !important; padding: 0 !important">
                <li class="d-flex justify-content-between align-items-center text-sm mb-2">
                  <div style="font-weight: 500">Qty</div>
                  <div>{{ cartInfo.qty }}</div>
                </li>
                <li class="d-flex justify-content-between align-items-center text-sm">
                  <div style="font-weight: 500">Item Price</div>
                  <div class="text-primary fw-bold">
                    {{ toRupiah(cartInfo.item_price, { floatingPoint: 0 }) }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-if="cartInfo.unavailable"
          :style="{
            position: 'absolute',
            bottom: '0',
            left: '0',
          }"
          class="text-xs bg-danger w-100 d-flex justify-content-center text-white"
        >
          Not available
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
