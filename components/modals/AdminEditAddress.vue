<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const props = defineProps<{
  address: Address;
}>();

const form = ref({
  id: props.address.id,
  user_id: props.address.user_id,
  name: props.address.name,
  full_address: props.address.full_address,
  city: props.address.city,
  state: props.address.state,
  country: props.address.country,
  postal_code: props.address.postal_code,
  is_active: props.address.is_active,
});

const errorMsg = ref<{
  id: string[];
  user_id: string[];
  name: string[];
  full_address: string[];
  city: string[];
  state: string[];
  country: string[];
  postal_code: string[];
  is_active: string[];
}>();

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    "/api/v1/admin/addresses/" + props.address.id,
    {
      method: "PUT",
      body: form.value,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (result?.error.value) {
    alert(result.error.value.message);
    errorMsg.value = result.error.value?.data.errors;
    return;
  }
  emits("refresh");
  emits("close");
}
</script>

<template>
  <div class="custom-modal-backdrop">
    <div class="custom-modal">
      <div class="custom-modal__header">
        <div>Edit genre</div>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <div class="custom-modal__body">
        <form id="edit-genre-form" @submit.prevent="submit">
          <!-- Name -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Name</span>
              <input
                type="text"
                class="form-control"
                id="name"
                aria-describedby="nameHelp"
                required
                v-model="form.name"
              />
            </div>
            <div
              id="nameHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.name"
              v-for="message in errorMsg?.name"
            >
              {{ message }}
            </div>
          </div>

          <!-- Customer Reference -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Customer ID</span>
            <input
              type="text"
              class="form-control"
              id="user_id"
              aria-describedby="customerHelp"
              required
              readonly
              disabled
              v-model="form.user_id"
            />
            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.user_id"
              v-for="message in errorMsg.user_id"
            >
              {{ message }}
            </div>
          </div>

          <!-- Full Address -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Full Address</span>
              <input
                type="text"
                class="form-control"
                id="full_adress"
                aria-describedby="fullAddressHelp"
                required
                v-model="form.full_address"
              />
            </div>
            <div
              id="fullAddressHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.full_address"
              v-for="message in errorMsg?.full_address"
            >
              {{ message }}
            </div>
          </div>

          <!-- City -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">City</span>
              <input
                type="text"
                class="form-control"
                id="city"
                aria-describedby="cityHelp"
                required
                v-model="form.city"
              />
            </div>
            <div
              id="cityHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.city"
              v-for="message in errorMsg?.city"
            >
              {{ message }}
            </div>
          </div>

          <!-- State -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">State</span>
              <input
                type="text"
                class="form-control"
                id="state"
                aria-describedby="stateHelp"
                required
                v-model="form.state"
              />
            </div>
            <div
              id="stateHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.state"
              v-for="message in errorMsg?.state"
            >
              {{ message }}
            </div>
          </div>

          <!-- Country -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Country</span>
              <!-- <input
                type="text"
                class="form-control"
                id="country"
                aria-describedby="countryHelp"
                required
                v-model="form.country"
              /> -->
              <CountryCodeSelector
                required
                class="form-control"
                id="country"
                aria-describedby="countryHelp"
                v-model="form.country"
                :default="form.country"
              />
            </div>
            <div
              id="countryHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.country"
              v-for="message in errorMsg?.country"
            >
              {{ message }}
            </div>
          </div>

          <!-- Postal Code -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Postal Code</span>
              <input
                type="text"
                class="form-control"
                id="postal_code"
                aria-describedby="postalCodeHelp"
                required
                v-model="form.postal_code"
              />
            </div>
            <div
              id="postalCodeHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.postal_code"
              v-for="message in errorMsg?.postal_code"
            >
              {{ message }}
            </div>
          </div>

          <!-- Is Active -->
          <div class="mb-3">
            <div class="input-group">
              <input
                type="checkbox"
                class="form-check-input"
                id="is_active"
                v-model="form.is_active"
                aria-describedby="isActiveHelp"
              />
              <label class="form-check-label ms-3" for="is_active"
                >Set as active</label
              >
              <div
                id="isActiveHelp"
                class="form-text text-xs text-danger"
                v-if="errorMsg?.city"
                v-for="message in errorMsg.city"
              >
                {{ message }}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="custom-modal__footer">
        <button
          type="button"
          class="btn btn-light btn-sm"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit-genre-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
