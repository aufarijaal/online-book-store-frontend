<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const props = defineProps<{ customerId: number }>();
const form = ref({
  id: props.customerId,
  password: "",
});

const errorMsg = ref<{
  id: string[];
  password: string[];
}>();

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/admin/customers/${form.value.id}/change-password`,
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
        <div>Change password</div>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <div class="custom-modal__body">
        <form id="change-customer-password-form" @submit.prevent="submit">
          <!-- Password -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">New Password</span>
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
          form="change-customer-password-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
