<script lang="ts" setup>
import toRupiah from "@develoka/angka-rupiah-js";
import { useMainStore } from "~/stores/useMainStore";

useHead({
  title: "Your Cart",
});

const router = useRouter();
const cartItems = ref();
const selectedItemIds = ref<number[]>([]);
const mainStore = useMainStore();
const editMode = ref(false);
const errorMsg = ref("");

const totalAmount = computed(() => {
  if (!selectedItemIds.value.length || !cartItems.value.length) return 0;

  let t = 0;
  for (let i = 0; i < cartItems.value.length; i++) {
    if (selectedItemIds.value.includes(cartItems.value[i].id)) {
      t += parseFloat(cartItems.value[i].item_price);
    }
  }

  return t;
});

async function getCartItems() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(`/api/v1/carts`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message;
    return;
  }

  cartItems.value = (result.data.value as { message: string; data: any }).data;
}

function checkout() {
  if (!selectedItemIds.value.length) return;

  mainStore.idstoCheckout = selectedItemIds.value;
  router.push("/checkout");
}

async function removeCartItem(id: number) {
  if (confirm("Are you sure?")) {
    await useApiFetch("/sanctum/csrf-cookie");

    const result = await useApiFetch("/api/v1/carts/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (result?.error.value) {
      errorMsg.value = result.error.value?.data.message;
      return;
    }

    await getCartItems();
    await mainStore.getCartItemsCount();
  }
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

      <div class="mb-4 d-flex justify-content-between">
        <div class="fw-bold fs-5">🛒 Your Cart</div>
        <div
          class="btn btn-outline-success btn-sm"
          @click="editMode = !editMode"
          v-if="cartItems && cartItems.length"
        >
          <PencilIcon />
          {{ editMode ? "Finish" : "Edit" }}
        </div>
      </div>

      <div>
        <div v-if="cartItems" v-for="item in cartItems" class="d-flex w-100">
          <div style="flex-grow: 1">
            <CardCartInfoItem
              show-check
              :cart-info="item"
              :checked="selectedItemIds.includes(item.id)"
              @check="
                () => {
                  if (item.unavailable) return;
                  selectedItemIds.push(item.id);
                }
              "
              @uncheck="
                () => {
                  if (item.unavailable) return;
                  selectedItemIds = selectedItemIds.filter(
                    (id) => id !== item.id
                  );
                }
              "
              @read-detail="$emit('close')"
            />
          </div>
          <div style="flex-shrink: 0" class="px-2 mb-3" v-if="editMode">
            <button
              class="btn btn-danger btn-sm h-100"
              @click="removeCartItem(item.id)"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      <div class="text-center text-muted text-sm mt-2">
        {{
          cartItems && cartItems.length ? "That's all." : "Your cart is empty."
        }}
      </div>

      <div
        style="height: 60px; width: 100%; position: fixed; bottom: 0; left: 0"
        class="d-flex"
      >
        <div
          class="bg-secondary border w-100 container h-100 d-flex align-items-center justify-content-between"
          style="z-index: 10"
        >
          <div>
            <div class="text-sm">
              Total:
              <span class="fw-bold">{{ selectedItemIds.length }} Items</span>
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
              class="btn btn-success"
              :disabled="selectedItemIds.length === 0"
              @click="checkout"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
