<script lang="ts" setup>
const form = ref({
  name: '',
  full_address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  is_active: false,
})
const errorMsg = ref<{
  name: string[]
  full_address: string[]
  city: string[]
  state: string[]
  country: string[]
  postal_code: string[]
  is_active: string[]
}>()

const emits = defineEmits(['refresh'])

async function submit() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/addresses', {
    method: 'POST',
    body: form.value,
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.errors
    return
  }

  emits('refresh')
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="addAddressModal"
      class="modal fade"
      id="addAddressModal"
      tabindex="-1"
      aria-labelledby="addAddressModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAddressModalLabel">Add new address</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="add-addrress-form" @submit.prevent="submit">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  aria-describedby="nameHelp"
                  required
                  v-model="form.name"
                />
                <div
                  id="nameHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.name"
                  v-for="message in errorMsg.name"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3">
                <label for="full_address" class="form-label">Full Address</label>
                <input
                  type="text"
                  class="form-control"
                  id="full_address"
                  aria-describedby="fullAddressHelp"
                  required
                  v-model="form.full_address"
                />
                <div
                  id="fullAddressHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.full_address"
                  v-for="message in errorMsg.full_address"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3">
                <label for="city" class="form-label">City</label>
                <input
                  type="text"
                  class="form-control"
                  id="city"
                  aria-describedby="cityHelp"
                  required
                  v-model="form.city"
                />
                <div
                  id="cityHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.city"
                  v-for="message in errorMsg.city"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3">
                <label for="state" class="form-label">State</label>
                <input
                  type="text"
                  class="form-control"
                  id="state"
                  aria-describedby="stateHelp"
                  required
                  v-model="form.state"
                />
                <div
                  id="stateHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.state"
                  v-for="message in errorMsg.state"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3">
                <label for="country" class="form-label">Country</label>
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
                />

                <div
                  id="countryHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.country"
                  v-for="message in errorMsg.country"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3">
                <label for="postal_code" class="form-label">Postal Code</label>
                <input
                  type="text"
                  class="form-control"
                  id="postal_code"
                  aria-describedby="postalCodeHelp"
                  required
                  v-model="form.postal_code"
                />
                <div
                  id="postalCodeHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.postal_code"
                  v-for="message in errorMsg.postal_code"
                >
                  {{ message }}
                </div>
              </div>

              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="is_active"
                  v-model="form.is_active"
                  aria-describedby="isActiveHelp"
                />
                <label class="form-check-label" for="is_active">Set as active</label>
                <div
                  id="isActiveHelp"
                  class="form-text text-xs text-danger"
                  v-if="errorMsg?.city"
                  v-for="message in errorMsg.city"
                >
                  {{ message }}
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" form="add-addrress-form" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
