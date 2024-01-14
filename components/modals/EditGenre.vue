<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const props = defineProps<{
  genre: Pick<Genre, "id" | "name" | "description">;
}>();

const form = ref({
  id: props.genre.id,
  name: props.genre.name,
  description: props.genre.description,
});

const errorMsg = ref<{
  id: string[];
  name: string[];
  description: string[];
}>();

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch("/api/v1/admin/genres/" + props.genre.id, {
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

          <!-- Description -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text fw-bold">Description</span>
              <input
                type="text"
                class="form-control"
                id="description"
                aria-describedby="descriptionHelp"
                required
                v-model="form.description"
              />
            </div>
            <div
              id="descriptionHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.description"
              v-for="message in errorMsg?.description"
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
          form="edit-genre-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
