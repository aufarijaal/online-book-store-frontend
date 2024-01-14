<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const props = defineProps<{
  customer: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
  };
}>();

const form = ref({
  id: props.customer.id,
  name: props.customer.name,
  email: props.customer.email,
  set_as_verified: props.customer.email_verified_at !== null,
});

const errorMsg = ref<{
  id: string[];
  name: string[];
  email: string[];
  set_as_verified: string[];
}>();

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    "/api/v1/admin/customers/" + props.customer.id,
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
        <div>Edit customer</div>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <div class="custom-modal__body">
        <form id="edit-customer-form" @submit.prevent="submit">
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

          <!-- Set as verified -->
          <div class="mb-3">
            <div class="input-group">
              <input
                type="checkbox"
                class="form-check-input"
                id="set_as_verified"
                v-model="form.set_as_verified"
                aria-describedby="setAsVerifiedHelp"
              />
              <label class="form-check-label ms-3" for="set_as_verified"
                >Set as verified</label
              >
              <div
                id="setAsVerifiedHelp"
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
        <button
          type="button"
          class="btn btn-light btn-sm"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit-customer-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
