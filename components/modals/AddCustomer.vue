<script lang="ts" setup>
const emits = defineEmits(['refresh', 'close'])
const form = ref({
  name: '',
  email: '',
  password: '',
  set_as_verified: false,
})

const errorMsg = ref<{
  name: string[]
  email: string[]
  password: string[]
  set_as_verified: string[]
}>()

async function submit() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/admin/customers', {
    method: 'POST',
    body: form.value,
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
</script>

<template>
  <div class="custom-modal-backdrop">
    <div class="custom-modal">
      <div class="custom-modal__header">
        <div>Add new customer</div>
        <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')"></button>
      </div>

      <div class="custom-modal__body">
        <form id="add-customer-form" @submit.prevent="submit">
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

          <!-- Email -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Email</span>
              <input
                type="email"
                class="form-control"
                id="email"
                aria-describedby="emailHelp"
                required
                v-model="form.email"
              />
            </div>
            <div
              id="emailHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.email"
              v-for="message in errorMsg?.email"
            >
              {{ message }}
            </div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Password</span>
              <input
                type="password"
                class="form-control"
                id="password"
                aria-describedby="passwordHelp"
                required
                v-model="form.password"
              />
            </div>
            <div
              id="passwordHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.password"
              v-for="message in errorMsg?.password"
            >
              {{ message }}
            </div>
          </div>

          <!-- Set as verified -->
          <div class="mb-3">
            <div class="input-group">
              <input
                type="checkbox"
                class="form-check-input"
                id="set_as_verified"
                v-model="form.set_as_verified"
                aria-describedby="isActiveHelp"
              />
              <label class="form-check-label ms-3" for="set_as_verified">Set as verified</label>
              <div
                id="isActiveHelp"
                class="form-text text-xs text-danger"
                v-if="errorMsg?.set_as_verified"
                v-for="message in errorMsg.set_as_verified"
              >
                {{ message }}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="custom-modal__footer">
        <button type="button" class="btn btn-light btn-sm" @click="$emit('close')">Cancel</button>
        <button type="submit" form="add-customer-form" class="btn btn-primary btn-sm">Submit</button>
      </div>
    </div>
  </div>
</template>
