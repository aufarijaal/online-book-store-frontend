<script lang="ts" setup>
import toRupiah from "@develoka/angka-rupiah-js";

useHead({
  title: "Check Out",
  script: [
    {
      type: "text/javascript",
      src: "https://app.sandbox.midtrans.com/snap/snap.js",
      "data-client-key": "SB-Mid-client-ZBIk3xOtAcKZf7-v",
    },
  ],
});

const pageData = ref();
const mainStore = useMainStore();
const snapToken = ref("");
const errorMsg = ref("");

const totalAmount = computed(() => {
  if (!pageData.value.length) return 0;

  let t = 0;
  for (let i = 0; i < pageData.value.length; i++) {
    t += parseFloat(pageData.value[i].item_price);
  }

  return t;
});

async function getCartItems() {
  if (!mainStore.idstoCheckout.length) return navigateTo("/carts");

  let s = "";

  for (let i = 0; i < mainStore.idstoCheckout.length; i++) {
    s += `ids[]=${mainStore.idstoCheckout[i]}&`;
  }

  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(`/api/v1/checkout?${s.slice(0, -1)}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message;
    return;
  }

  pageData.value = (
    result.data.value as { message: string; data: any }
  ).data.cartItems;

  snapToken.value = (
    result.data.value as { message: string; data: any }
  ).data.token;
}

async function pay() {
  window.snap.pay(snapToken.value);
}

onMounted(async () => {
  await getCartItems();
});
</script>

<template>
  <div id="carts-page">
    <main class="container px-3 px-sm-0" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="mb-4 fw-bold fs-5">Check out</div>

      <div class="mb-2">Items:</div>
      <CardCartInfoItem
        v-if="pageData"
        v-for="item in pageData"
        :cart-info="item"
        @read-detail="$emit('close')"
      />

      <div class="text-center text-muted text-sm mt-2">That's all.</div>

      <div
        style="height: 60px; width: 100%; position: fixed; bottom: 0; left: 0"
        class="d-flex"
      >
        <div
          class="bg-secondary border w-100 container h-100 d-flex align-items-center justify-content-between"
          style="z-index: 10"
        >
          <div v-if="pageData">
            <div class="text-sm">
              Total:
              <span class="fw-bold">{{ pageData.length }} Items</span>
            </div>
            <div class="text-sm">
              Amount:
              <span class="text-success fw-bold">{{
                toRupiah(totalAmount, { floatingPoint: 0 })
              }}</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-4">
            <!-- <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="select-all-cart-items"
              />
              <label class="form-check-label" for="select-all-cart-items">
                Select all
              </label>
            </div> -->
            <button
              class="btn btn-primary d-flex align-items-center gap-2"
              @click="pay"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m11.005 2l7.298 2.28a1 1 0 0 1 .702.955V7h2a1 1 0 0 1 1 1v2h-13V8a1 1 0 0 1 1-1h7V5.97l-6-1.876l-6 1.876v7.404a4 4 0 0 0 1.558 3.169l.189.136l4.253 2.9L14.787 17h-4.782a1 1 0 0 1-1-1v-4h13v4a1 1 0 0 1-1 1l-3.22.001c-.387.51-.857.96-1.4 1.33L11.005 22l-5.38-3.668a6 6 0 0 1-2.62-4.958V5.235a1 1 0 0 1 .702-.954z"
                />
              </svg>
              <span class="fw-bold">Pay</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
