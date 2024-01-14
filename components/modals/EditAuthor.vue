<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const props = defineProps<{
  author: Pick<Author, "id" | "name" | "dob" | "nationality">;
}>();

const form = ref({
  id: props.author.id,
  name: props.author.name,
  dob: props.author.dob,
  nationality: props.author.nationality,
});

const errorMsg = ref<{
  id: string[];
  name: string[];
  dob: string[];
  nationality: string[];
}>();

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch("/api/v1/admin/authors/" + props.author.id, {
    method: "PUT",
    body: form.value,
    headers: {
      Accept: "application/json",
    },
  });

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
        <div>Edit author</div>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <div class="custom-modal__body">
        <form id="edit-author-form" @submit.prevent="submit">
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

          <!-- Dob -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Date of Birth</span>
              <input
                type="date"
                class="form-control"
                id="dob"
                aria-describedby="dobHelp"
                required
                v-model="form.dob"
              />
            </div>
            <div
              id="dobHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.dob"
              v-for="message in errorMsg?.dob"
            >
              {{ message }}
            </div>
          </div>

          <!-- Nationality -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Nationality</span>
              <input
                type="text"
                class="form-control"
                id="nationality"
                aria-describedby="nationalityHelp"
                required
                v-model="form.nationality"
              />
            </div>
            <div
              id="nationalityHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.nationality"
              v-for="message in errorMsg?.nationality"
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
          form="edit-author-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
